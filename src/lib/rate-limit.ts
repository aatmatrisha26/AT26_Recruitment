/**
 * Simple in-memory rate limiter for server actions.
 * No external dependencies needed — suitable for college-scale (600-800 users).
 * 
 * Uses a sliding window counter per key.
 * Automatically cleans up expired entries to prevent memory leaks.
 */

interface RateLimitEntry {
    count: number;
    firstRequest: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup expired entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;

    for (const [key, entry] of store.entries()) {
        if (now - entry.firstRequest > windowMs) {
            store.delete(key);
        }
    }
}

/**
 * Rate limit by identifier (SRN, IP, etc.)
 * @param identifier - Unique key (e.g., user SRN or IP)
 * @param action - Action name (e.g., 'apply', 'score', 'login')
 * @param maxRequests - Max allowed requests in the window
 * @param windowSeconds - Time window in seconds
 * @returns null if allowed, or error message if rate limited
 */
export function rateLimit(
    identifier: string,
    action: string,
    maxRequests: number,
    windowSeconds: number
): string | null {
    const windowMs = windowSeconds * 1000;
    const key = `${action}:${identifier}`;
    const now = Date.now();

    cleanup(windowMs);

    const entry = store.get(key);

    if (!entry) {
        // First request
        store.set(key, { count: 1, firstRequest: now });
        return null;
    }

    // Window expired — reset
    if (now - entry.firstRequest > windowMs) {
        store.set(key, { count: 1, firstRequest: now });
        return null;
    }

    // Within window
    if (entry.count >= maxRequests) {
        const waitSeconds = Math.ceil((windowMs - (now - entry.firstRequest)) / 1000);
        return `Too many requests. Please wait ${waitSeconds}s before trying again.`;
    }

    entry.count++;
    return null;
}

/**
 * Validate that a string is a valid UUID v4
 */
export function isValidUUID(str: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

/**
 * Sanitize string input — trim and limit length
 */
export function sanitize(input: string, maxLength: number = 500): string {
    if (typeof input !== 'string') return '';
    return input.trim().slice(0, maxLength);
}
