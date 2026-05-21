const redisClient = require('../config/redis');

const authLimiter = async (req, res, next) => {

    const ip = req.ip;

    const key = `rate_limit:${ip}`;

    try {

        const requests = await redisClient.get(key);

        if (requests === null) {

            await redisClient.set(
                key,
                1,
                {
                    EX: 60
                }
            );

            return next();
        }

        if (parseInt(requests) >= 5) {

            return res.status(429).json({
                message: 'Too many requests. Try again later.'
            });
        }

        await redisClient.incr(key);

        next();

    } catch (error) {

        res.status(500).json({
            message: 'Rate limiter error'
        });
    }
};

module.exports = authLimiter;