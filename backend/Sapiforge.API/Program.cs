using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Sapiforge.Data;
using Sapiforge.Data.Repositories;
using Sapiforge.Domain.Interfaces;
using Sapiforge.Service;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ── Veritabanı bağlantısı ──────────────────────────────────────────
var provider = builder.Configuration["DatabaseProvider"] ?? "PostgreSQL";

builder.Services.AddDbContext<AppDbContext>(options =>
{
    if (provider.Equals("Sqlite", StringComparison.OrdinalIgnoreCase))
    {
        options.UseSqlite(builder.Configuration.GetConnectionString("SqliteConnection"));
    }
    else
    {
        options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
    }
});

// ── Repository kayıtları ───────────────────────────────────────────
builder.Services.AddScoped<IRequestRepository, RequestRepository>();
builder.Services.AddScoped<IMockRepository, MockRepository>();
builder.Services.AddScoped<ICollectionRepository, CollectionRepository>();
builder.Services.AddScoped<IEnvironmentRepository, EnvironmentRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// ── Servis kayıtları ───────────────────────────────────────────────
builder.Services.AddScoped<IRequestService, RequestService>();
builder.Services.AddScoped<IMockService, MockService>();
builder.Services.AddScoped<ICollectionService, CollectionService>();
builder.Services.AddScoped<IEnvironmentService, EnvironmentService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IUserService, UserService>();

// ── HttpClient — ProxyService için ────────────────────────────────
builder.Services.AddHttpClient<IProxyService, ProxyService>();

// ── JWT Authentication ─────────────────────────────────────────────
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]!)),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ClockSkew = TimeSpan.Zero
        };
    });

// ── CORS — React frontend'e izin ver ──────────────────────────────
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ── Global hata yönetimi ───────────────────────────────────────────
app.UseMiddleware<Sapiforge.API.Middleware.ExceptionHandlerMiddleware>();

// ── Middleware pipeline ────────────────────────────────────────────
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// ── Veri bütünlüğü kontrolü ────────────────────────────────────────
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    
    // Veritabanının oluşturulduğundan emin ol (Özellikle SQLite için kritik)
    await context.Database.EnsureCreatedAsync();

    var activeCount = await context.Environments.CountAsync(e => e.IsActive);
    if (activeCount > 1)
    {
        // Eğer birden fazla aktif varsa, en yeni olan hariç hepsini pasif yap
        var activeEnvs = await context.Environments
            .Where(e => e.IsActive)
            .OrderByDescending(e => e.CreatedAt)
            .ToListAsync();

        for (int i = 1; i < activeEnvs.Count; i++)
        {
            activeEnvs[i].IsActive = false;
        }
        await context.SaveChangesAsync();
    }
}

app.Run();