function getRedisConfig() {
  const url =
    process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  return { url, token };
}

async function redisCommand(command: string[]): Promise<unknown> {
  const { url, token } = getRedisConfig();

  if (!url || !token) {
    throw new Error(
      "Storage not configured. Connect Upstash Redis in Vercel and redeploy."
    );
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(command),
  });

  if (!response.ok) {
    throw new Error(`Storage request failed (${response.status})`);
  }

  const data = (await response.json()) as { result?: unknown };
  return data.result ?? null;
}

export async function redisGet(key: string): Promise<string | null> {
  const result = await redisCommand(["GET", key]);
  return typeof result === "string" ? result : null;
}

export async function redisSet(key: string, value: string): Promise<void> {
  await redisCommand(["SET", key, value]);
}

export async function redisDel(key: string): Promise<void> {
  await redisCommand(["DEL", key]);
}

export async function redisExpire(key: string, seconds: number): Promise<void> {
  await redisCommand(["EXPIRE", key, String(seconds)]);
}
