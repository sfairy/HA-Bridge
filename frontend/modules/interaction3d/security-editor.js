import { mountInteraction3d } from './runtime.js?v=20260909-preview-sleep-v1-20260911-security-camera-popup-v6';
import { openPresenceEditor } from './presence-editor.js?v=20260911-security-focal-v1-presence-pages-v2';
import { randomUuid } from '/bridge-static/utils/random-id.js';
import { requestInteraction3dAccess, subscribeInteraction3dAccess } from '/bridge-static/modules/interaction3d/bridge.js?v=20260906-i3d-complete-v6-20260908-access-lock-v1-20260908-environment-v1-20260908-lighting-mode-v1-20260908-curtains-v1-20260908-range-dialog-v3-20260908-range-controls-v1-20260908-batch-center-v1-20260908-add-device-dialog-v1-20260911-navigation-light-v14-stage-retain-v1-focus-layout-anim-v1';
import { interaction3dPreviewSize } from '/bridge-static/modules/interaction3d/preview-layout.js';
import { cameraPopupLayout, cameraPreviewRatio } from '/bridge-static/modules/interaction3d/camera-popup-layout.js';
export async function openSecurityEditor({
  component,
  panelDocument,
  entities = [],
  pickers,
  onSave
}) {
  await requestInteraction3dAccess();
  const draft = structuredClone(component['properties'] || {});
  draft['security'] = {
    ...draft['security'],
    'cameras': draft['security']?.['cameras'] || [],
    'presenceSensors': draft['security']?.['presenceSensors'] || []
  };
  for (const camera of draft['security']['cameras']) {
    delete camera['buttonHidden'];
    delete camera["hiddenClickable"];
  }
  const createEl = (tag, className = '', text = '') => {
    const node = document['createElement'](tag);
    node['className'] = className;
    node['textContent'] = text;
    return node;
  };
  const createButton = (label, onClick) => {
    const button = createEl("button", '', label);
    button["type"] = 'button';
    button["addEventListener"]("click", onClick);
    return button;
  };
  const stylesheetLink = createEl("link");
  stylesheetLink['rel'] = 'stylesheet';
  stylesheetLink['href'] = '/api/v1/modules/interaction3d/runtime.css?v=20260911-security-layout-v2-20260912-compact-list-note-v1';
  const dialog = createEl('dialog', 'i3d-editor');
  dialog['setAttribute']('aria-label', '3D 安防配置');
  dialog['dataset']['i3dPreviewScope'] = 'security';
  const header = createEl('header');
  const body = createEl("div", "i3d-editor-body");
  const view = createEl("div", 'i3d-editor-view');
  const aside = createEl('aside');
  let container = aside;
  const aspect = createEl('div', 'i3d-editor-aspect');
  const stage = createEl('div', 'i3d-editor-stage');
  const statusEl = createEl('p', 'i3d-error');
  statusEl['setAttribute']('role', 'status');
  aspect['append'](stage);
  view['append'](aspect);
  body['append'](view, aside);
  let previewState = null;
  let floorSelection = draft['floorSelection'] === 'all' ? '' : draft["floorSelection"] || '';
  let kind = 'camera';
  let selectedId = '';
  let preview = null;
  let closed = false;
  let allowed = true;
  let busy = false;
  let focusEditing = false;
  let focusCamera = null;
  let focusQueue = Promise['resolve']();
  const openSections = new Set();
  let pickerDialog = null;
  let pickerSeq = 0;
  let presenceEditor = null;
  let presenceOpen = false;
  const previousFocus = document['activeElement'];
  const deviceEntities = new Map();
  let popupPreview = null;
  function updatePopupPreview() {
    if (!focusEditing || kind !== 'camera' || closed || !allowed) {
      popupPreview?.['layer']['remove']();
      popupPreview = null;
      return;
    }
    if (!popupPreview) {
      const layer = createEl('div', 'hb-renderer-runtime-dialog-layer i3d-vacuum-dialog-layer');
      const frame = createEl('dialog', "hb-camera-preview-dialog fit-media-ratio i3d-vacuum-details i3d-camera-details");
      const card = createEl('div', 'hb-camera-preview-card');
      const heading = createEl('div', 'hb-camera-preview-heading');
      const headingText = createEl('div');
      const labelEl = createEl('strong');
      const statusSpan = createEl('span', "hb-camera-preview-status", '弹窗位置预览');
      headingText["append"](labelEl, statusSpan);
      heading['append'](headingText);
      const media = createEl('div', "hb-camera-preview-stage");
      media['append'](createEl('span', '', '视频区域 · 高度随实际画面比例适配'));
      card["append"](heading, media);
      frame['append'](card);
      layer["append"](frame);
      aspect['append'](layer);
      layer['setAttribute']("aria-hidden", 'true');
      frame["style"]['pointerEvents'] = 'none';
      frame['style']['animation'] = 'none';
      frame["show"]();
      popupPreview = {
        'layer': layer,
        'frame': frame,
        'heading': heading,
        'label': labelEl,
        'media': media
      };
    }
    const item = currentItem();
    const baseBounds = draft['layoutMode'] === 'fill' ? panelDocument?.['canvas'] : component['position'];
    const baseWidth = preview?.['presentationLayout']?.['width'] || Number(baseBounds?.['width']) || aspect['clientWidth'];
    const baseHeight = preview?.['presentationLayout']?.['height'] || Number(baseBounds?.["height"]) || aspect['clientHeight'];
    const scaleX = aspect['clientWidth'] / baseWidth;
    const scaleY = aspect["clientHeight"] / baseHeight;
    const ratio = cameraPreviewRatio(item?.['entityId']);
    const {
      panelWidth,
      mediaHeight,
      top
    } = cameraPopupLayout(baseWidth, baseHeight, ratio, popupPreview['heading']["offsetHeight"] || 58);
    popupPreview['label']['textContent'] = item?.['label'] || '摄像头';
    Object['assign'](popupPreview['frame']['style'], {
      'width': panelWidth + 'px',
      'top': top * scaleY + 'px',
      'right': 16 * scaleX + 'px',
      'transform': "scale(" + 2 * scaleX + ',' + 2 * scaleY + ')'
    });
    popupPreview['frame']['style']['setProperty']('--i3d-panel-opacity', String((draft["popupOpacity"] ?? 74) / 100));
    popupPreview['media']['style']['height'] = mediaHeight + 'px';
    popupPreview['media']['style']['aspectRatio'] = String(ratio);
  }
  const listKey = () => kind === 'camera' ? 'cameras' : 'presenceSensors';
  const kindLabel = () => kind === "camera" ? "摄像头" : '人体传感器';
  const currentList = () => draft['security'][listKey()];
  const currentItem = () => currentList()['find'](entry => entry['id'] === selectedId && entry['floorId'] === floorSelection);
  const currentFloor = () => previewState?.['floors']['find'](floor => floor['id'] === floorSelection);
  const floorModels = () => currentFloor()?.[listKey()] || [];
  const itemKey = item => kind + ':' + item['id'];
  const buildProperties = () => ({
    ...draft,
    'floorSelection': floorSelection,
    'camera': draft['floorCameras']?.[floorSelection] || (draft['floorSelection'] === floorSelection ? draft['camera'] : null)
  });
  const showError = error => {
    closed || (statusEl['textContent'] = error?.['message'] || String(error));
  };
  function syncPreview() {
    !closed && !presenceOpen && allowed && preview?.["update"](buildProperties(), selectedId ? kind + ':' + selectedId : '');
  }
  function markDirty() {
    statusEl['textContent'] = '配置已修改，请保存配置。';
    syncPreview();
  }
  function closePicker() {
    pickerSeq++;
    pickerDialog?.['close']();
    pickerDialog = null;
  }
  function addSelect(label, options, value, onChange) {
    const select = createEl("select");
    select['setAttribute']('aria-label', label);
    options['length'] || (options = [['', previewState ? '暂无可选项' : '正在加载…']]);
    for (const [optionValue, optionLabel] of options) {
      const option = createEl('option', '', optionLabel);
      option['value'] = optionValue;
      select['append'](option);
    }
    select['value'] = value;
    select['addEventListener']("change", () => onChange(select["value"]));
    const field = createEl('label');
    field['append'](createEl("span", '', label), select);
    container['append'](field);
    return select;
  }
  function addNumberField(label, value, min, max, onChange, step = 0.1) {
    const input = createEl('input');
    Object['assign'](input, {
      'type': 'number',
      'value': value,
      'min': min,
      'max': max,
      'step': step
    });
    input["setAttribute"]('aria-label', label);
    input['addEventListener']('change', () => {
      const parsed = Number(input['value']);
      if (!input['value']["trim"]() || !Number["isFinite"](parsed) || parsed < min || parsed > max) {
        input['value'] = value;
        return;
      }
      value = parsed;
      onChange(parsed);
      markDirty();
    });
    const field = createEl('label');
    field["append"](createEl("span", '', label), input);
    container['append'](field);
  }
  const saveBtn = createButton('保存配置', async () => {
    if (!(busy || !allowed || focusEditing || presenceOpen)) {
      busy = true;
      renderPanel();
      try {
        await requestInteraction3dAccess();
        if (closed || !allowed) {
          return;
        }
        await onSave(structuredClone(draft));
        closed || (statusEl['textContent'] = '已应用到编辑器，请保存仪表盘。');
      } catch (error) {
        showError(error);
      } finally {
        busy = false;
        closed || renderPanel();
      }
    }
  });
  saveBtn['className'] = "primary";
  function close() {
    closed || (closed = true, updatePopupPreview(), closePicker(), presenceEditor?.['close'](), preview?.(), resizeObserver['disconnect'](), unsubscribeAccess(), dialog['close'](), dialog['remove'](), stylesheetLink['remove'](), document['dispatchEvent'](new Event("hb-i3d-preview-scope")), previousFocus?.['focus']?.());
  }
  header['append'](createEl('strong', '', "3D 安防配置"), saveBtn, createButton('退出', close));
  dialog['append'](header, body);
  dialog['addEventListener']("cancel", event => {
    event["preventDefault"]();
    close();
  });
  function resizeEditor() {
    const size = interaction3dPreviewSize(component, panelDocument, view['clientWidth'], view['clientHeight']);
    aspect["style"]['width'] = size['width'] + 'px';
    aspect['style']['height'] = size["height"] + 'px';
    updatePopupPreview();
  }
  const resizeObserver = new ResizeObserver(resizeEditor);
  resizeObserver['observe'](view);
  const unsubscribeAccess = subscribeInteraction3dAccess(accessState => {
    const nextAllowed = accessState['allowed'] === true;
    nextAllowed !== allowed && (allowed = nextAllowed, allowed || (focusEditing = false, closePicker(), presenceEditor?.['close'](), preview?.(), preview = null, statusEl['textContent'] = accessState["message"] || '3D 使用权限已失效。'), closed || (renderPanel(), allowed && dialog['open'] && mountPreview()));
  });
  async function runFocusCommand(command, payload) {
    const target = currentItem();
    if (!target || busy || !allowed || closed) {
      return;
    }
    const isFocal = command === "focus-focal-length";
    const previous = focusQueue;
    let release;
    focusQueue = new Promise(resolve => {
      release = resolve;
    });
    isFocal || (busy = true, renderPanel());
    try {
      await previous;
      if (closed || !allowed || currentItem() !== target) {
        return;
      }
      const result = await preview['focusCommand'](command, itemKey(target), payload);
      if (closed || !allowed || currentItem() !== target) {
        return;
      }
      result?.['camera'] && (focusCamera = result['camera']);
      command === 'save-light-camera' ? (target['focusCamera'] = result['camera'], focusEditing = false, markDirty()) : command === 'cancel-light-camera' ? (focusEditing = false, focusCamera = null) : command === 'edit-light-camera' && (focusEditing = true);
    } catch (error) {
      closed || showError(error);
    } finally {
      release();
      isFocal || (busy = false, closed || renderPanel());
    }
  }
  async function openPersonEditor() {
    if (!(busy || focusEditing || presenceOpen || !allowed)) {
      presenceOpen = true;
      preview?.();
      preview = null;
      try {
        const handle = await openPresenceEditor({
          'component': {
            ...component,
            'properties': structuredClone(draft)
          },
          'panelDocument': panelDocument,
          'floors': previewState?.['floors'] || [],
          'entities': entities,
          'pickers': pickers,
          'initialSelectedId': selectedId,
          'editingFloorId': floorSelection,
          'manageBindings': false,
          'onSave': async nextProperties => {
            !closed && allowed && (draft['security'] = structuredClone(nextProperties['security']), statusEl['textContent'] = "路线已应用，请保存配置。");
          },
          'onClose': () => {
            presenceEditor = null;
            presenceOpen = false;
            !closed && allowed && (mountPreview(), renderPanel());
          }
        });
        closed || !allowed || !presenceOpen ? handle?.['close']() : presenceEditor = handle;
      } catch (error) {
        presenceOpen = false;
        showError(error);
        !closed && allowed && mountPreview();
      }
    }
  }
  function addSection(title) {
    const section = createEl('section', "i3d-focus-settings i3d-security-settings");
    section['append'](createEl('h4', '', title));
    aside['append'](section);
    container = section;
    return section;
  }
  function addDisclosure(title, key, parent = container) {
    const details = createEl('details', 'i3d-security-disclosure');
    details['open'] = openSections['has'](key);
    details['append'](createEl('summary', '', title));
    details['addEventListener']('toggle', () => {
      details['open'] ? openSections["add"](key) : openSections['delete'](key);
    });
    const detailsBody = createEl('div', 'i3d-security-disclosure-body');
    details['append'](detailsBody);
    parent['append'](details);
    return detailsBody;
  }
  function renderPanel() {
    updatePopupPreview();
    aside['replaceChildren']();
    saveBtn['disabled'] = busy || focusEditing || !allowed || !previewState || presenceOpen;
    const scopeSection = addSection('配置范围');
    const scopeGrid = createEl('div', 'i3d-security-scope-grid');
    scopeSection['append'](scopeGrid);
    container = scopeGrid;
    addSelect('配置楼层', (previewState?.['floors'] || [])['map'](floor => [floor['id'], floor['name']]), floorSelection, nextFloorId => {
      closePicker();
      floorSelection = nextFloorId;
      selectedId = '';
      syncPreview();
      renderPanel();
    });
    addSelect('安防类别', [['camera', '摄像头'], ['presence', "人体传感器"]], kind, nextKind => {
      closePicker();
      kind = nextKind;
      selectedId = '';
      syncPreview();
      renderPanel();
    });
    const modelSection = addSection('模型列表');
    modelSection['className'] += ' i3d-security-model-list';
    container = modelSection;
    const placedItems = currentList()['filter'](entry => entry['floorId'] === floorSelection);
    placedItems['some'](entry => entry['id'] === selectedId) || (selectedId = placedItems[0]?.['id'] || '');
    addSelect(kindLabel() + '列表', placedItems['map'](entry => [entry['id'], entry['label'] || entry['entityId'] || kindLabel()]), selectedId, nextId => {
      closePicker();
      selectedId = nextId;
      syncPreview();
      renderPanel();
    });
    container = addDisclosure('添加' + kindLabel(), 'add:' + kind + ':' + floorSelection, modelSection);
    const availableModels = floorModels()['filter'](model => !currentList()['some'](entry => entry['floorId'] === floorSelection && entry['modelId'] === model['id']));
    const modelSelect = addSelect('待添加' + kindLabel() + '模型', availableModels['map'](model => [model['id'], model['name']]), availableModels[0]?.['id'] || '', () => {});
    const addBtn = createButton('添加' + kindLabel(), () => {
      const model = floorModels()["find"](entry => entry['id'] === modelSelect['value']);
      if (!model || currentList()["length"] >= 128 || currentList()['some'](entry => entry['floorId'] === floorSelection && entry["modelId"] === model['id'])) {
        return;
      }
      const item = {
        'id': randomUuid(),
        'floorId': floorSelection,
        'modelId': model['id'],
        'entityId': '',
        'label': model["name"] || kindLabel(),
        ...(kind === 'camera' ? {
          'size': 44,
          'visible': true,
          'icon': 'mdi:cctv'
        } : {
          'route': [],
          'routeClosed': false,
          'size': 1,
          'speed': 0.45,
          'displayDuration': 0,
          'character': 'traveler',
          'color': 'cyan',
          'clickToFocus': false,
          'hitPadding': 8
        })
      };
      currentList()['push'](item);
      selectedId = item['id'];
      openSections['delete']("add:" + kind + ':' + floorSelection);
      markDirty();
      renderPanel();
    });
    addBtn['disabled'] = !availableModels['length'] || currentList()['length'] >= 128;
    container['append'](addBtn);
    floorModels()['length'] || container["append"](createEl('p', 'i3d-note', "本层没有" + kindLabel() + "模型，请先在 3D 工作台模型库放置。"));
    container = modelSection;
    const item = currentItem();
    if (item) {
      const bindingSection = addSection('基础绑定');
      const bindingGrid = createEl('div', 'i3d-security-scope-grid');
      bindingSection["append"](bindingGrid);
      container = bindingGrid;
      const labelInput = createEl('input');
      labelInput["value"] = item['label'] || '';
      labelInput['maxLength'] = 128;
      labelInput['setAttribute']('aria-label', '名称');
      labelInput['addEventListener']('input', () => {
        item['label'] = labelInput['value'];
        markDirty();
      });
      const nameField = createEl('label');
      nameField['append'](createEl('span', '', '名称'), labelInput);
      container['append'](nameField);
      const availableModels = floorModels()["filter"](model => !currentList()['some'](entry => entry !== item && entry['floorId'] === floorSelection && entry['modelId'] === model['id']));
      const modelOptions = availableModels['map'](model => [model['id'], model["name"]]);
      availableModels['some'](model => model['id'] === item["modelId"]) || modelOptions['unshift']([item['modelId'] || '', item['modelId'] ? '原模型已移除，请重新选择' : '未关联模型（保留原人在路线）']);
      addSelect('关联' + kindLabel() + '模型', modelOptions, item['modelId'] || '', nextModelId => {
        nextModelId ? item['modelId'] = nextModelId : delete item['modelId'];
        kind === 'camera' && delete item['focusCamera'];
        markDirty();
        renderPanel();
      });
      container = bindingSection;
      let detectionBody = null;
      if (kind === 'presence') {
        const deviceBtn = createButton(item['deviceName'] || '选择人体传感器设备', async () => {
          const seq = ++pickerSeq;
          pickerDialog?.["close"]();
          try {
            const pickerHandle = await pickers['presence']({
              'trigger': deviceBtn,
              'current': item['deviceId'] || '',
              'onSelect'(selection) {
                closed || !allowed || seq !== pickerSeq || currentItem() !== item || (selection ? (item["deviceId"] = selection['deviceId'], item['deviceName'] = selection['name'], deviceEntities['set'](item['id'], selection['entities']), selection['entities']['some'](entity => entity['entityId'] === item['entityId']) || (item['entityId'] = selection['entities'][0]?.['entityId'] || ''), item['entityId']['startsWith']('event.') && !(item['displayDuration'] > 0) && (item['displayDuration'] = 30)) : (delete item['deviceId'], delete item['deviceName'], item['entityId'] = '', deviceEntities["delete"](item['id'])), markDirty(), renderPanel());
              }
            });
            closed || seq !== pickerSeq ? pickerHandle?.["close"]() : pickerDialog = pickerHandle;
          } catch (error) {
            showError(error);
          }
        });
        deviceBtn['className'] = 'i3d-picker-button';
        deviceBtn['setAttribute']('aria-label', '选择人体传感器设备');
        const deviceField = createEl('label');
        deviceField['append'](createEl('span', '', '绑定设备'), deviceBtn);
        container['append'](deviceField);
        container['append'](createEl('p', "i3d-note", "选择设备后自动关联检测来源，通常无需再设置。"));
        detectionBody = addDisclosure('检测来源（高级）', 'detection:' + item['id']);
        const previousContainer = container;
        container = detectionBody;
        if (item['deviceId']) {
          const entityOptions = (deviceEntities['get'](item['id']) || pickers['presenceEntities']?.(item['deviceId']) || [])['map'](entity => [entity['entityId'], entity['name'] || entity["entityId"]]);
          item['entityId'] && !entityOptions['some'](([entityId]) => entityId === item['entityId']) && entityOptions['unshift']([item['entityId'], item["entityId"] + '（当前绑定）']);
          entityOptions["length"] > 1 ? addSelect('有人状态来源', entityOptions, item["entityId"] || '', nextEntityId => {
            item["entityId"] = nextEntityId;
            nextEntityId['startsWith']("event.") && !(item['displayDuration'] > 0) && (item['displayDuration'] = 30);
            markDirty();
          }) : container['append'](createEl('p', 'i3d-note', entityOptions['length'] ? '检测实体：' + entityOptions[0][1] : '设备暂无可用检测实体，请重新选择设备。'));
        }
        container = previousContainer;
      }
      const entityBtn = createButton(entities['find'](entity => entity['entityId'] === item['entityId'])?.['name'] || item["entityId"] || '选择' + kindLabel() + '实体', async () => {
        const seq = ++pickerSeq;
        pickerDialog?.['close']();
        try {
          const pickerHandle = await pickers['entity']({
            'trigger': entityBtn,
            'current': item["entityId"],
            'deviceKind': kind,
            'onSelect'(nextEntityId) {
              closed || !allowed || seq !== pickerSeq || currentItem() !== item || (item['entityId'] = nextEntityId, kind === 'presence' && (delete item["deviceId"], delete item['deviceName'], deviceEntities['delete'](item['id'])), kind === "presence" && nextEntityId['startsWith']('event.') && !(item['displayDuration'] > 0) && (item['displayDuration'] = 30), markDirty(), renderPanel());
            }
          });
          closed || seq !== pickerSeq ? pickerHandle?.['close']() : pickerDialog = pickerHandle;
        } catch (error) {
          showError(error);
        }
      });
      kind === 'presence' && (entityBtn['textContent'] = item['entityId'] ? '手动绑定：' + item['entityId'] : "手动选择实体（无设备归属）");
      const entityLabel = entityBtn['textContent'];
      entityBtn['textContent'] = '';
      const entityLabelSpan = createEl('span', 'i3d-security-entity-label', entityLabel);
      entityBtn['append'](entityLabelSpan);
      entityBtn['title'] = entityLabel;
      entityBtn['className'] = "i3d-picker-button";
      entityBtn['setAttribute']('aria-label', '选择' + kindLabel() + '实体');
      kind === 'presence' ? (detectionBody['append'](createEl('p', 'i3d-note', '仅在自动匹配不合适时更换来源。无设备归属的模板实体可手动绑定。'), entityBtn), container['append'](createEl('p', 'i3d-note', '配置时点击标签选择传感器；正式页面仅展示模型和感应效果。'))) : container['append'](entityBtn);
      if (kind === "camera") {
        container['append'](createEl('p', 'i3d-note', '标签显示设备状态；仅点击聚焦后连接视频，退出时断开。可拖动标签调整位置。'));
        const labelSection = addSection('标签设置');
        const labelGrid = createEl('div', "i3d-security-scope-grid");
        labelSection['append'](labelGrid);
        container = labelGrid;
        const iconBtn = createButton(item['icon'] || 'mdi:cctv', async () => {
          const seq = ++pickerSeq;
          pickerDialog?.['close']();
          try {
            const pickerHandle = await pickers['icon']({
              'trigger': iconBtn,
              'current': item["icon"] || 'mdi:cctv',
              'deviceKind': "camera",
              'onSelect'(nextIcon) {
                closed || !allowed || seq !== pickerSeq || currentItem() !== item || (item['icon'] = nextIcon, markDirty(), renderPanel());
              }
            });
            closed || seq !== pickerSeq ? pickerHandle?.['close']() : pickerDialog = pickerHandle;
          } catch (error) {
            showError(error);
          }
        });
        iconBtn['className'] = 'i3d-picker-button i3d-icon-picker-button';
        const iconEl = createEl('i');
        iconEl['style']['maskImage'] = 'url(\'/bridge-static/vendor/mdi/7.4.47/svg/' + (item['icon'] || 'mdi:cctv')['slice'](4) + '.svg\')';
        iconEl['style']['webkitMaskImage'] = iconEl['style']['maskImage'];
        iconBtn["textContent"] = '';
        iconBtn['append'](iconEl, createEl('span', '', item['icon'] || 'mdi:cctv'));
        iconBtn["setAttribute"]('aria-label', '摄像头图标');
        const iconField = createEl('label');
        iconField["append"](createEl('span', '', '图标'), iconBtn);
        container["append"](iconField);
        addNumberField('标签缩放（%）', Math['round']((item['size'] ?? 44) / 44 * 100), 10, 500, nextSize => {
          item['size'] = nextSize / 100 * 44;
        }, 1);
        const sizesBody = addDisclosure("更多尺寸设置", 'camera-sizes', labelSection);
        const sizeGrid = createEl('div', 'i3d-coordinate-grid i3d-security-size-grid');
        sizesBody['append'](sizeGrid);
        container = sizeGrid;
        addNumberField('图标大小（px）', item["iconSize"] ?? 26, 4, 200, nextIconSize => {
          item['iconSize'] = nextIconSize;
        }, 1);
        addNumberField("文字大小（px）", item['fontSize'] ?? 12, 8, 100, nextFontSize => {
          item['fontSize'] = nextFontSize;
        }, 1);
        addNumberField('触控范围（px）', item['hitSize'] ?? 44, 1, 1000, nextHitSize => {
          item['hitSize'] = nextHitSize;
        }, 1);
        const positionSection = addSection('标签位置');
        const positionGrid = createEl('div', 'i3d-coordinate-grid');
        positionSection['append'](positionGrid);
        container = positionGrid;
        const model = floorModels()['find'](entry => entry['id'] === item['modelId']);
        for (const axis of ['x', 'y']) {
          addNumberField('位置 ' + axis['toUpperCase'](), item[axis] ?? model?.[axis] ?? 0, -1000000, 1000000, nextValue => {
            item[axis] = nextValue;
          });
        }
        addNumberField('离地高度（米）', item['height'] ?? model?.['height'] ?? 0.15, -1000, 1000, nextHeight => {
          item['height'] = nextHeight;
        });
        container = positionSection;
        const resetBtn = createButton('恢复跟随模型', () => {
          delete item['x'];
          delete item['y'];
          delete item['height'];
          markDirty();
          renderPanel();
        });
        resetBtn['disabled'] = !['x', 'y', 'height']['some'](axis => Number['isFinite'](item[axis]));
        resetBtn['className'] = 'i3d-focus-reset';
        container['append'](resetBtn);
        container['append'](createEl('p', 'i3d-note', "仅调整标签，不移动摄像头模型。也可在预览中拖动标签。"));
        addSection('聚焦视角');
        const focusActions = createEl('div', 'i3d-focus-actions');
        focusEditing ? focusActions['append'](createButton('保存摄像头视角', () => runFocusCommand('save-light-camera')), createButton("取消调整", () => runFocusCommand('cancel-light-camera'))) : focusActions['append'](createButton(item['focusCamera'] ? '调整视角' : '设置视角', () => runFocusCommand('edit-light-camera')), createButton('预览聚焦', () => runFocusCommand('preview-light-camera')));
        container['append'](focusActions);
        if (focusEditing) {
          const projectionGroup = createEl('div', "i3d-focus-actions");
          projectionGroup['setAttribute']('role', 'group');
          projectionGroup['setAttribute']('aria-label', '聚焦投影');
          for (const [mode, modeLabel] of [['orthographic', '正交'], ['perspective', '透视']]) {
            const modeBtn = createButton(modeLabel, () => runFocusCommand("focus-projection", mode));
            modeBtn['setAttribute']('aria-pressed', String((focusCamera?.["mode"] || 'orthographic') === mode));
            projectionGroup['append'](modeBtn);
          }
          const focalInput = createEl('input');
          Object['assign'](focalInput, {
            'type': "number",
            'min': '18',
            'max': '120',
            'step': '1',
            'value': String(Math['round'](focusCamera?.["focalLength"] || 50))
          });
          focalInput["setAttribute"]('aria-label', "焦段（mm）");
          focalInput['dataset']['focusFocal'] = 'true';
          focalInput['addEventListener']("change", () => {
            const parsed = Number(focalInput['value']);
            if (!focalInput['value']["trim"]() || !Number['isFinite'](parsed)) {
              focalInput['value'] = String(focusCamera?.["focalLength"] || 50);
              return;
            }
            focalInput['value'] = String(Math['max'](18, Math['min'](120, parsed)));
            runFocusCommand("focus-focal-length", Number(focalInput['value']));
          });
          const focalField = createEl('label');
          focalField["append"](createEl('span', '', '焦段（mm）'), focalInput);
          container['append'](projectionGroup, focalField);
        }
        if (!focusEditing) {
          const resetFocusBtn = createButton("恢复自动聚焦", async () => {
            if (!(busy || !allowed)) {
              busy = true;
              renderPanel();
              try {
                await preview['focusCommand']("cancel-light-camera", itemKey(item));
                if (closed || !allowed) {
                  return;
                }
                delete item['focusCamera'];
                markDirty();
              } catch (error) {
                showError(error);
              } finally {
                busy = false;
                closed || renderPanel();
              }
            }
          });
          resetFocusBtn['disabled'] = !item['focusCamera'];
          resetFocusBtn['className'] = 'i3d-focus-reset';
          container['append'](resetFocusBtn);
        }
      }
      if (kind === 'presence') {
        if (item['modelId']) {
          const waveSection = addSection('感应光圈');
          addSelect('显示光圈', [['on', '开启'], ['off', '关闭']], item['waveEnabled'] === false ? "off" : 'on', nextValue => {
            item['waveEnabled'] = nextValue === 'on';
            markDirty();
            renderPanel();
          });
          const waveGrid = createEl('div', 'i3d-security-scope-grid');
          waveSection['append'](waveGrid);
          container = waveGrid;
          addNumberField('光圈大小（%）', Math['round']((item['waveScale'] ?? 1) * 100), 25, 300, nextScale => {
            item['waveScale'] = nextScale / 100;
          }, 1);
          addNumberField('光圈透明度（%）', 100 - (item['waveOpacity'] ?? 68), 0, 100, nextOpacity => {
            item['waveOpacity'] = 100 - nextOpacity;
          }, 1);
          if (item['waveEnabled'] === false) {
            for (const input of waveGrid['querySelectorAll']('input')) {
              input['disabled'] = true;
            }
          }
        }
        addSection('人物展示');
        container['append'](createButton("配置人物与行走路线", openPersonEditor));
        container['append'](createEl('p', 'i3d-note', '按需设置人物、显示时长与行走路线。设备绑定在上方统一管理。'));
      }
      const bindingMgmtSection = addSection("绑定管理");
      const removeBtn = createButton('移除' + kindLabel() + '绑定', () => {
        closePicker();
        draft['security'][listKey()] = currentList()['filter'](entry => entry !== item);
        selectedId = '';
        markDirty();
        renderPanel();
      });
      removeBtn['className'] = "i3d-remove-light";
      bindingMgmtSection['append'](removeBtn);
    }
    container = aside;
    container["append"](statusEl);
    if (busy || focusEditing || !allowed || presenceOpen) {
      for (const control of aside['querySelectorAll']('button,input,select')) {
        control['disabled'] = true;
      }
      if (focusEditing && !busy && allowed) {
        for (const btn of aside["querySelectorAll"]('.i3d-focus-actions button')) {
          btn['disabled'] = false;
        }
      }
      for (const input of aside['querySelectorAll']("input")) {
        input['dataset']["focusFocal"] && (input['disabled'] = busy || !allowed || focusCamera?.['mode'] !== 'perspective');
      }
    }
  }
  function mountPreview() {
    closed || !allowed || preview || presenceOpen || (preview = mountInteraction3d(stage, {
      'component': {
        ...component,
        'properties': buildProperties()
      },
      'context': {
        'document': panelDocument,
        'editable': true
      },
      'editing': true,
      'editingModule': 'security',
      'onReady'(state) {
        previewState = state;
        previewState['floors']['some'](floor => floor['id'] === floorSelection) || (floorSelection = previewState['floors'][0]?.['id'] || '');
        renderPanel();
        syncPreview();
      },
      'onEdit'(event) {
        if (!(closed || !allowed)) {
          if (event['action'] === "position" && event['id']?.['startsWith']('camera:')) {
            const camera = draft['security']['cameras']['find'](entry => "camera:" + entry['id'] === event['id']);
            camera && Number["isFinite"](event['x']) && Number['isFinite'](event['y']) && (camera['x'] = event['x'], camera['y'] = event['y'], markDirty());
          }
          event['action'] === "focus-exited" && (focusEditing = false, renderPanel());
          if (event["action"] === "select" && /^(camera|presence):/['test'](event['id'] || '')) {
            const colonIndex = event['id']['indexOf'](':');
            kind = event['id']['slice'](0, colonIndex);
            selectedId = event['id']['slice'](colonIndex + 1);
            renderPanel();
          }
        }
      },
      'onLoadError': showError
    }), document['dispatchEvent'](new Event('hb-i3d-preview-scope')));
  }
  document["head"]['append'](stylesheetLink);
  document['body']['append'](dialog);
  dialog["showModal"]();
  renderPanel();
  resizeEditor();
  mountPreview();
  return {
    'close': close
  };
}
