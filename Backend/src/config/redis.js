import Redis from 'ioredis'

export const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    maxRetriesPerRequest: 1
})

redis.on('error', (error) => {
    console.error('Redis Error:', error)
})

redis.on('connect', () => {
    console.log('Redis Connected Successfully')
})