const DEFAULT_CHANGELOG_URL = 'https://wiki.habridge.cn/updates.html#changelog';
const POLL_INTERVAL_MS = 60_000;
const FETCH_TIMEOUT_MS = 5_000;

export function applyUpdateNotice(link, badge, payload) {
  let logUrl;
  try {
    logUrl = new URL(payload?.logUrl);
  } catch {
    logUrl = undefined;
  }
  const updateAvailable =
    payload?.updateAvailable === true &&
    typeof payload.latestVersion === 'string' &&
    logUrl?.origin === 'https://wiki.habridge.cn' &&
    logUrl.pathname === '/updates.html' &&
    !logUrl.username &&
    !logUrl.password;

  badge.hidden = !updateAvailable;
  link.href = updateAvailable ? logUrl.href : DEFAULT_CHANGELOG_URL;
  link.title = updateAvailable
    ? `当前 ${payload.currentVersion}，最新 ${payload.latestVersion}，查看更新日志和升级说明`
    : '查看开发计划与更新日志';
  if (updateAvailable) {
    link.setAttribute('aria-label', `开发计划与更新日志，有新版本 ${payload.latestVersion}`);
  } else {
    link.removeAttribute('aria-label');
  }
}

export function startUpdateNotice(
  link,
  badge,
  {
    fetcher = fetch,
    page = document,
    schedule = setInterval,
    cancel = clearInterval,
  } = {},
) {
  let inFlight = false;
  let stopped = false;
  let controller;

  async function refresh() {
    if (inFlight || stopped || page.hidden) {
      return;
    }
    inFlight = true;
    controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
      const response = await fetcher('/api/v1/updates', {
        signal: controller.signal,
        credentials: 'same-origin',
        cache: 'no-store',
      });
      if (response.ok && !stopped) {
        const payload = await response.json();
        if (!stopped) {
          applyUpdateNotice(link, badge, payload);
        }
      } else if (!stopped) {
        applyUpdateNotice(link, badge, null);
      }
    } catch {
      if (!stopped) {
        applyUpdateNotice(link, badge, null);
      }
    } finally {
      clearTimeout(timeout);
      inFlight = false;
    }
  }

  const timer = schedule(refresh, POLL_INTERVAL_MS);
  page.addEventListener('visibilitychange', refresh);
  refresh();

  return () => {
    stopped = true;
    controller?.abort();
    cancel(timer);
    page.removeEventListener('visibilitychange', refresh);
  };
}

const link = globalThis.document?.querySelector('#product-updates-link');
const badge = globalThis.document?.querySelector('#product-update-badge');
if (link && badge) {
  let stop = startUpdateNotice(link, badge);
  window.addEventListener('pagehide', () => {
    stop?.();
    stop = null;
  });
  window.addEventListener('pageshow', () => {
    if (!stop) {
      stop = startUpdateNotice(link, badge);
    }
  });
}
