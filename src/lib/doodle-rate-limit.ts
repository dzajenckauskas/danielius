const DELIVERY_LIMIT = 5;
export const DELIVERY_WINDOW_MS = 10 * 60 * 1000;

class DoodleRateLimiter {
  private readonly deliveries = new Map<string, number[]>();

  isAllowed(clientId: string, now = Date.now()) {
    return this.getRecent(clientId, now).length < DELIVERY_LIMIT;
  }

  record(clientId: string, now = Date.now()) {
    this.deliveries.set(clientId, [...this.getRecent(clientId, now), now]);
  }

  reset() {
    this.deliveries.clear();
  }

  private getRecent(clientId: string, now: number) {
    const recent = (this.deliveries.get(clientId) || [])
      .filter((time) => now - time < DELIVERY_WINDOW_MS);
    this.deliveries.set(clientId, recent);
    return recent;
  }
}

export const doodleRateLimiter = new DoodleRateLimiter();
