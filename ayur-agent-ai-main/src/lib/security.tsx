/**
 * Security Utilities
 * Rate limiting, input sanitization, and security helpers
 */

/**
 * Simple rate limiter for API calls
 * Prevents abuse by limiting requests per time window
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  /**
   * Check if request should be allowed
   * @param key Unique identifier (e.g., user ID, IP address)
   * @returns true if request is allowed, false if rate limited
   */
  checkLimit(key: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];

    // Remove requests outside the time window
    const validRequests = userRequests.filter(
      (timestamp) => now - timestamp < this.windowMs
    );

    if (validRequests.length >= this.maxRequests) {
      return false; // Rate limit exceeded
    }

    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);

    return true;
  }

  /**
   * Reset rate limit for a specific key
   */
  reset(key: string): void {
    this.requests.delete(key);
  }

  /**
   * Get remaining requests for a key
   */
  getRemaining(key: string): number {
    const now = Date.now();
    const userRequests = this.requests.get(key) || [];
    const validRequests = userRequests.filter(
      (timestamp) => now - timestamp < this.windowMs
    );
    return Math.max(0, this.maxRequests - validRequests.length);
  }
}

/**
 * Sanitize user input to prevent XSS attacks
 * Removes potentially dangerous HTML/script tags
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';

  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

/**
 * Validate and sanitize email address
 */
export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim().replace(/[^a-z0-9@._+-]/g, '');
};

/**
 * Check if string contains SQL injection patterns
 */
export const hasSQLInjection = (input: string): boolean => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/i,
    /(--|;|\/\*|\*\/)/,
    /('|(\\'))/,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
};

/**
 * Generate secure random token
 */
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join(
    ''
  );
};

/**
 * Hook for implementing rate limiting in React components
 */
export const useRateLimit = (
  maxRequests: number = 5,
  windowMs: number = 60000
) => {
  const limiterRef = React.useRef(new RateLimiter(maxRequests, windowMs));

  const checkLimit = React.useCallback((key: string = 'default') => {
    return limiterRef.current.checkLimit(key);
  }, []);

  const getRemaining = React.useCallback((key: string = 'default') => {
    return limiterRef.current.getRemaining(key);
  }, []);

  const reset = React.useCallback((key: string = 'default') => {
    limiterRef.current.reset(key);
  }, []);

  return { checkLimit, getRemaining, reset };
};

/**
 * Debounced input to prevent rapid submissions
 */
export const useDebouncedSubmit = (
  callback: (...args: any[]) => void,
  delay: number = 500
) => {
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const isProcessingRef = React.useRef(false);

  const debouncedCallback = React.useCallback(
    (...args: any[]) => {
      if (isProcessingRef.current) return;

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        isProcessingRef.current = true;
        callback(...args);
        setTimeout(() => {
          isProcessingRef.current = false;
        }, delay);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
};

/**
 * Content Security Policy helpers
 */
export const CSP_DIRECTIVES = {
  defaultSrc: ["'self'"],
  scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Adjust based on needs
  styleSrc: ["'self'", "'unsafe-inline'"],
  imgSrc: ["'self'", 'data:', 'https:'],
  connectSrc: ["'self'", 'https://api.google.com', 'https://*.supabase.co'],
  fontSrc: ["'self'", 'data:'],
  objectSrc: ["'none'"],
  mediaSrc: ["'self'"],
  frameSrc: ["'none'"],
};

/**
 * Validate file upload (type and size)
 */
export const validateFileUpload = (
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  } = {}
): { valid: boolean; error?: string } => {
  const { maxSizeMB = 5, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options;

  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type must be one of: ${allowedTypes.join(', ')}`,
    };
  }

  return { valid: true };
};

/**
 * Encrypt sensitive data before storing (simple XOR cipher for client-side)
 * Note: For production, use proper encryption libraries
 */
export const encryptData = (data: string, key: string): string => {
  let result = '';
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(
      data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return btoa(result); // Base64 encode
};

/**
 * Decrypt data encrypted with encryptData
 */
export const decryptData = (encrypted: string, key: string): string => {
  const data = atob(encrypted); // Base64 decode
  let result = '';
  for (let i = 0; i < data.length; i++) {
    result += String.fromCharCode(
      data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return result;
};

import React from 'react';
