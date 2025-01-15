import { redis } from '../config/redis.js';

export const cacheMiddleware = (duration) => {
    return async (req, res, next) => {
        if (!redis) {
            return next();
        }

        try {
            const key = `cache:${req.originalUrl}`;
            const cachedData = await redis.get(key);

            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }

            // Store the original res.json function
            const originalJson = res.json;

            // Override res.json method
            res.json = function(body) {
                if (body.success !== false) { // Only cache successful responses
                    redis.setex(key, duration, JSON.stringify(body));
                }
                return originalJson.call(this, body);
            };

            next();
        } catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    };
};