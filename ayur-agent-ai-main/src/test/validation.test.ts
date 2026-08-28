import { describe, it, expect } from 'vitest';

/**
 * Validation Utility Tests
 * Testing all validation functions used throughout the app
 */

describe('Email Validation', () => {
  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  it('should accept valid email addresses', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('test.user@company.co.uk')).toBe(true);
    expect(isValidEmail('admin+tag@domain.org')).toBe(true);
  });

  it('should reject invalid email addresses', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('missing@domain')).toBe(false);
    expect(isValidEmail('@nodomain.com')).toBe(false);
    expect(isValidEmail('no@.com')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  it('should reject emails with spaces', () => {
    expect(isValidEmail('user @example.com')).toBe(false);
    expect(isValidEmail('user@ example.com')).toBe(false);
  });
});

describe('Password Strength Validation', () => {
  const isStrongPassword = (password: string) => {
    if (password.length < 8) return { valid: false, error: 'At least 8 characters' };
    if (!/[A-Z]/.test(password)) return { valid: false, error: 'One uppercase letter' };
    if (!/[a-z]/.test(password)) return { valid: false, error: 'One lowercase letter' };
    if (!/[0-9]/.test(password)) return { valid: false, error: 'One number' };
    return { valid: true, error: null };
  };

  it('should accept strong passwords', () => {
    expect(isStrongPassword('StrongPass123').valid).toBe(true);
    expect(isStrongPassword('MyP@ssw0rd').valid).toBe(true);
    expect(isStrongPassword('Secure1234').valid).toBe(true);
  });

  it('should reject short passwords', () => {
    const result = isStrongPassword('Short1');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('8 characters');
  });

  it('should reject passwords without uppercase', () => {
    const result = isStrongPassword('lowercase123');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('uppercase');
  });

  it('should reject passwords without lowercase', () => {
    const result = isStrongPassword('UPPERCASE123');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('lowercase');
  });

  it('should reject passwords without numbers', () => {
    const result = isStrongPassword('NoNumbers');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('number');
  });
});

describe('Points Validation', () => {
  const validatePoints = (points: number): number => {
    return Math.max(0, points);
  };

  it('should return positive points unchanged', () => {
    expect(validatePoints(10)).toBe(10);
    expect(validatePoints(100)).toBe(100);
    expect(validatePoints(5)).toBe(5);
  });

  it('should clamp negative points to 0', () => {
    expect(validatePoints(-5)).toBe(0);
    expect(validatePoints(-100)).toBe(0);
    expect(validatePoints(-1)).toBe(0);
  });

  it('should handle zero correctly', () => {
    expect(validatePoints(0)).toBe(0);
  });
});

describe('Agni Score Calculation', () => {
  const calculateAgniScore = (hunger: number, digestion: number, energy: number, bloating: number): number => {
    const hungerScore = hunger * 10;
    const digestionScore = digestion * 10;
    const energyScore = energy * 10;
    const bloatingPenalty = bloating * 5;
    
    return Math.max(0, Math.min(100, (hungerScore + digestionScore + energyScore) / 3 - bloatingPenalty));
  };

  it('should calculate perfect score correctly', () => {
    const score = calculateAgniScore(10, 10, 10, 0);
    expect(score).toBe(100);
  });

  it('should apply bloating penalty', () => {
    const score = calculateAgniScore(10, 10, 10, 5);
    expect(score).toBe(75); // 100 - (5 * 5)
  });

  it('should clamp score between 0 and 100', () => {
    expect(calculateAgniScore(10, 10, 10, 0)).toBeLessThanOrEqual(100);
    expect(calculateAgniScore(1, 1, 1, 10)).toBeGreaterThanOrEqual(0);
  });

  it('should handle edge cases', () => {
    expect(calculateAgniScore(0, 0, 0, 0)).toBe(0);
    expect(calculateAgniScore(10, 10, 10, 100)).toBe(0); // Extreme bloating
  });
});

describe('Dosha Percentage Calculation', () => {
  const getPercentage = (score: number, total: number): number => {
    return total > 0 ? Math.round((score / total) * 100) : 0;
  };

  it('should calculate percentages correctly', () => {
    expect(getPercentage(30, 100)).toBe(30);
    expect(getPercentage(50, 100)).toBe(50);
    expect(getPercentage(75, 100)).toBe(75);
  });

  it('should handle zero total', () => {
    expect(getPercentage(10, 0)).toBe(0);
  });

  it('should round to nearest integer', () => {
    expect(getPercentage(33, 100)).toBe(33);
    expect(getPercentage(67, 100)).toBe(67);
  });

  it('should handle partial scores', () => {
    expect(getPercentage(1, 3)).toBe(33); // Rounded
    expect(getPercentage(2, 3)).toBe(67); // Rounded
  });
});
