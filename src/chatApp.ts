import { Type } from '@google/genai';
import type { ChatMessage, SaveState, TokenUsage, TurnDetails } from './types';
import {
  formatClock,
  formatMinorRank,
  loadStaticDatabase,
  resolveObligations,
  resolvePublicNpcViews,
} from './db';
import { getInventoryUsedSpace, getMaxEssence, getPlayerSatiety, getPlayerSuspicion } from './engine';
import { createAiClient, runGeminiGameTurn } from './geminiTools';
import { createMapModalController } from './mapModal';

interface StoredApiConfig {
  apiKey: string;
  model: string;
}

type InitStage = 'idle' | 'awaiting_name' | 'awaiting_steps';

interface InitDraft {
  stage: InitStage;
  name?: string;
}

const CONFIG_KEY = 'cns_gemini_config_v2';
const HISTORY_KEY = 'cns_chat_history_v2';
const SAVE_KEY = 'cns_game_save_v2';
const INIT_DRAFT_KEY = 'cns_init_draft_v2';

const DEFAULT_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.5-flash-lite',
  'gemini-2.5-pro',
];

const SEASON_VI: Record<SaveState['worldState']['season'], string> = {
  Spring: 'Xuân',
  Summer: 'Hạ',
  Autumn: 'Thu',
  Winter: 'Đông',
};

const FORBIDDEN_CANON_NAMES = [
  'phương nguyên',
  'phương chính',
  'cổ nguyệt bác',
  'bác',
  'mạc bắc',
  'xích thành',
  'xích luyện',
  'mạc trần',
  'dược cơ',
  'thanh thư',
  'xích sơn',
  'mạc nhan',
  'giác tam',
  'đống thổ',
  'cổ phú',
  'cổ kim sinh',
  'bạch ngưng băng',
  'vương đại',
  'giang nha',
];

const db = loadStaticDatabase();

function escapeHtml(s: string): string {
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function formatStoryHtml(text: string): string {
  return escapeHtml(text)
    .replace(/^---$/gm, '<hr>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
    .replace(/<br><hr><br>/g, '<hr>');
}

function loadConfig(): StoredApiConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<StoredApiConfig>;
      return {
        apiKey: typeof p.apiKey === 'string' ? p.apiKey.trim() : '',
        model: typeof p.model === 'string' && p.model.trim() ? p.model.trim() : 'gemini-3.8-flash',
      };
    }
  } catch {
    // ignore
  }
  return { apiKey: '', model: 'gemini-3.8-flash' };
}

function saveConfig(cfg: StoredApiConfig): void {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
}

function loadHistory(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (m): m is ChatMessage =>
            typeof m === 'object' &&
            m !== null &&
            (m.role === 'user' || m.role === 'model') &&
            typeof m.text === 'string'
        );
      }
    }
  } catch {
    // ignore
  }
  return [];
}

function saveHistory(hist: ChatMessage[]): void {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(hist.slice(-80)));
}

function loadSave(): SaveState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<SaveState>;
      if (p && p.player && p.worldState) return p as SaveState;
    }
    // Auto-migrate legacy profile (cns_player_profile_v2) from earlier minimal UI
    const legacyRaw = localStorage.getItem('cns_player_profile_v2');
    if (legacyRaw) {
      const lp = JSON.parse(legacyRaw) as {
        name?: string;
        aptitude?: number;
        aptitudeGrade?: 'Đinh đẳng' | 'Bính đẳng' | 'Ất đẳng';
        goal?: string;
        luck?: number;
      };
      if (lp && typeof lp.name === 'string' && typeof lp.aptitude === 'number') {
        const migrated = createInitialSaveState({
          name: lp.name,
          aptitude: lp.aptitude,
          aptitudeGrade: lp.aptitudeGrade ?? getAptitudeGrade(lp.aptitude),
        });
        if (typeof lp.luck === 'number' && lp.luck >= -50 && lp.luck <= 50) {
          migrated.player.luck = Math.round(lp.luck);
        }
        persistSave(migrated);
        return migrated;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

function persistSave(s: SaveState | null): void {
  if (!s) localStorage.removeItem(SAVE_KEY);
  else localStorage.setItem(SAVE_KEY, JSON.stringify(s));
}

function loadInitDraft(): InitDraft {
  try {
    const raw = localStorage.getItem(INIT_DRAFT_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Partial<InitDraft>;
      if (p.stage === 'awaiting_name' || p.stage === 'awaiting_steps') {
        return { stage: p.stage, name: p.name };
      }
    }
  } catch {
    // ignore
  }
  return { stage: 'idle' };
}

function saveInitDraft(d: InitDraft): void {
  if (d.stage === 'idle') localStorage.removeItem(INIT_DRAFT_KEY);
  else localStorage.setItem(INIT_DRAFT_KEY, JSON.stringify(d));
}

function createInitialSaveState(params: {
  name: string;
  aptitude: number;
  aptitudeGrade: 'Đinh đẳng' | 'Bính đẳng' | 'Ất đẳng';
}): SaveState {
  const maxEss = getMaxEssence(params.aptitude);
  // Strictly hidden luck roll (-50..+50)
  const hiddenLuck = Math.floor(Math.random() * 101) - 50;
  const now = new Date().toISOString();

  return {
    saveVersion: db.rules.saveVersion,
    createdAt: now,
    updatedAt: now,
    turnCount: 0,
    player: {
      name: params.name,
      age: 15,
      origin: 'Cô nhi gia tộc',
      rank: 1,
      aptitude: params.aptitude,
      aptitudeGrade: params.aptitudeGrade,
      currentEssence: maxEss,
      apertureStatus: 'Normal',
      cultivationProgress: 0,
      strength: 0.2,
      health: 100,
      fatigue: 0,
      satiety: 100,
      suspicion: 0,
      statusEffects: [],
      luck: hiddenLuck,
      locationId: 'loc_ky_tuc_xa',
      clanContribution: 0,
      factionRep: { clanLeader: 0, chiFaction: 0, moFaction: 0, neutral: 0 },
      ownedGu: [],
      inventory: {
        capacity: 20,
        primevalStones: 5,
        items: [{ itemId: 'item_luong_kho', quantity: 2 }],
      },
      relationships: [],
      knownRecipeIds: [],
      knownMoveIds: [],
      publicImage: {
        appearance: 'Thiếu niên 15 tuổi mặc áo vải thô giản dị của cô nhi học đồ Cổ Nguyệt Sơn Trại.',
        apparentRank: 1,
        apparentAptitude: params.aptitude,
        regionRep: [
          {
            regionTier: 'Clan',
            regionName: 'Cổ Nguyệt Sơn Trại',
            publicBio: `Cô nhi gia tộc khóa mới, tư chất ${params.aptitudeGrade} (${params.aptitude}%).`,
            rep: 5,
          },
        ],
      },
    },
    worldState: {
      currentDay: 1,
      currentShichen: 5, // Giờ Thìn (07:15)
      currentTime: 15,
      timeOfDay: 'Morning',
      season: 'Spring',
      worldDiceSeed: Math.floor(Math.random() * 1_000_000) + 1,
      worldFlags: [],
      memoryLog: [
        {
          day: 1,
          summary: `Khai khiếu thành công (${params.aptitudeGrade} ${params.aptitude}%).`,
          involvedNpcIds: [],
        },
      ],
      activeRumors: [],
    },
    npcStates: {},
    nodeStates: {},
    eventStates: { evt_day01_khai_hoc: 'Active' },
    obligationStates: {},
    ending: null,
  };
}

function getAptitudeGrade(steps: number): 'Đinh đẳng' | 'Bính đẳng' | 'Ất đẳng' {
  if (steps >= 60) return 'Ất đẳng';
  if (steps >= 40) return 'Bính đẳng';
  return 'Đinh đẳng';
}

function isKhoiTaoCommand(text: string): boolean {
  const norm = text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ');
  return norm === '/khoi tao' || norm === '/khoitao';
}

async function listAvailableModels(
  apiKey: string
): Promise<{ ok: boolean; models: string[]; error?: string }> {
  const ac = new AbortController();
  const timer = window.setTimeout(() => ac.abort(), 12000);
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models', {
      headers: { 'x-goog-api-key': apiKey },
      signal: ac.signal,
    });
    const data = (await res.json().catch(() => ({}))) as {
      models?: Array<{ name?: string; supportedGenerationMethods?: string[] }>;
      error?: { message?: string };
    };
    if (!res.ok) {
      return { ok: false, models: [], error: `Lỗi ${res.status}: ${data.error?.message ?? 'API Key không hợp lệ.'}` };
    }
    const models = (data.models ?? [])
      .filter(
        (m) =>
          m.name?.includes('gemini') &&
          m.supportedGenerationMethods?.includes('generateContent') &&
          !m.name.includes('embedding') &&
          !m.name.includes('image') &&
          !m.name.includes('tts') &&
          !m.name.includes('robotics')
      )
      .map((m) => (m.name ?? '').replace(/^models\//, ''))
      .filter(Boolean);
    return { ok: true, models };
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return { ok: false, models: [], error: 'Quá thời gian kết nối (12s) khi tải danh sách model.' };
    }
    return { ok: false, models: [], error: 'Không thể kết nối mạng tới Google AI Studio.' };
  } finally {
    window.clearTimeout(timer);
  }
}

function extractErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    const msg = err.message;
    if (msg.includes('503') || msg.includes('UNAVAILABLE') || msg.toLowerCase().includes('high demand')) {
      return 'Máy chủ Google đang tạm quá tải (503 UNAVAILABLE) dù đã tự thử lại. Save vẫn an toàn — hãy chờ vài giây rồi bấm Thử lại, hoặc đổi tạm model Flash khác trong Cài đặt API.';
    }
    if (msg.includes('429') || msg.toLowerCase().includes('quota') || msg.toLowerCase().includes('resource_exhausted')) {
      return `Chạm giới hạn tốc độ / hạn mức (429) của Gemini API. Chưa trừ chân nguyên hay thời gian — hãy chờ vài giây rồi bấm Thử lại. (${msg})`;
    }
    if (msg.includes('401') || msg.includes('403') || msg.toLowerCase().includes('api key')) {
      return `API Key không hợp lệ hoặc bị từ chối: ${msg}`;
    }
    if (msg.includes('404') || msg.toLowerCase().includes('not found')) {
      return `Model không khả dụng (404): ${msg}`;
    }
    return msg;
  }
  return 'Lỗi không xác định khi gọi Gemini API.';
}

async function validateNameWithGemini(
  apiKey: string,
  model: string,
  rawName: string
): Promise<{ valid: boolean; fullName: string; usage?: TokenUsage }> {
  const trimmed = rawName.trim().replace(/\s+/g, ' ');
  if (!trimmed || trimmed.length > 40 || /\d/.test(trimmed)) {
    return { valid: false, fullName: '' };
  }
  const lower = trimmed.toLowerCase();
  const withoutSurname = lower.replace(/^cổ nguyệt\s+/i, '').trim();
  if (!withoutSurname || FORBIDDEN_CANON_NAMES.some((n) => lower === n || withoutSurname === n)) {
    return { valid: false, fullName: '' };
  }

  const ai = createAiClient(apiKey);
  const res = await ai.models.generateContent({
    model,
    contents: [
      `Người chơi nhập tên nhân vật cho game nhập vai Cổ Chân Nhân (gia tộc Cổ Nguyệt tại Thanh Mao Sơn): "${trimmed}"`,
      '- TỪ CHỐI (valid = false) nếu: tên tiếng Anh/hiện đại/anime/meme/thô tục/vô nghĩa/spam, họ khác Cổ Nguyệt, hoặc trùng tên nhân vật nguyên tác Cổ Chân Nhân.',
      '- CHẤP NHẬN (valid = true) nếu là tên cổ phong / Hán-Việt / tiếng Việt hợp lý cho thiếu niên tộc Cổ Nguyệt.',
      '- Nếu người chơi chưa ghi họ "Cổ Nguyệt" ở đầu (vd chỉ ghi "Thanh Phong"), tự gắn "Cổ Nguyệt " ở đầu vào fullName.',
    ].join('\n'),
    config: {
      temperature: 0.1,
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          valid: { type: Type.BOOLEAN },
          fullName: { type: Type.STRING },
        },
        required: ['valid', 'fullName'],
      },
    },
  });

  const um = res.usageMetadata;
  const usage: TokenUsage | undefined = um
    ? {
        promptTokens: um.promptTokenCount ?? 0,
        outputTokens: um.candidatesTokenCount ?? 0,
        thoughtTokens: um.thoughtsTokenCount ?? 0,
        cachedTokens: um.cachedContentTokenCount ?? 0,
        totalTokens:
          um.totalTokenCount ??
          (um.promptTokenCount ?? 0) + (um.candidatesTokenCount ?? 0) + (um.thoughtsTokenCount ?? 0),
        apiCalls: 1,
      }
    : undefined;

  const parsed = JSON.parse((res.text ?? '').trim()) as { valid?: boolean; fullName?: string };
  if (!parsed.valid || !parsed.fullName?.trim()) return { valid: false, fullName: '', usage };

  let formatted = parsed.fullName.trim().replace(/\s+/g, ' ');
  if (!formatted.toLowerCase().startsWith('cổ nguyệt ')) {
    formatted = `Cổ Nguyệt ${formatted}`;
  }
  return { valid: true, fullName: formatted, usage };
}

// === Approved /khoi tao scripts ===
const SCRIPT_STEP_1 = [
  'Hơi lạnh ẩm ướt từ lòng đất thấm qua lớp áo vải thô cũ kỹ, kéo ngươi thoát khỏi cơn mụ mị. Bên tai vang lên tiếng nước chảy róc rách trầm đục giữa hang động ngầm dưới Gia Tộc Từ Đường.',
  '',
  'Trước mắt ngươi là dòng **Chân Nguyên Thủy Tuyền** lấp lánh thứ ánh sáng mờ ảo lạnh lẽo. Dọc bờ đá, hàng chục thiếu niên mười lăm tuổi đứng chen vai, phía sau kẻ thì có cha mẹ dặn dò, kẻ thì có trưởng bối mạch phái dõi theo — chỉ riêng ngươi đứng lặng một mình ở góc khuất, một **cô nhi gia tộc** không nơi nương tựa sau đợt thú triều năm xưa. Trên bậc đá cao, Tộc trưởng Cổ Nguyệt Bác cùng chư vị Gia lão đứng im lìm như những pho tượng.',
  '',
  'Hôm nay là **Khai Khiếu Đại Điển** — cánh cửa duy nhất để ngươi tự nắm lấy vận mệnh. Ký ức mơ hồ trong đầu dần tụ lại... Ngươi dần nhớ ra, tên của ngươi là gì?',
].join('\n');

const SCRIPT_NAME_INVALID =
  'Không... ngươi không phải tên này. Cái tên ấy xa lạ với dòng máu trong người ngươi. Hãy tĩnh tâm nhớ lại — trong Cổ Nguyệt sơn trại này, ngươi tên là gì?';

function buildStep2Script(fullName: string): string {
  return [
    `Đúng rồi... **${fullName}** — đó chính là tên của ngươi.`,
    '',
    'Giữa ánh đèn mờ tỏ của hang ngầm, gia lão đứng bên bờ chậm rãi xướng danh:',
    '',
    `*"${fullName}!"*`,
    '',
    'Đến lượt ngươi. Ngươi hít sâu một hơi, bước chân xuống dòng Chân Nguyên Thủy Tuyền lạnh buốt thấu xương. Vô số đốm sáng **Hi Vọng Cổ** như đàn đom đóm bừng tỉnh giữa bóng tối, lao tới va thẳng vào bụng dưới ngươi; bức tường áp lực vô hình phía trước mỗi bước một nặng như núi đè.',
    '',
    'Ngươi nhớ rõ, trong đêm Khai Khiếu ấy, ngươi đã cắn răng bước đi được bao nhiêu bước?',
  ].join('\n');
}

const SCRIPT_STEPS_TOO_HIGH =
  'Không... ánh sáng quanh thân ngươi đêm ấy chưa từng chói lòa tới mức Giáp đẳng như vậy. Cả khóa này chỉ có duy nhất một thiên tài bước qua mốc tám mươi bước. Hãy nhớ cho rõ — ngươi thực sự đi được bao nhiêu bước?';

const SCRIPT_STEPS_INVALID =
  'Nếu dừng bước sớm đến vậy, Hi Vọng Cổ đã chẳng thể giúp ngươi phá mở không khiếu. Hãy nhập một con số từ 20 đến 79.';

function buildStep3MorningScript(
  fullName: string,
  steps: number,
  grade: 'Đinh đẳng' | 'Bính đẳng' | 'Ất đẳng',
  maxEssence: number
): string {
  const reaction =
    grade === 'Ất đẳng'
      ? 'Giọng gia lão kéo ngươi tỉnh khỏi cơn thất thần. Quanh hang đá thoáng vang lên vài tiếng xì xào khẽ khàng; ánh mắt vài vị gia lão trên bậc đá dừng lại trên thân ảnh cô nhi của ngươi một nhịp đầy chú ý rồi lại thu về bình thản. Mang theo trăm mối suy nghĩ ngổn ngang, ngươi lặng lẽ quay về hàng, rồi theo đoàn trở về căn phòng nhỏ lạnh lẽo, chìm vào giấc ngủ sâu sau một đêm Khai Khiếu đầy biến động.'
      : 'Giọng gia lão kéo ngươi tỉnh khỏi cơn thất thần. Quanh hang đá chẳng mấy ai để tâm đến một cô nhi bình thường; ánh mắt các trưởng bối chỉ lướt qua hờ hững rồi nhanh chóng gọi tên người kế tiếp. Mang theo trăm mối suy nghĩ ngổn ngang, ngươi lặng lẽ quay về hàng, rồi theo đoàn trở về căn phòng nhỏ lạnh lẽo, chìm vào giấc ngủ sâu sau một đêm Khai Khiếu đầy biến động.';

  return [
    `**${steps} bước...**`,
    '',
    'Ngay khi ngươi dồn hết khí lực đặt bước chân cuối cùng, trong bụng dưới chợt chấn động dữ dội — màn chắn vô hình vỡ tan, **không khiếu chính thức khai mở**! Giọng gia lão vang lên trầm đục, lạnh nhạt giữa hang ngầm:',
    '',
    `*"${fullName} — **${grade} tư chất (${steps}%)**!"*`,
    '',
    reaction,
    '',
    '---',
    '',
    '*Boong… boong… boong…*',
    '',
    'Ba hồi chuông đồng trầm đục vang khắp Cổ Nguyệt sơn trại, xuyên qua màn sương sớm Thanh Mao Sơn đánh thức ngươi khỏi giấc ngủ. Ngoài hành lang nhà sàn mâu trúc, tiếng bước chân gấp gáp và giọng bàn tán râm ran của đám thiếu niên cùng khóa vọng lại — **đã đến giờ lên lớp buổi học đầu tiên tại Học Đường Cổ Nguyệt**.',
    '',
    `Trong không khiếu nơi bụng dưới, **${maxEssence.toFixed(1)} thành Thanh Đồng chân nguyên sơ giai** khẽ dập dờn. Một ngày mới đã bắt đầu — ngươi định làm gì lúc này?`,
  ].join('\n');
}

// === DOM Elements ===
const sidebar = document.getElementById('sidebar') as HTMLElement;
const sidebarBackdrop = document.getElementById('sidebar-backdrop') as HTMLElement;
const closeSidebarBtn = document.getElementById('close-sidebar-btn') as HTMLButtonElement;
const openSidebarBtn = document.getElementById('open-sidebar-btn') as HTMLButtonElement;
const newChatBtn = document.getElementById('new-chat-btn') as HTMLButtonElement;
const openMapBtn = document.getElementById('open-map-btn') as HTMLButtonElement;
const openApiSidebarBtn = document.getElementById('open-api-sidebar-btn') as HTMLButtonElement;

const worldClockEl = document.getElementById('world-clock') as HTMLElement;
const locPillEl = document.getElementById('loc-pill') as HTMLButtonElement;
const apiStatusBtn = document.getElementById('api-status-btn') as HTMLButtonElement;

const panelProfile = document.getElementById('panel-profile') as HTMLElement;
const panelGu = document.getElementById('panel-gu') as HTMLElement;
const panelInventory = document.getElementById('panel-inventory') as HTMLElement;
const panelNpcs = document.getElementById('panel-npcs') as HTMLElement;
const panelMemory = document.getElementById('panel-memory') as HTMLElement;
const countGuEl = document.getElementById('count-gu') as HTMLElement;
const countStonesEl = document.getElementById('count-stones') as HTMLElement;
const countNpcsEl = document.getElementById('count-npcs') as HTMLElement;

const chatContainer = document.getElementById('chat-container') as HTMLElement;
const chatContent = document.querySelector('.chat-content') as HTMLElement;
const turnStatusEl = document.getElementById('turn-status') as HTMLElement;
const promptForm = document.getElementById('prompt-bar') as HTMLFormElement;
const inputEl = document.getElementById('input') as HTMLTextAreaElement;
const submitBtn = promptForm.querySelector('button[type="submit"]') as HTMLButtonElement;

// API Modal
const apiModal = document.getElementById('api-modal') as HTMLElement;
const closeApiModalBtn = document.getElementById('close-api-modal-btn') as HTMLButtonElement;
const apiKeyInput = document.getElementById('api-key-input') as HTMLInputElement;
const toggleKeyBtn = document.getElementById('toggle-key-btn') as HTMLButtonElement;
const modelSelect = document.getElementById('model-select') as HTMLSelectElement;
const testApiBtn = document.getElementById('test-api-btn') as HTMLButtonElement;
const saveApiBtn = document.getElementById('save-api-btn') as HTMLButtonElement;
const testResultEl = document.getElementById('api-test-result') as HTMLElement;
const exportSaveBtn = document.getElementById('export-save-btn') as HTMLButtonElement;
const importSaveBtn = document.getElementById('import-save-btn') as HTMLButtonElement;
const importSaveFile = document.getElementById('import-save-file') as HTMLInputElement;

// Map Modal
const mapModal = document.getElementById('map-modal') as HTMLElement;
const closeMapModalBtn = document.getElementById('close-map-modal-btn') as HTMLButtonElement;
const mapZTabsEl = document.getElementById('map-z-tabs') as HTMLElement;
const mapSvgEl = document.getElementById('map-svg') as unknown as SVGSVGElement;
const mapInspectorEl = document.getElementById('map-inspector') as HTMLElement;

let config = loadConfig();
let history = loadHistory();
let save = loadSave();
let initDraft = loadInitDraft();
let isBusy = false;
let discoveredModels: string[] = [];

// Responsive initial sidebar state: collapsed on narrow screens (<= 820px)
function setSidebarClosed(closed: boolean): void {
  sidebar.classList.toggle('collapsed', closed);
  document.body.classList.toggle('sidebar-closed', closed);
}
const mobileQuery = window.matchMedia('(max-width: 820px)');
if (mobileQuery.matches) {
  setSidebarClosed(true);
}
mobileQuery.addEventListener('change', (e) => {
  if (e.matches) setSidebarClosed(true);
});
closeSidebarBtn.addEventListener('click', () => setSidebarClosed(true));
openSidebarBtn.addEventListener('click', () => setSidebarClosed(false));
sidebarBackdrop.addEventListener('click', () => setSidebarClosed(true));

// Sidebar Accordions
document.querySelectorAll<HTMLButtonElement>('.nav-accordion-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.acc;
    const panel = key ? document.getElementById(`panel-${key}`) : null;
    if (!panel) return;
    const open = panel.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  });
});

// Map Controller
const mapCtrl = createMapModalController({
  modalEl: mapModal,
  tabsEl: mapZTabsEl,
  svgEl: mapSvgEl,
  inspectorEl: mapInspectorEl,
  db,
  getSave: () => save,
  onQuickTravel: (cmd) => {
    inputEl.value = cmd;
    autoResizeInput();
    inputEl.focus();
  },
});

openMapBtn.addEventListener('click', () => {
  if (window.innerWidth <= 820) setSidebarClosed(true);
  mapCtrl.open();
});
locPillEl.addEventListener('click', () => mapCtrl.open());
closeMapModalBtn.addEventListener('click', () => mapCtrl.close());
mapModal.addEventListener('click', (e) => {
  if (e.target === mapModal) mapCtrl.close();
});

// === Render Top Bar & All 5 Sidebar Panels ===
function renderWorldUI(): void {
  // Top slim bar
  if (save) {
    const ws = save.worldState;
    const clk = formatClock(ws.currentShichen, ws.currentTime, db.rules.time.shichenNames);
    const loc = db.locationMap.get(save.player.locationId);
    worldClockEl.textContent = `Ngày ${ws.currentDay} · ${SEASON_VI[ws.season]} · ${clk.shichenLabel} (${clk.hhmm})`;
    locPillEl.textContent = loc?.name ?? save.player.locationId;
    locPillEl.classList.add('visible');
  } else {
    worldClockEl.textContent = '';
    locPillEl.classList.remove('visible');
  }

  // 1. Nhân vật & Chỉ số (STRICTLY NO luck!)
  if (!save) {
    panelProfile.innerHTML =
      '<span>Chưa khởi tạo nhân vật. Gõ <strong>/khoi tao</strong> để bắt đầu.</span>';
    panelGu.innerHTML = '<span>Chưa có cổ trùng.</span>';
    panelInventory.innerHTML = '<span>Túi đồ trống.</span>';
    panelNpcs.innerHTML = '<span>Chưa bước vào sơn trại.</span>';
    panelMemory.innerHTML = '<span>Chưa có ghi chép.</span>';
    countGuEl.textContent = '0';
    countStonesEl.textContent = '0 NT';
    countNpcsEl.textContent = '0';
    return;
  }

  const p = save.player;
  const maxEss = getMaxEssence(p.aptitude);
  const essPct = Math.min(100, (p.currentEssence / maxEss) * 100);
  const usedCap = getInventoryUsedSpace(save, db);

  panelProfile.innerHTML = `
    <div class="profile-row"><span>Họ tên</span><span class="profile-val">${escapeHtml(p.name)} (${p.age}t)</span></div>
    <div class="profile-row"><span>Thân phận</span><span class="profile-val">${escapeHtml(p.origin)}</span></div>
    <div class="profile-row"><span>Cảnh giới</span><span class="profile-val">${formatMinorRank(p.rank)}</span></div>
    <div class="profile-row"><span>Tư chất</span><span class="profile-val">${p.aptitudeGrade} (${p.aptitude}%)</span></div>
    <div class="profile-row"><span>Không khiếu</span><span class="profile-val">${p.apertureStatus}</span></div>
    <div>
      <div class="profile-row"><span>Thể trạng (HP)</span><span class="profile-val">${p.health}%</span></div>
      <div class="bar-track"><div class="bar-fill ${p.health <= 30 ? 'warn' : ''}" style="width:${p.health}%"></div></div>
    </div>
    <div>
      <div class="profile-row"><span>Chân nguyên</span><span class="profile-val">${p.currentEssence.toFixed(1)} / ${maxEss.toFixed(1)} thành</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${essPct}%"></div></div>
    </div>
    <div>
      <div class="profile-row"><span>Ôn dưỡng đột phá</span><span class="profile-val">${p.cultivationProgress}%</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${p.cultivationProgress}%"></div></div>
    </div>
    <div>
      <div class="profile-row"><span>Mệt mỏi</span><span class="profile-val">${p.fatigue}/100</span></div>
      <div class="bar-track"><div class="bar-fill ${p.fatigue >= 70 ? 'warn' : ''}" style="width:${p.fatigue}%"></div></div>
    </div>
    <div>
      <div class="profile-row"><span>Độ no</span><span class="profile-val">${getPlayerSatiety(p)}%</span></div>
      <div class="bar-track"><div class="bar-fill ${getPlayerSatiety(p) <= 25 ? 'warn' : ''}" style="width:${getPlayerSatiety(p)}%"></div></div>
    </div>
    <div class="profile-row"><span>Khí lực</span><span class="profile-val">${p.strength} trư lực</span></div>
    <div class="profile-row"><span>Cống hiến</span><span class="profile-val">${p.clanContribution}</span></div>
    ${
      getPlayerSuspicion(p) > 0
        ? `<div>
      <div class="profile-row"><span>Nghi ngờ Hình Đường</span><span class="profile-val">${getPlayerSuspicion(p)}/100</span></div>
      <div class="bar-track"><div class="bar-fill warn" style="width:${getPlayerSuspicion(p)}%"></div></div>
    </div>`
        : ''
    }
    ${
      p.statusEffects.length > 0
        ? `<div class="mini-card">${p.statusEffects.map((e) => `<div class="profile-row"><span>${escapeHtml(e.name)}</span><span class="pill-tag warn">${e.severity}</span></div>`).join('')}</div>`
        : ''
    }
  `;

  // 2. Cổ trùng
  countGuEl.textContent = String(p.ownedGu.length);
  if (p.ownedGu.length === 0) {
    panelGu.innerHTML =
      '<span>Chưa sở hữu cổ trùng. Ngày 7 Cổ Thất bên cạnh Học Đường sẽ mở cửa chọn Bản Mệnh Cổ.</span>';
  } else {
    panelGu.innerHTML = p.ownedGu
      .map((og) => {
        const def = db.guMap.get(og.guId);
        const foodDef = def ? db.itemMap.get(def.food.itemId) : null;
        return `
          <div class="mini-card">
            <div class="profile-row">
              <strong style="color:#e3e3e3">${escapeHtml(def?.name ?? og.guId)}</strong>
              ${og.isVital ? '<span class="pill-tag jade">Bản Mệnh</span>' : ''}
            </div>
            <div class="detail-pills">
              <span class="pill-tag ${og.isRefined ? 'jade' : 'warn'}">${og.isRefined ? 'Đã luyện hóa' : 'Chưa luyện hóa'}</span>
              ${og.condition === 'Injured' ? '<span class="pill-tag warn">Trọng thương</span>' : ''}
            </div>
            <div>
              <div class="profile-row"><span>Độ no (${escapeHtml(foodDef?.name ?? 'Thức ăn')})</span><span class="profile-val">${Math.round(og.hunger)}%</span></div>
              <div class="bar-track"><div class="bar-fill ${og.hunger <= 20 ? 'warn' : ''}" style="width:${og.hunger}%"></div></div>
            </div>
          </div>
        `;
      })
      .join('');
  }

  // 3. Túi đồ
  countStonesEl.textContent = `${p.inventory.primevalStones} NT`;
  panelInventory.innerHTML = `
    <div class="profile-row"><span>Nguyên thạch</span><span class="profile-val">${p.inventory.primevalStones} khối</span></div>
    <div class="profile-row"><span>Sức chứa</span><span class="profile-val">${usedCap} / ${p.inventory.capacity}</span></div>
    ${
      p.inventory.items.length === 0
        ? '<span>Không có vật phẩm khác.</span>'
        : p.inventory.items
            .map((it) => {
              const def = db.itemMap.get(it.itemId);
              return `<div class="mini-card"><div class="profile-row"><strong style="color:#e3e3e3">${escapeHtml(def?.name ?? it.itemId)}</strong><span class="profile-val">×${it.quantity}</span></div></div>`;
            })
            .join('')
    }
  `;

  // 4. NPC & Quan hệ (CHỈ hiện publicImage)
  const pubNpcs = resolvePublicNpcViews(db, save);
  const hereNpcs = pubNpcs.filter((n) => n.locationId === p.locationId && n.status === 'Alive');
  const relNpcs = pubNpcs.filter((n) => n.attitude !== null);
  countNpcsEl.textContent = String(hereNpcs.length);

  const hereHtml =
    hereNpcs.length === 0
      ? '<span>Không thấy nhân vật nổi bật quanh đây.</span>'
      : hereNpcs
          .map(
            (n) => `
          <div class="mini-card">
            <div class="profile-row">
              <strong style="color:#e3e3e3">${escapeHtml(n.name)}</strong>
              <span class="pill-tag">${formatMinorRank(n.publicImage.apparentRank)}</span>
            </div>
            <span style="font-size:11.5px">${escapeHtml(n.role)}</span>
            <span style="font-size:11px; color:#8e918f">${escapeHtml(n.publicImage.appearance)}</span>
          </div>`
          )
          .join('');

  const relHtml =
    relNpcs.length > 0
      ? `<strong style="color:#e3e3e3; margin-top:4px">Ân oán đã ghi nhận</strong>` +
        relNpcs
          .map(
            (n) => `
          <div class="mini-card">
            <div class="profile-row"><strong style="color:#e3e3e3">${escapeHtml(n.name)}</strong><span class="profile-val">${n.attitude}</span></div>
            ${n.privateNote ? `<span style="font-size:11.5px">${escapeHtml(n.privateNote)}</span>` : ''}
          </div>`
          )
          .join('')
      : '';

  panelNpcs.innerHTML = `<strong style="color:#e3e3e3">Đang có mặt gần đây</strong>${hereHtml}${relHtml}`;

  // 5. Ký ức & Nghĩa vụ
  const obs = resolveObligations(db, save).slice(0, 3);
  const mems = save.worldState.memoryLog.slice(-6).reverse();
  const rumors = save.worldState.activeRumors;

  panelMemory.innerHTML = `
    <strong style="color:#e3e3e3">Nghĩa vụ Học đường</strong>
    ${obs
      .map(
        (o) =>
          `<div class="mini-card"><div class="profile-row"><span>${escapeHtml(o.name)}</span><span class="pill-tag">Vắng ${o.missedCount}/${o.maxMissedAllowed}</span></div></div>`
      )
      .join('')}
    ${
      rumors.length > 0
        ? `<strong style="color:#e3e3e3; margin-top:4px">Tin đồn (${rumors.length})</strong>` +
          rumors
            .map(
              (r) =>
                `<div class="mini-card"><span>${escapeHtml(r.content)}</span><span class="pill-tag">Lan rộng ${r.spreadLevel}%</span></div>`
            )
            .join('')
        : ''
    }
    <strong style="color:#e3e3e3; margin-top:4px">Nhật ký ký ức</strong>
    ${mems
      .map(
        (m) =>
          `<div class="mini-card"><span style="font-size:11px; color:#8e918f">Ngày ${m.day}</span><span>${escapeHtml(m.summary)}</span></div>`
      )
      .join('')}
  `;
}

function updateInputPlaceholder(): void {
  if (initDraft.stage === 'awaiting_name') {
    inputEl.placeholder = 'Cổ Nguyệt ...';
  } else if (initDraft.stage === 'awaiting_steps') {
    inputEl.placeholder = 'Nhập một số từ 20 đến 79';
  } else if (save?.ending) {
    inputEl.placeholder = 'Hành trình đã kết thúc. Bấm "+ Cuộc trò chuyện mới" để bắt đầu lại.';
  } else {
    inputEl.placeholder = save
      ? 'Nhập hành động của bạn...'
      : 'Gõ /khoi tao để bắt đầu Khai Khiếu Đại Điển...';
  }
}

function populateModelSelect(selected: string): void {
  const source = discoveredModels.length > 0 ? discoveredModels : DEFAULT_MODELS;
  const unique = Array.from(new Set([...source, selected].filter(Boolean)));
  modelSelect.innerHTML = '';
  for (const m of unique) {
    const opt = document.createElement('option');
    opt.value = m;
    opt.textContent = m;
    if (m === selected) opt.selected = true;
    modelSelect.appendChild(opt);
  }
}

function updateApiStatusBadge(): void {
  if (config.apiKey) {
    apiStatusBtn.textContent = `✦ ${config.model}`;
    apiStatusBtn.classList.add('connected');
  } else {
    apiStatusBtn.textContent = 'Chưa kết nối API';
    apiStatusBtn.classList.remove('connected');
  }
}

// === API Modal & Export/Import Save ===
let apiTestRunId = 0;

function resetTestBtn(): void {
  testApiBtn.disabled = false;
  testApiBtn.textContent = 'Kiểm tra & tải model';
}

function openApiModal(): void {
  apiTestRunId += 1;
  resetTestBtn();
  apiKeyInput.value = config.apiKey;
  populateModelSelect(config.model);
  testResultEl.textContent = '';
  testResultEl.className = 'api-status-msg';
  exportSaveBtn.disabled = !save;
  apiModal.classList.add('open');
}

function closeApiModal(): void {
  apiTestRunId += 1;
  resetTestBtn();
  apiModal.classList.remove('open');
}

apiStatusBtn.addEventListener('click', openApiModal);
openApiSidebarBtn.addEventListener('click', () => {
  if (window.innerWidth <= 820) setSidebarClosed(true);
  openApiModal();
});
closeApiModalBtn.addEventListener('click', closeApiModal);
apiModal.addEventListener('click', (e) => {
  if (e.target === apiModal) closeApiModal();
});

toggleKeyBtn.addEventListener('click', () => {
  const showing = apiKeyInput.type === 'text';
  apiKeyInput.type = showing ? 'password' : 'text';
  toggleKeyBtn.textContent = showing ? 'Hiện' : 'Ẩn';
});

testApiBtn.addEventListener('click', async () => {
  const key = apiKeyInput.value.trim();
  if (!key) {
    testResultEl.textContent = 'Vui lòng dán Google AI Studio API Key trước.';
    testResultEl.className = 'api-status-msg err';
    return;
  }
  const runId = ++apiTestRunId;
  testApiBtn.disabled = true;
  testApiBtn.textContent = 'Đang kiểm tra...';
  testResultEl.textContent = 'Đang kiểm tra API Key và tải danh sách model...';
  testResultEl.className = 'api-status-msg';

  const listRes = await listAvailableModels(key);
  if (runId !== apiTestRunId) return;

  if (!listRes.ok) {
    testResultEl.textContent = listRes.error ?? 'Không thể xác thực API Key.';
    testResultEl.className = 'api-status-msg err';
    resetTestBtn();
    return;
  }

  discoveredModels = listRes.models;
  let chosen = modelSelect.value || 'gemini-3.8-flash';
  if (discoveredModels.length > 0 && !discoveredModels.includes(chosen)) {
    chosen =
      discoveredModels.find((m) => m === 'gemini-3.8-flash') ??
      discoveredModels.find((m) => m.includes('flash') && !m.includes('lite') && !m.includes('2.5') && !m.includes('2.0')) ??
      discoveredModels.find((m) => m.includes('flash')) ??
      discoveredModels[0];
  }
  populateModelSelect(chosen);

  testResultEl.textContent = `Key hợp lệ (${discoveredModels.length} model). Đang gửi thử tới ${chosen}...`;

  let timeoutId: number | undefined;
  try {
    const ai = createAiClient(key);
    const pingPromise = ai.models.generateContent({ model: chosen, contents: 'Trả lời đúng 1 từ: OK' });
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = window.setTimeout(
        () => reject(new Error(`Model "${chosen}" phản hồi quá lâu (>15 giây). Hãy thử chọn model khác.`)),
        15000
      );
    });
    const ping = await Promise.race([pingPromise, timeoutPromise]);
    if (runId !== apiTestRunId) return;
    const reply = (ping.text ?? '').trim();
    testResultEl.textContent = `Kết nối thành công tới ${chosen}! (${discoveredModels.length} model khả dụng${reply ? ` · "${reply.slice(0, 24)}"` : ''})`;
    testResultEl.className = 'api-status-msg ok';
  } catch (err) {
    if (runId !== apiTestRunId) return;
    testResultEl.textContent = `Key hợp lệ (${discoveredModels.length} model), nhưng model "${chosen}" lỗi: ${extractErrorMessage(err)}`;
    testResultEl.className = 'api-status-msg err';
  } finally {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    if (runId === apiTestRunId) resetTestBtn();
  }
});

saveApiBtn.addEventListener('click', () => {
  config = {
    apiKey: apiKeyInput.value.trim(),
    model: modelSelect.value.trim() || 'gemini-3.8-flash',
  };
  saveConfig(config);
  updateApiStatusBadge();
  renderAllMessages();
  closeApiModal();
});

exportSaveBtn.addEventListener('click', () => {
  if (!save) return;
  const payload = JSON.stringify({ save, history }, null, 2);
  const blob = new Blob([payload], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `co-nguyet-day${save.worldState.currentDay}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

importSaveBtn.addEventListener('click', () => importSaveFile.click());
importSaveFile.addEventListener('change', async () => {
  const file = importSaveFile.files?.[0];
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text()) as { save?: SaveState; history?: ChatMessage[] };
    if (!parsed.save?.player || !parsed.save?.worldState) {
      throw new Error('File save không đúng cấu trúc.');
    }
    save = parsed.save;
    history = Array.isArray(parsed.history) ? parsed.history : [];
    initDraft = { stage: 'idle' };
    persistSave(save);
    saveHistory(history);
    saveInitDraft(initDraft);
    renderWorldUI();
    updateInputPlaceholder();
    renderAllMessages();
    closeApiModal();
  } catch (err) {
    testResultEl.textContent = err instanceof Error ? err.message : 'Lỗi đọc file save.';
    testResultEl.className = 'api-status-msg err';
  } finally {
    importSaveFile.value = '';
  }
});

// === Chat Rendering & Hidden System Details ===
function scrollToBottom(): void {
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function formatNumberVi(n: number): string {
  return n.toLocaleString('vi-VN');
}

function formatTokenUsageLine(u: TokenUsage): string {
  if (u.apiCalls === 0 || u.totalTokens === 0) {
    return '0 token';
  }
  const segs: string[] = [
    `${formatNumberVi(u.totalTokens)} token`,
    `In ${formatNumberVi(u.promptTokens)}`,
    `Out ${formatNumberVi(u.outputTokens)}`,
  ];
  if (u.thoughtTokens > 0) {
    segs.push(`Think ${formatNumberVi(u.thoughtTokens)}`);
  }
  if (u.cachedTokens > 0) {
    segs.push(`Cache ${formatNumberVi(u.cachedTokens)}`);
  }
  if (u.apiCalls > 1) {
    segs.push(`${u.apiCalls} calls`);
  }
  return segs.join(' · ');
}

function makeUsageOnlyDetails(model: string, usage?: TokenUsage): TurnDetails | undefined {
  if (!usage) return undefined;
  return {
    model,
    diceRolls: [],
    essenceSpent: 0,
    minutesPassed: 0,
    interrupts: [],
    changes: [],
    usage,
  };
}

function hasAnyToolDetails(d?: TurnDetails): boolean {
  if (!d) return false;
  return (
    d.diceRolls.length > 0 ||
    d.essenceSpent > 0 ||
    d.minutesPassed > 0 ||
    d.interrupts.length > 0 ||
    d.changes.length > 0
  );
}

function attachHiddenDetails(containerEl: HTMLElement, details?: TurnDetails): void {
  const showToolToggle = hasAnyToolDetails(details);
  const usage = details?.usage;
  if (!showToolToggle && !usage) return;

  const wrap = document.createElement('div');
  wrap.className = 'turn-details-wrap';

  const metaRow = document.createElement('div');
  metaRow.className = 'msg-meta-row';

  let box: HTMLDivElement | null = null;

  if (showToolToggle && details) {
    const toggleBtn = document.createElement('button');
    toggleBtn.type = 'button';
    toggleBtn.className = 'turn-details-toggle';
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.textContent = '▸ Chi tiết';

    box = document.createElement('div');
    box.className = 'turn-details-box';

    const pills: string[] = [];
    const catLabelMap: Record<string, string> = {
      physical: 'Thể chất',
      social: 'Giao tiếp',
      cultivation: 'Tu luyện',
    };
    for (const d of details.diceRolls) {
      const cls = d.success ? 'jade' : 'warn';
      const marginStr = d.margin >= 0 ? `+${d.margin}` : `${d.margin}`;
      const catTag = d.category ? ` [${catLabelMap[d.category] ?? d.category}]` : '';
      const crit = d.isCritSuccess
        ? d.success
          ? ' · Kỳ tích 100'
          : ' · Thoát hiểm 100'
        : d.isCritFail
          ? ' · Biến cố 1'
          : '';
      // Strictly does NOT expose player's hidden luck!
      pills.push(
        `<span class="pill-tag ${cls}">d100${catTag}: ${d.roll} / DC ${d.targetDC} (${marginStr})${crit}</span>`
      );
    }
    if (details.essenceSpent > 0) {
      pills.push(`<span class="pill-tag">Chân nguyên: -${details.essenceSpent} thành</span>`);
    }
    if (details.minutesPassed > 0) {
      pills.push(`<span class="pill-tag">Thời gian: +${details.minutesPassed} phút</span>`);
    }

    const parts: string[] = [];
    if (pills.length > 0) parts.push(`<div class="detail-pills">${pills.join('')}</div>`);
    if (details.interrupts.length > 0) {
      parts.push(
        `<div style="color:#f0a4a4">${details.interrupts.map((i) => `Ngắt quãng: ${escapeHtml(i)}`).join('<br>')}</div>`
      );
    }
    if (details.changes.length > 0) {
      parts.push(
        `<ul class="detail-list">${details.changes.map((c) => `<li>${escapeHtml(c)}</li>`).join('')}</ul>`
      );
    }
    box.innerHTML = parts.join('');

    const targetBox = box;
    toggleBtn.addEventListener('click', () => {
      const open = targetBox.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', String(open));
      toggleBtn.textContent = open ? '▾ Chi tiết' : '▸ Chi tiết';
      if (open) targetBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    metaRow.appendChild(toggleBtn);
  }

  if (usage) {
    const tokSpan = document.createElement('span');
    tokSpan.className = 'token-usage-meta';
    tokSpan.title = details?.model ? `Model: ${details.model}` : 'Token sử dụng';
    tokSpan.textContent = formatTokenUsageLine(usage);
    metaRow.appendChild(tokSpan);
  }

  wrap.appendChild(metaRow);
  if (box) wrap.appendChild(box);
  containerEl.appendChild(wrap);
}

function appendMessageElement(
  role: 'user' | 'ai',
  text: string,
  details?: TurnDetails
): HTMLDivElement {
  const el = document.createElement('div');
  el.className = `message ${role}`;
  if (role === 'user') {
    el.textContent = text;
  } else {
    const body = document.createElement('div');
    body.className = 'ai-text';
    body.innerHTML = formatStoryHtml(text);
    el.appendChild(body);
    attachHiddenDetails(el, details);
  }
  chatContent.appendChild(el);
  scrollToBottom();
  return el;
}

function pushUserMessage(text: string): void {
  const welcome = chatContent.querySelector('.empty-welcome');
  if (welcome) welcome.remove();
  history.push({ role: 'user', text });
  saveHistory(history);
  appendMessageElement('user', text);
}

async function revealAiMessage(text: string, details?: TurnDetails): Promise<void> {
  const welcome = chatContent.querySelector('.empty-welcome');
  if (welcome) welcome.remove();

  history.push({ role: 'model', text, details });
  saveHistory(history);

  const el = appendMessageElement('ai', '');
  const body = el.querySelector('.ai-text') as HTMLElement;

  let skip = false;
  const onSkip = () => {
    skip = true;
  };
  body.addEventListener('click', onSkip, { once: true });

  let idx = 0;
  while (idx < text.length && !skip) {
    idx = Math.min(text.length, idx + 2);
    body.innerHTML = formatStoryHtml(text.slice(0, idx));
    scrollToBottom();
    await new Promise((r) => setTimeout(r, 14));
  }

  body.removeEventListener('click', onSkip);
  body.innerHTML = formatStoryHtml(text);
  attachHiddenDetails(el, details);
  scrollToBottom();
}

function renderEndingBanner(): void {
  chatContent.querySelectorAll('.ending-banner').forEach((n) => n.remove());
  if (!save?.ending) return;
  const div = document.createElement('div');
  div.className = 'ending-banner';
  div.innerHTML = `
    <strong>${escapeHtml(save.ending.title)}</strong>
    <span style="color:#c4c7c5; font-size:13.5px">${escapeHtml(save.ending.summary)}</span>
    <span style="color:#9aa0a6; font-size:12.5px">Cảnh giới: ${formatMinorRank(save.player.rank)} · Nguyên thạch: ${save.player.inventory.primevalStones} · Ngày ${save.ending.dayReached}/365</span>
  `;
  chatContent.appendChild(div);
  scrollToBottom();
}

function renderAllMessages(): void {
  chatContent.innerHTML = '';
  if (history.length === 0) {
    const welcome = document.createElement('div');
    welcome.className = 'empty-welcome';
    welcome.innerHTML = config.apiKey
      ? '<h2>Cổ Nguyệt Sơn Trại</h2><p>Gõ <strong>/khoi tao</strong> để bước vào Khai Khiếu Đại Điển và khởi tạo nhân vật của ngươi.</p>'
      : '<h2>Cổ Nguyệt Sơn Trại</h2><p>Bấm <strong>Cài đặt API & Save</strong> để dán Google AI Studio API Key, sau đó gõ <strong>/khoi tao</strong> để bắt đầu.</p>';
    chatContent.appendChild(welcome);
    return;
  }

  for (const msg of history) {
    appendMessageElement(msg.role === 'user' ? 'user' : 'ai', msg.text, msg.details);
  }
  renderEndingBanner();
}

newChatBtn.addEventListener('click', () => {
  if (isBusy) return;
  if ((history.length > 0 || save) && !window.confirm('Xóa tiến trình hiện tại và bắt đầu kiếp mới?')) {
    return;
  }
  history = [];
  save = null;
  initDraft = { stage: 'idle' };
  saveHistory(history);
  persistSave(null);
  saveInitDraft(initDraft);
  renderWorldUI();
  updateInputPlaceholder();
  renderAllMessages();
  if (window.innerWidth <= 820) setSidebarClosed(true);
});

function autoResizeInput(): void {
  inputEl.style.height = 'auto';
  inputEl.style.height = `${Math.min(inputEl.scrollHeight, 160)}px`;
}
inputEl.addEventListener('input', autoResizeInput);
inputEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    promptForm.requestSubmit();
  }
});

// === /khoi tao Flow ===
async function handleKhoiTaoFlow(userText: string): Promise<void> {
  if (!config.apiKey) {
    openApiModal();
    testResultEl.textContent = 'Bạn cần kết nối Google AI Studio API Key trước khi chạy /khoi tao.';
    testResultEl.className = 'api-status-msg err';
    return;
  }

  const localZeroUsage: TokenUsage = {
    promptTokens: 0,
    outputTokens: 0,
    thoughtTokens: 0,
    cachedTokens: 0,
    totalTokens: 0,
    apiCalls: 0,
  };

  if (isKhoiTaoCommand(userText)) {
    history = [];
    save = null;
    initDraft = { stage: 'awaiting_name' };
    saveHistory(history);
    persistSave(null);
    saveInitDraft(initDraft);
    renderWorldUI();
    chatContent.innerHTML = '';

    isBusy = true;
    submitBtn.disabled = true;
    pushUserMessage(userText);
    await revealAiMessage(SCRIPT_STEP_1, makeUsageOnlyDetails(config.model, localZeroUsage));
    isBusy = false;
    submitBtn.disabled = false;
    updateInputPlaceholder();
    inputEl.focus();
    return;
  }

  if (initDraft.stage === 'awaiting_name') {
    isBusy = true;
    submitBtn.disabled = true;
    inputEl.value = '';
    autoResizeInput();

    const welcome = chatContent.querySelector('.empty-welcome');
    if (welcome) welcome.remove();
    chatContent.querySelectorAll('.message.error').forEach((n) => n.remove());

    appendMessageElement('user', userText);
    const thinking = appendMessageElement('ai', '...');

    try {
      const check = await validateNameWithGemini(config.apiKey, config.model, userText);
      thinking.remove();

      const nameDetails = makeUsageOnlyDetails(config.model, check.usage ?? localZeroUsage);
      history.push({ role: 'user', text: userText });
      if (!check.valid) {
        await revealAiMessage(SCRIPT_NAME_INVALID, nameDetails);
      } else {
        initDraft = { stage: 'awaiting_steps', name: check.fullName };
        saveInitDraft(initDraft);
        await revealAiMessage(buildStep2Script(check.fullName), nameDetails);
        updateInputPlaceholder();
      }
    } catch (err) {
      thinking.remove();
      inputEl.value = userText;
      autoResizeInput();
      const errBubble = document.createElement('div');
      errBubble.className = 'message error';
      errBubble.innerHTML = `<span>Lỗi kiểm tra tên qua Gemini: ${escapeHtml(extractErrorMessage(err))}</span>`;
      chatContent.appendChild(errBubble);
      scrollToBottom();
    } finally {
      isBusy = false;
      submitBtn.disabled = false;
      inputEl.focus();
    }
    return;
  }

  if (initDraft.stage === 'awaiting_steps') {
    isBusy = true;
    submitBtn.disabled = true;
    inputEl.value = '';
    autoResizeInput();
    pushUserMessage(userText);

    const match = userText.trim().match(/^\d+$/);
    const steps = match ? Number(match[0]) : NaN;
    if (!Number.isInteger(steps) || steps < 20) {
      await revealAiMessage(SCRIPT_STEPS_INVALID, makeUsageOnlyDetails(config.model, localZeroUsage));
      isBusy = false;
      submitBtn.disabled = false;
      inputEl.focus();
      return;
    }
    if (steps >= 80) {
      await revealAiMessage(SCRIPT_STEPS_TOO_HIGH, makeUsageOnlyDetails(config.model, localZeroUsage));
      isBusy = false;
      submitBtn.disabled = false;
      inputEl.focus();
      return;
    }

    const grade = getAptitudeGrade(steps);
    const fullName = initDraft.name ?? 'Cổ Nguyệt Vô Danh';
    save = createInitialSaveState({
      name: fullName,
      aptitude: steps,
      aptitudeGrade: grade,
    });
    persistSave(save);

    initDraft = { stage: 'idle' };
    saveInitDraft(initDraft);
    renderWorldUI();
    updateInputPlaceholder();

    await revealAiMessage(
      buildStep3MorningScript(fullName, steps, grade, getMaxEssence(steps)),
      makeUsageOnlyDetails(config.model, localZeroUsage)
    );
    isBusy = false;
    submitBtn.disabled = false;
    inputEl.focus();
    return;
  }
}

// === Gameplay Turn with Real Gemini Function Calling + Smooth Typewriter ===
async function sendPrompt(userText: string): Promise<void> {
  if (isBusy) return;

  if (isKhoiTaoCommand(userText) || initDraft.stage !== 'idle') {
    inputEl.value = '';
    autoResizeInput();
    await handleKhoiTaoFlow(userText);
    return;
  }

  if (!config.apiKey) {
    openApiModal();
    testResultEl.textContent = 'Bạn cần dán Google AI Studio API Key trước khi gửi prompt.';
    testResultEl.className = 'api-status-msg err';
    return;
  }

  if (!save) {
    await handleKhoiTaoFlow('/khoi tao');
    return;
  }

  if (save.ending) return;

  const welcome = chatContent.querySelector('.empty-welcome');
  if (welcome) welcome.remove();
  chatContent.querySelectorAll('.message.error').forEach((n) => n.remove());

  isBusy = true;
  submitBtn.disabled = true;
  inputEl.value = '';
  autoResizeInput();

  const userEl = appendMessageElement('user', userText);
  const aiBubble = appendMessageElement('ai', '');
  const aiBody = aiBubble.querySelector('.ai-text') as HTMLElement;
  aiBody.textContent = '...';

  let bufferedReply = '';
  let displayedLen = 0;
  let streamDone = false;
  let skipTypewriter = false;

  const onSkip = () => {
    skipTypewriter = true;
  };
  aiBody.addEventListener('click', onSkip, { once: true });

  const drainPromise = (async () => {
    while (!streamDone || displayedLen < bufferedReply.length) {
      if (skipTypewriter) {
        displayedLen = bufferedReply.length;
        aiBody.innerHTML = formatStoryHtml(bufferedReply);
        scrollToBottom();
        break;
      }
      if (displayedLen < bufferedReply.length) {
        const backlog = bufferedReply.length - displayedLen;
        const step = backlog > 120 ? 5 : backlog > 40 ? 3 : 2;
        displayedLen = Math.min(bufferedReply.length, displayedLen + step);
        aiBody.innerHTML = formatStoryHtml(bufferedReply.slice(0, displayedLen));
        scrollToBottom();
      }
      await new Promise((r) => setTimeout(r, 14));
    }
  })();

  try {
    const result = await runGeminiGameTurn({
      apiKey: config.apiKey,
      model: config.model,
      db,
      save,
      history,
      userText,
      onStatus: (st) => {
        turnStatusEl.textContent = st;
      },
      onChunk: (piece) => {
        bufferedReply += piece;
      },
    });

    streamDone = true;
    await drainPromise;
    aiBody.removeEventListener('click', onSkip);
    aiBody.innerHTML = formatStoryHtml(result.fullText);
    attachHiddenDetails(aiBubble, result.details);

    // Commit transactional save ONLY after turn succeeds completely
    save = result.nextSave;
    persistSave(save);
    history.push({ role: 'user', text: userText });
    history.push({ role: 'model', text: result.fullText, details: result.details });
    saveHistory(history);

    renderWorldUI();
    updateInputPlaceholder();
    renderEndingBanner();
    scrollToBottom();
  } catch (err) {
    streamDone = true;
    aiBody.removeEventListener('click', onSkip);
    userEl.remove();
    aiBubble.remove();
    inputEl.value = userText;
    autoResizeInput();

    const errBubble = document.createElement('div');
    errBubble.className = 'message error';
    errBubble.innerHTML = `<span>${escapeHtml(extractErrorMessage(err))}</span>`;
    const retryBtn = document.createElement('button');
    retryBtn.type = 'button';
    retryBtn.className = 'retry-btn';
    retryBtn.textContent = 'Thử lại';
    retryBtn.addEventListener('click', () => {
      errBubble.remove();
      void sendPrompt(userText);
    });
    errBubble.appendChild(retryBtn);
    chatContent.appendChild(errBubble);
    scrollToBottom();
  } finally {
    turnStatusEl.textContent = '';
    isBusy = false;
    submitBtn.disabled = false;
    inputEl.focus();
  }
}

promptForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = inputEl.value.trim();
  if (!text) return;
  void sendPrompt(text);
});

// Initial render
updateApiStatusBadge();
populateModelSelect(config.model);
renderWorldUI();
updateInputPlaceholder();
renderAllMessages();
