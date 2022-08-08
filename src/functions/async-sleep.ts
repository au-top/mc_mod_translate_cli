export const asyncSleep = (timeMs: number) => new Promise((res) => setTimeout(res, timeMs));
