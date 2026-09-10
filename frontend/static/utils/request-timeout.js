export async function withRequestTimeout(timeoutMs, run, externalSignal) {
  const controller = new AbortController();
  let abortReason;
  const abortWith = reason => {
    if (!controller.signal.aborted) {
      abortReason = reason;
      controller.abort(reason);
    }
  };
  const onExternalAbort = () => abortWith(externalSignal.reason || Object.assign(new Error("Request aborted"), {
    name: "AbortError"
  }));
  if (externalSignal?.aborted) {
    onExternalAbort();
    throw abortReason;
  }
  externalSignal?.addEventListener("abort", onExternalAbort, {
    once: true
  });
  const timer = setTimeout(() => abortWith(Object.assign(new Error("Request timed out"), {
    name: "TimeoutError"
  })), timeoutMs);
  try {
    const result = await run(controller.signal);
    if (controller.signal.aborted) {
      throw abortReason;
    }
    return result;
  } catch (error) {
    throw controller.signal.aborted ? abortReason : error;
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener("abort", onExternalAbort);
  }
}
