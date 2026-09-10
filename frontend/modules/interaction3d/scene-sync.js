export function startSceneSync({
  eligible,
  read,
  apply,
  interval = 5000,
  schedule = setTimeout,
  cancel = clearTimeout
}) {
  let stopped = false;
  let timer;
  let controller;
  let failures = 0;
  async function tick() {
    if (!stopped) {
      try {
        if (!eligible()) {
          return;
        }
        controller = new AbortController();
        const value = await read(controller.signal);
        if (!stopped && value && eligible()) {
          await apply(value);
        }
        failures = 0;
      } catch {
        failures++;
      } finally {
        controller = null;
        if (!stopped) {
          timer = schedule(tick, Math.min(60000, interval * 2 ** Math.min(failures, 4)));
        }
      }
    }
  }
  timer = schedule(tick, interval);
  return () => {
    stopped = true;
    cancel(timer);
    controller?.abort();
  };
}
