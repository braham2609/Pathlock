public record TaskItem(int Id, string Description, bool IsCompleted);

public record CreateTaskRequest(string Description);

public record UpdateTaskRequest(string? Description, bool? IsCompleted);
