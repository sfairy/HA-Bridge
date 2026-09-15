const CHANGELOG_URL = "https://wiki.habridge.cn/updates.html#changelog";
export function applyUpdateNotice(linkElement, badgeElement, updatePayload) {
  let logUrl;
  try {
    logUrl = new URL(updatePayload?.logUrl);
  } catch {}
  const hasUpdate =
    updatePayload?.updateAvailable === true &&
    typeof updatePayload.latestVersion == "string" &&
    logUrl?.origin === "https://wiki.habridge.cn" &&
    logUrl.pathname === "/updates.html" &&
    !logUrl.username &&
    !logUrl.password;
  badgeElement.hidden = !hasUpdate;
  linkElement.href = hasUpdate ? logUrl.href : CHANGELOG_URL;
  linkElement.title = hasUpdate
    ? "当前 " +
      updatePayload.currentVersion +
      "，最新 " +
      updatePayload.latestVersion +
      "，查看更新日志和升级说明"
    : "查看开发计划与更新日志";
  if (hasUpdate) {
    linkElement.setAttribute(
      "aria-label",
      "开发计划与更新日志，有新版本 " + updatePayload.latestVersion
    );
  } else {
    linkElement.removeAttribute("aria-label");
  }
}
export function startUpdateNotice(
  updatesLink,
  updatesBadge,
  {
    fetcher: fetcher = fetch,
    page: page = document,
    schedule: schedule = setInterval,
    cancel: cancel = clearInterval
  } = {}
) {
  let isFetching = false;
  let isDisposed = false;
  let abortController;
  async function pollUpdates() {
    if (isFetching || isDisposed || page.hidden) {
      return;
    }
    isFetching = true;
    abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 5000);
    try {
      const response = await fetcher("/api/v1/updates", {
        signal: abortController.signal,
        credentials: "same-origin",
        cache: "no-store"
      });
      if (response.ok && !isDisposed) {
        const payload = await response.json();
        if (!isDisposed) {
          applyUpdateNotice(updatesLink, updatesBadge, payload);
        }
      } else if (!isDisposed) {
        applyUpdateNotice(updatesLink, updatesBadge, null);
      }
    } catch {
      if (!isDisposed) {
        applyUpdateNotice(updatesLink, updatesBadge, null);
      }
    } finally {
      clearTimeout(timeoutId);
      isFetching = false;
    }
  }
  const intervalId = schedule(pollUpdates, 60000);
  page.addEventListener("visibilitychange", pollUpdates);
  pollUpdates();
  return () => {
    isDisposed = true;
    abortController?.abort();
    cancel(intervalId);
    page.removeEventListener("visibilitychange", pollUpdates);
  };
}
const updatesLinkElement = globalThis.document?.querySelector("#product-updates-link");
const updateBadgeElement = globalThis.document?.querySelector("#product-update-badge");
if (updatesLinkElement && updateBadgeElement) {
  let stopNotice = startUpdateNotice(updatesLinkElement, updateBadgeElement);
  window.addEventListener("pagehide", () => {
    stopNotice?.();
    stopNotice = null;
  });
  window.addEventListener("pageshow", () => {
    stopNotice ||= startUpdateNotice(updatesLinkElement, updateBadgeElement);
  });
}
