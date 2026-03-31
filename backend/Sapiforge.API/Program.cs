using Microsoft.EntityFrameworkCore;
using Sapiforge.Data;
using Sapiforge.Data.Repositories;
using Sapiforge.Domain.Interfaces;
using Sapiforge.Service;

var builder = WebApplication.CreateBuilder(args);

// ── Veritabanı bağlantısı ──────────────────────────────────────────
// PostgreSQL bağlantısı appsettings.json'dan okunur
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ── Repository kayıtları ───────────────────────────────────────────
// Her interface için hangi sınıfın kullanılacağını DI container'a bildiriyoruz
builder.Services.AddScoped<IRequestRepository, RequestRepository>();
builder.Services.AddScoped<IMockRepository, MockRepository>();
builder.Services.AddScoped<ICollectionRepository, CollectionRepository>();
builder.Services.AddScoped<IEnvironmentRepository, EnvironmentRepository>();

// ── Servis kayıtları ───────────────────────────────────────────────
builder.Services.AddScoped<IRequestService, RequestService>();
builder.Services.AddScoped<IMockService, MockService>();
builder.Services.AddScoped<ICollectionService, CollectionService>();
builder.Services.AddScoped<IEnvironmentService, EnvironmentService>();

// ── HttpClient — ProxyService için ────────────────────────────────
// ProxyService dış API'ye istek atmak için HttpClient kullanır
builder.Services.AddHttpClient<IProxyService, ProxyService>();

// ── CORS — React frontend'e izin ver ──────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Vite varsayılan portu
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Navigation property'lerin döngüsel referansını engeller
        options.JsonSerializerOptions.ReferenceHandler = 
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ── Middleware pipeline ────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

app.Run();