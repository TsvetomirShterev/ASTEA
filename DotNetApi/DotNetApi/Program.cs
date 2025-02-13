using DotNetApi.Data;
using DotNetApi.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var connectionString = "Host=localhost;Port=5432;Database=mydatabase;Username=postgres;Password=YourStrongPassword";

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(connectionString));


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularDev", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowAngularDev");

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapPost("/api/login", async (AppDbContext db, User loginData) =>
{
    var user = await db.Users
    .FirstOrDefaultAsync(u => u.Username == loginData.Username && u.Password == loginData.Password);

    return user is null ?
    Results.Unauthorized()
    : Results.Ok(new { user.Id, user.Username, user.Email });
});

app.MapGet("/api/users/{id:int}", async (AppDbContext db, int id) =>
{
    var user = await db.Users
    .FindAsync(id);

    return user is not null ? 
    Results.Ok(user) 
    : Results.NotFound();
});

app.MapPut("/api/users/{id:int}/password", async (AppDbContext db, int id, User updatedData) =>
{
    var user = await db.Users.FindAsync(id);

    if (user is null)
    {
        return Results.NotFound();
    }

    user.Password = updatedData.Password;
    await db.SaveChangesAsync();

    return Results.Ok(new { message = "Password updated successfully." });
});

app.Run();

