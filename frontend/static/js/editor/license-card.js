const PRODUCT_TYPE_LABELS = {
  base: '主授权',
  module: '功能增量包',
  bundle: '全授权',
  package: '自定义套餐',
};

const FALLBACK_VALIDITY = '以本机授权店记录为准';

function formatValidity(product, status = {}) {
  if (!product) {
    if (status.leaseExpiresAt == null && status.activationCodeId) {
      return '永久';
    }
    if (status.leaseExpiresAt) {
      const leaseDate = new Date(status.leaseExpiresAt);
      if (Number.isFinite(leaseDate.getTime())) {
        return `${leaseDate.toLocaleString('zh-CN', { hour12: false })} 到期`;
      }
    }
    return FALLBACK_VALIDITY;
  }
  if (product.expiresAt === null) {
    return '永久';
  }
  if (!product.expiresAt) {
    return FALLBACK_VALIDITY;
  }
  const expires = new Date(product.expiresAt);
  return Number.isFinite(expires.getTime())
    ? `${expires.toLocaleString('zh-CN', { hour12: false })} 到期`
    : FALLBACK_VALIDITY;
}

export function licenseCardData(status = {}) {
  const licensed = !!status.activationCodeId;
  const products = Array.isArray(status.products)
    ? status.products.filter((item) => item && typeof item.name === 'string' && item.type !== 'template')
    : [];
  const features = new Set(Array.isArray(status.features) ? status.features : []);
  const accessOpen =
    licensed && status.allowed !== false && ['ACTIVE', 'CONNECTION_WARNING'].includes(status.status);
  const featureAccess = status.featureAccess || {
    editor: accessOpen && (features.has('editor') || features.has('all')),
    interaction3d: accessOpen && features.has('module.3d_interaction'),
    uiPack: accessOpen && [...features].some((code) => typeof code === 'string' && code.startsWith('ui.') && code !== 'ui.base'),
  };
  const rights = [
    { name: 'HA Bridge 编辑器', enabled: licensed && !!featureAccess.editor },
    { name: '3D 交互功能增量包', enabled: licensed && !!featureAccess.interaction3d },
  ];
  const primary = products.find((item) => ['base', 'bundle', 'package'].includes(item.type));
  const typeLabels = [...new Set(products.map((item) => PRODUCT_TYPE_LABELS[item.type]).filter(Boolean))];
  const allCoreEnabled = rights.every((item) => item.enabled) && featureAccess.uiPack;
  return {
    licensed,
    type:
      primary?.type === 'package'
        ? typeLabels.join(' + ')
        : allCoreEnabled
          ? '全授权'
          : typeLabels.join(' + ') || '主授权',
    name: products.map((item) => item.name.trim()).filter(Boolean).join(' · ') || 'HA Bridge 编辑器',
    validity: formatValidity(primary || products[0], status),
    validityNote:
      products.length > 1 ? '有效期为主授权期限，附加包以各自授权期限为准。' : '',
    rights,
  };
}

export function createLicenseCard({ dialog }) {
  const field = (suffix) => dialog.querySelector(`#license-${suffix}`);
  return {
    render(status) {
      const data = licenseCardData(status);
      const details = field('card-details');
      if (!details) {
        return;
      }
      details.hidden = !data.licensed;
      field('card-type').textContent = data.type;
      field('card-name').textContent = data.name;
      field('card-validity').textContent = data.validity;
      const note = field('validity-note');
      note.textContent = data.validityNote;
      note.hidden = !data.validityNote;
      data.rights.forEach((right, index) => {
        const row = field(`right-${index}`);
        if (!row) {
          return;
        }
        row.classList.toggle('enabled', right.enabled);
        row.querySelector('[data-right-icon]').textContent = right.enabled ? '✓' : '—';
        row.querySelector('[data-right-state]').textContent = right.enabled ? '已开通' : '未开通';
      });
    },
  };
}
