import { setTimeout } from 'timers/promises';

// Waits for the given async function to complete.
export default async function waitFor(fn) {
  const result = await fn();
  if (result) return result;
  await setTimeout(100);
  return waitFor(fn);
}
