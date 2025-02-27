export abstract class CacheRepository {
  abstract set(key: string, value: string): Promise<void> // TTL, time to live
  abstract get(key: string): Promise<string | null>
  abstract delete(key: string): Promise<void>
}
