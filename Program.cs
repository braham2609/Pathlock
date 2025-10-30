using System.Collections.Concurrent;

var builder = WebApplication.CreateBuilder(args);

// Allow frontend dev server
const string CorsPolicy = "FrontendPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, p => p
        .WithOrigins(
            "http://localhost:5173",
            "http://127.0.0.1:5173"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
    );
});

var app = builder.Build();
app.UseCors(CorsPolicy);

// In-memory storage
var store = new ConcurrentDictionary<int, TaskItem>();
var nextId = 0;

var tasks = app.MapGroup("/api/tasks");

// GET /api/tasks
tasks.MapGet("/", () => Results.Ok(store.Values.OrderBy(t => t.Id)));

// POST /api/tasks
// { "description": "Buy milk" }
tasks.MapPost("/", (CreateTaskRequest req) =>
{
    if (string.IsNullOrWhiteSpace(req.Description))
        return Results.BadRequest(new { message = "Description is required" });

    var id = Interlocked.Increment(ref nextId);
    var task = new TaskItem(id, req.Description.Trim(), false);
    store[id] = task;

    return Results.Created($"/api/tasks/{id}", task);
});

// PUT /api/tasks/{id}
// { "description": "...", "isCompleted": true }
tasks.MapPut("/{id:int}", (int id, UpdateTaskRequest req) =>
{
    if (!store.TryGetValue(id, out var existing))
        return Results.NotFound();

    var desc = req.Description is null ? existing.Description : req.Description.Trim();
    var done = req.IsCompleted ?? existing.IsCompleted;

    var updated = existing with { Description = desc, IsCompleted = done };
    store[id] = updated;
    return Results.Ok(updated);
});

// DELETE /api/tasks/{id}
tasks.MapDelete("/{id:int}", (int id) =>
{
    if (!store.TryRemove(id, out _))
        return Results.NotFound();
    return Results.NoContent();
});

// Health
app.MapGet("/", () => new { status = "ok" });

// Prefer fixed port for convenience
app.Urls.Add("http://localhost:5089");

app.Run();
