const STORAGE_KEY = 'co-chan-nhan-session-v1';

const PRESETS = [
  { id: 1, name: 'Học Đường Thanh Mao Sơn', meta: 'Cấp 5 · Hạn chế · Nam Cương · 1c Sơ' },
  { id: 2, name: 'Ma Đạo Tán Tu Bạch Cốt Sơn', meta: 'Cấp 6 · Hạn chế · 2c Sơ' },
  { id: 3, name: 'Bắc Nguyên Vương Đình Nô Đạo', meta: 'Cấp 7 · Hạn chế · 3c Sơ' },
  { id: 4, name: 'Thiên Tài Thập Tuyệt Thể Nghịch Mệnh', meta: 'Cấp 8 · Hạn chế · 1c Đỉnh' },
  { id: 5, name: 'Cổ Tiên Lục Chuyển Độ Kiếp', meta: 'Cấp 9 · Tự do · Lục chuyển' },
  { id: 6, name: 'Sáng Thế Ma Tôn — Châu Á Cực Hạn', meta: 'Cấp 12 · Tự do · Lục chuyển' },
];

const QUICK_COMMANDS = ['/hud', '/map', '/nhatky', '/nhiemvu', '/inventory', '/help', '/rule', '/tips'];

const CUSTOM_TEMPLATE =
  '[KHỞI TẠO — Cách B: Tự tùy chỉnh]\n' +
  'Tên: \nTuổi: \nKhu vực: \nCảnh giới / Bậc: \nTư chất: \nThân phận: \n' +
  'Chế độ lệnh: \nĐộ khó: \nTài sản: \nGhi chú: ';

const els = {
  chat: document.getElementById('chat'),
  messages: document.getElementById('messages'),
  welcome: document.getElementById('welcome'),
  presets: document.getElementById('presets'),
  quick: document.getElementById('quick'),
  input: document.getElementById('input'),
  send: document.getElementById('send'),
  newSession: document.getElementById('new-session'),
  exportSave: document.getElementById('export-save'),
  modelName: document.getElementById('model-name'),
  modelBadge: document.getElementById('model-badge'),
  keyStatus: document.getElementById('key-status'),
  keyHint: document.getElementById('key-hint'),
  turnCount: document.getElementById('turn-count'),
  startRandom: document.getElementById('start-random'),
  startCustom: document.getElementById('start-custom'),
};

const state = {
  messages: [],
  model: '',
};

let busy = false;
let controller = null;

if (window.marked && window.marked.setOptions) {
  window.marked.setOptions({ gfm: true, breaks: true });
}

init();

function init() {
  loadState();
  renderPresets();
  renderQuickCommands();
  renderHistory();
  updateTurnCount();
  checkHealth();

  els.send.addEventListener('click', onSendClick);
  els.newSession.addEventListener('click', startNewSession);
  els.exportSave.addEventListener('click', exportSave);
  els.startRandom.addEventListener('click', () => sendMessage(randomInstruction()));
  els.startCustom.addEventListener('click', () => {
    els.input.value = CUSTOM_TEMPLATE;
    autoGrow();
    els.input.focus();
  });
  els.input.addEventListener('input', autoGrow);
  els.input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      if (!busy) sendMessage(els.input.value);
    }
  });
  window.addEventListener('beforeunload', persist);

  els.input.focus();
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (Array.isArray(saved.messages)) {
      state.messages = saved.messages.filter((m) => m && typeof m.text === 'string' && m.text.trim());
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: state.messages, savedAt: Date.now() }));
  } catch {
    /* storage full or disabled */
  }
}

function renderPresets() {
  els.presets.innerHTML = '';
  for (const preset of PRESETS) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'preset';
    button.innerHTML =
      `<span class="preset-num">${String(preset.id).padStart(2, '0')}</span>` +
      `<span class="preset-body"><strong></strong><span></span></span>`;
    button.querySelector('strong').textContent = preset.name;
    button.querySelector('.preset-body span').textContent = preset.meta;
    button.addEventListener('click', () => sendMessage(presetInstruction(preset)));
    els.presets.appendChild(button);
  }
}

function renderQuickCommands() {
  for (const command of QUICK_COMMANDS) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'chip';
    chip.textContent = command;
    chip.addEventListener('click', () => {
      if (!busy) sendMessage(command);
    });
    els.quick.appendChild(chip);
  }
}

function renderHistory() {
  if (!state.messages.length) {
    els.welcome.hidden = false;
    return;
  }
  els.welcome.hidden = true;
  for (const message of state.messages) {
    appendMessage(message);
  }
  scrollToBottom();
}

function presetInstruction(preset) {
  return (
    `[KHỞI TẠO — Cách A: Khởi đầu ${preset.id}] ` +
    `Bắt đầu phiên chơi mới theo "Khởi đầu ${preset.id}: ${preset.name}". ` +
    'Hãy dựng thẻ nhân vật sơ khởi và HUD khởi tạo đầy đủ đúng Mục X, ' +
    'rồi hỏi tôi xác nhận Khóa Cấp Độ trước khi vào Lượt 1.'
  );
}

function randomInstruction() {
  return (
    '[KHỞI TẠO — Cách C] Khởi tạo ngẫu nhiên phiên chơi mới: gieo đủ 8 xúc xắc d100 theo bảng Cách C, ' +
    'xuất [THẺ NHÂN VẬT SƠ KHỞI — XÁC NHẬN TRƯỚC KHI VÀO LƯỢT 1], cho tôi đổi 1 mục ngẫu nhiên, ' +
    'rồi hỏi [Xác nhận Khóa Cấp Độ: Có / Không].'
  );
}

async function onSendClick() {
  if (busy) {
    if (controller) controller.abort();
    return;
  }
  await sendMessage(els.input.value);
}

async function sendMessage(rawText) {
  if (busy) return;
  const text = (rawText || '').trim();
  if (!text) return;

  els.input.value = '';
  autoGrow();
  els.welcome.hidden = true;

  const userMessage = { role: 'user', text };
  state.messages.push(userMessage);
  appendMessage(userMessage);
  scrollToBottom();
  persist();

  const assistantMessage = { role: 'assistant', text: '' };
  state.messages.push(assistantMessage);
  const contentEl = appendMessage(assistantMessage);

  setBusy(true);
  controller = new AbortController();
  let rafId = 0;
  let queued = false;

  const paint = () => {
    contentEl.innerHTML = assistantMessage.text ? renderMarkdown(assistantMessage.text) : typingHtml();
  };
  const schedulePaint = () => {
    if (queued) return;
    queued = true;
    rafId = requestAnimationFrame(() => {
      queued = false;
      const follow = isNearBottom();
      paint();
      if (follow) scrollToBottom();
    });
  };

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        messages: state.messages.filter((m) => m !== assistantMessage && m.text.trim()),
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || `HTTP ${response.status}`);
    }

    await consumeSSE(response, (event) => {
      if (event.error) throw new Error(event.error);
      if (event.t) {
        assistantMessage.text += event.t;
        schedulePaint();
      }
    });

    if (!assistantMessage.text) {
      throw new Error('Không nhận được nội dung từ mô hình.');
    }
  } catch (error) {
    const aborted = error.name === 'AbortError';
    if (!assistantMessage.text) {
      removeMessage(assistantMessage);
      removeMessage(userMessage);
      if (!els.input.value.trim()) {
        els.input.value = text;
        autoGrow();
      }
      if (!aborted) toast(error.message);
    } else if (!aborted) {
      toast('Dừng giữa chừng: ' + error.message);
    }
  } finally {
    if (rafId) cancelAnimationFrame(rafId);
    paint();
    persist();
    updateTurnCount();
    setBusy(false);
    controller = null;
    els.input.focus();
  }
}

async function consumeSSE(response, onEvent) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let boundary;
      while ((boundary = buffer.indexOf('\n\n')) !== -1) {
        const chunk = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data:')) continue;
          const data = line.slice(5).trim();
          if (!data) continue;
          try {
            onEvent(JSON.parse(data));
          } catch (error) {
            if (error instanceof SyntaxError) continue;
            throw error;
          }
        }
      }
    }
  } finally {
    try {
      await reader.cancel();
    } catch {
      /* already closed */
    }
  }
}

function removeMessage(message) {
  const index = state.messages.indexOf(message);
  if (index !== -1) state.messages.splice(index, 1);
  const nodes = els.messages.querySelectorAll('.msg');
  if (nodes.length) nodes[nodes.length - 1].remove();
  if (!state.messages.length) els.welcome.hidden = false;
}

function appendMessage(message) {
  const article = document.createElement('article');
  article.className = `msg ${message.role}`;
  article.innerHTML =
    message.role === 'assistant'
      ? '<div class="avatar">蛊</div><div class="bubble"><div class="content"></div></div>'
      : '<div class="bubble"><div class="content"></div></div>';
  const content = article.querySelector('.content');
  content.innerHTML = message.text ? renderMarkdown(message.text) : typingHtml();
  els.messages.appendChild(article);
  return content;
}

function renderMarkdown(text) {
  if (window.marked && window.DOMPurify) {
    return window.DOMPurify.sanitize(window.marked.parse(text));
  }
  return `<pre class="plain">${escapeHtml(text)}</pre>`;
}

function typingHtml() {
  return '<span class="typing"><i></i><i></i><i></i></span>';
}

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function setBusy(value) {
  busy = value;
  els.send.textContent = value ? 'Dừng' : 'Gửi';
  els.send.classList.toggle('stop', value);
}

function updateTurnCount() {
  const turns = state.messages.filter((m) => m.role === 'assistant' && m.text.trim()).length;
  els.turnCount.textContent = String(turns);
}

function isNearBottom() {
  return els.chat.scrollHeight - els.chat.scrollTop - els.chat.clientHeight < 160;
}

function scrollToBottom() {
  els.chat.scrollTop = els.chat.scrollHeight;
}

function autoGrow() {
  els.input.style.height = 'auto';
  els.input.style.height = Math.min(els.input.scrollHeight, 200) + 'px';
}

function startNewSession() {
  if (busy && controller) controller.abort();
  if (state.messages.length && !window.confirm('Xoá phiên hiện tại và bắt đầu cuộc đời mới?')) return;
  state.messages = [];
  localStorage.removeItem(STORAGE_KEY);
  els.messages.innerHTML = '';
  els.welcome.hidden = false;
  updateTurnCount();
  els.input.focus();
}

function exportSave() {
  if (!state.messages.length) {
    toast('Chưa có nội dung để lưu.');
    return;
  }
  const payload = {
    app: 'co-chan-nhan-roleplay',
    version: 1,
    savedAt: new Date().toISOString(),
    model: state.model || null,
    messages: state.messages,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
    String(now.getHours()).padStart(2, '0'),
    String(now.getMinutes()).padStart(2, '0'),
  ].join('');
  const link = document.createElement('a');
  link.href = url;
  link.download = `co-chan-nhan-${stamp}.json`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function checkHealth() {
  try {
    const response = await fetch('/api/health');
    const data = await response.json();
    state.model = data.model || '';
    els.modelName.textContent = data.model || '—';
    els.modelBadge.textContent = data.model || '—';
    if (data.hasKey) {
      els.keyStatus.textContent = 'Đã kết nối';
      els.keyStatus.className = 'ok';
    } else {
      els.keyStatus.textContent = 'Thiếu key';
      els.keyStatus.className = 'bad';
      els.keyHint.hidden = false;
    }
  } catch {
    els.keyStatus.textContent = 'Server chưa chạy';
    els.keyStatus.className = 'bad';
  }
}

function toast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const node = document.createElement('div');
  node.className = 'toast';
  node.textContent = message;
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 7000);
}
