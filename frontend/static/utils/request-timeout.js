export async function withRequestTimeout(timeoutMs, runWithSignal, externalSignal) {
  const requestAbortController = new AbortController();
  let abortReason;
  const abortWithReason = reason => {
    if (!requestAbortController.signal.aborted) {
      abortReason = reason;
      requestAbortController.abort(reason);
    }
  };
  const abortFromExternalSignal = () =>
    abortWithReason(
      externalSignal.reason ||
        Object.assign(new Error("Request aborted"), {
          name: "AbortError"
        })
    );
  if (externalSignal?.aborted) {
    abortFromExternalSignal();
    throw abortReason;
  }
  externalSignal?.addEventListener("abort", abortFromExternalSignal, {
    once: true
  });
  const timeoutHandle = setTimeout(
    () =>
      abortWithReason(
        Object.assign(new Error("Request timed out"), {
          name: "TimeoutError"
        })
      ),
    timeoutMs
  );
  try {
    const result = await runWithSignal(requestAbortController.signal);
    if (requestAbortController.signal.aborted) {
      throw abortReason;
    }
    return result;
  } catch (caughtError) {
    throw requestAbortController.signal.aborted ? abortReason : caughtError;
  } finally {
    clearTimeout(timeoutHandle);
    externalSignal?.removeEventListener("abort", abortFromExternalSignal);
  }
}
