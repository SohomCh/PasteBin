const redis = require("redis");

const client = redis.createClient({
	url: process.env.REDIS_URL,
});

client.on("error", (err) => {
	console.error("Redis Error:", err);
});

(async () => {
	try {
		await client.connect();
	} catch (err) {
		console.error("Redis connect error:", err);
	}
})();

module.exports = client;