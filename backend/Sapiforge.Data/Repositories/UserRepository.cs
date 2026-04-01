namespace Sapiforge.Data.Repositories;

using Microsoft.EntityFrameworkCore;
using Sapiforge.Domain.Interfaces;
using Sapiforge.Domain.Models;

/// <summary>
/// Kullanıcı yönetimi için veritabanı işlemlerini yönetir.
/// IUserRepository interface'ini implemente eder.
/// </summary>
public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;

    /// <summary>DbContext dependency injection ile enjekte edilir</summary>
    public UserRepository(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>Email'e göre kullanıcı getirir</summary>
    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _context.Users
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    /// <summary>ID'ye göre kullanıcı getirir</summary>
    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    /// <summary>Yeni kullanıcı kaydeder</summary>
    public async Task<User> AddAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    /// <summary>Email adresi kayıtlı mı kontrol eder</summary>
    public async Task<bool> ExistsAsync(string email)
    {
        return await _context.Users.AnyAsync(u => u.Email == email);
    }

    /// <summary>Kullanıcı bilgilerini günceller</summary>
    public async Task<User> UpdateAsync(User user)
    {
    _context.Users.Update(user);
    await _context.SaveChangesAsync();
    return user;
    }
}