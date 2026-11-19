/* Cổ Chân Nhân: Cổ Nguyệt Sơn Trại (Năm 1) — Client App */

const AppState = {
  runId: localStorage.getItem('ccn_active_run') || null,
  bundle: null,
  selectedZoneId: null,
  shopMode: 'items',
  busy: false,
  serverConfig: { has_env_key: false, default_model: 'gemini-2.5-flash' },
  settings: {
    apiKey: localStorage.getItem('ccn_api_key') || '',
    modelId: localStorage.getItem('ccn_model_id') || 'gemini-2.5-flash',
    forceOffline: localStorage.getItem('ccn_force_offline') === 'true',
  },
};

const $ = (id) => document.getElementById(id);

function showToast(msg, duration = 3200) {
  const el = $('toast');
  el.textContent = msg;
  el.classList.remove('hidden');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.add('hidden'), duration);
}

async function api(url, opts = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderMarkdownLite(text) {
  const lines = escapeHtml(text).split('\n');
  let html = '';
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    let formatted = line
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/_(.+?)_/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>');

    if (formatted.startsWith('### ')) {
      html += `<h3>${formatted.slice(4)}</h3>`;
    } else if (formatted.startsWith('&gt; ')) {
      html += `<blockquote>${formatted.slice(5)}</blockquote>`;
    } else {
      html += `<p>${formatted}</p>`;
    }
  }
  return html;
}

function updateGmBadge() {
  const el = $('gmModeBadge');
  const hasKey = Boolean(AppState.settings.apiKey || AppState.serverConfig.has_env_key);
  if (!AppState.settings.forceOffline && hasKey) {
    el.className = 'pill pill-gemini';
    el.textContent = `✨ Gemini (${AppState.settings.modelId || AppState.serverConfig.default_model})`;
  } else {
    el.className = 'pill pill-offline';
    el.textContent = '⚙️ Quản Trò Cục Bộ (Chưa nối API Key)';
  }
}

/* ---------- CREATOR & SAVED RUNS ---------- */
function updateAptitudePreview() {
  const val = Number($('inpAptitude').value);
  let grade = 'Đinh', diff = 'Địa Ngục (+0.65x điểm)', color = '#ef4444';
  if (val >= 80) { grade = 'Giáp'; diff = 'Thiên Tài ≤ Phương Chính (1.0x)'; color = '#f59e0b'; }
  else if (val >= 60) { grade = 'Ất'; diff = 'Cân Bằng (+0.15x điểm)'; color = '#2dd4bf'; }
  else if (val >= 40) { grade = 'Bính'; diff = 'Khắc Nghiệt — Chuẩn Nguyên Tác (+0.35x)'; color = '#60a5fa'; }
  const thanh = (val / 10).toFixed(1);
  const shots = Math.floor(val / 10);
  $('aptPreview').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <strong style="color:${color}">${grade} đẳng (${val}% — ${thanh} thành Thanh Đồng)</strong>
      <span class="tag">${diff}</span>
    </div>
    <div class="muted small" style="margin-top:4px;">
      Số phát Nguyệt Quang Cổ tối đa (Sơ giai): <strong>${val >= 40 ? shots + ' phát' : 'Không đủ gánh Nguyệt Quang Cổ'}</strong>
    </div>
  `;
}

async function loadSavedRuns() {
  try {
    const data = await api('/api/runs');
    const container = $('savedRunsList');
    if (!data.runs || !data.runs.length) {
      container.innerHTML = '<p class="muted small">Chưa có kiếp nào được tạo. Hãy bắt đầu ngày Khai Khiếu đầu tiên!</p>';
      return;
    }
    container.innerHTML = data.runs.map((r) => `
      <div class="run-card" data-run="${r.run_id}">
        <div style="display:flex;justify-content:space-between;">
          <strong>${escapeHtml(r.player_name)}</strong>
          <span class="tag">${r.status === 'dead' ? '💀 Vẫn Lạc' : (r.status === 'completed' ? '🏆 Hoàn Thành' : '🟢 Đang Chơi')}</span>
        </div>
        <div class="muted small" style="margin-top:3px;">${r.aptitude} • ${r.realm} • 💎 ${r.stones} NT</div>
        <div class="muted small">${r.clock_short}</div>
      </div>
    `).join('');

    container.querySelectorAll('.run-card').forEach((card) => {
      card.addEventListener('click', () => loadRun(card.dataset.run));
    });
  } catch (e) {
    console.error(e);
  }
}

async function startNewRun() {
  const name = $('inpCharName').value.trim() || 'Cổ Nguyệt Trần';
  const bg = document.querySelector('input[name="background"]:checked')?.value || 'orphan';
  const apt = Number($('inpAptitude').value);
  const goal = $('inpGoal').value.trim();

  setBusy(true);
  try {
    const bundle = await api('/api/runs/new', {
      method: 'POST',
      body: JSON.stringify({ name, background: bg, aptitude_percent: apt, goal }),
    });
    AppState.runId = bundle.state.run_id;
    localStorage.setItem('ccn_active_run', AppState.runId);
    AppState.bundle = bundle;
    AppState.selectedZoneId = bundle.state.location;
    $('creatorModal').classList.add('hidden');
    $('btnCloseCreator').classList.remove('hidden');
    $('gameWorkspace').classList.remove('hidden');
    renderAll();
    showToast(`Khai Khiếu thành công: ${bundle.state.player.name} (${bundle.state.player.aptitude_grade} đẳng ${apt}%)!`);
  } catch (e) {
    showToast('Lỗi tạo nhân vật: ' + e.message);
  } finally {
    setBusy(false);
  }
}

async function loadRun(runId) {
  setBusy(true);
  try {
    const bundle = await api(`/api/runs/${runId}`);
    AppState.runId = runId;
    localStorage.setItem('ccn_active_run', runId);
    AppState.bundle = bundle;
    AppState.selectedZoneId = bundle.state.location;
    $('creatorModal').classList.add('hidden');
    $('btnCloseCreator').classList.remove('hidden');
    $('gameWorkspace').classList.remove('hidden');
    renderAll();
  } catch (e) {
    showToast('Không thể tải lượt chơi: ' + e.message);
  } finally {
    setBusy(false);
  }
}

/* ---------- RENDERING ---------- */
function setBusy(flag) {
  AppState.busy = flag;
  $('btnSendPrompt').disabled = flag;
  $('btnSendPrompt').textContent = flag ? 'Đang xử lý...' : 'Hành Động ↵';
}

function renderAll() {
  const b = AppState.bundle;
  if (!b) return;
  renderHud(b);
  renderClockAndSchedule(b);
  renderStoryFeed(b);
  renderMap(b);
  renderNpcs(b);
  renderTimelineAndRumors(b);
  if (b.state.status !== 'active' && b.run_score) {
    showEndingModal(b);
  }
}

function renderHud(b) {
  const p = b.state.player;
  const c = b.combat;
  $('pName').textContent = p.name;
  $('pMeta').textContent = `${p.aptitude_grade} đẳng (${p.aptitude_percent}%) • ${p.background_label}`;
  $('pRealm').textContent = `${p.rank === 1 ? 'Nhất' : 'Nhị'} chuyển ${p.sub_realm}`;
  $('pEssenceColor').textContent = c.essence_color;

  const orb = $('essenceOrb');
  orb.textContent = `${p.rank}C`;
  orb.style.background = `radial-gradient(circle at 30% 30%, #ffffff99, ${c.essence_hex})`;
  orb.style.boxShadow = `0 0 18px ${c.essence_hex}77`;

  const essPct = Math.min(100, (p.essence_thanh / Math.max(0.1, p.max_thanh)) * 100);
  $('txtEssence').textContent = `${p.essence_thanh.toFixed(1)} / ${p.max_thanh.toFixed(1)} thành`;
  $('barEssence').style.width = `${essPct}%`;
  $('barEssence').style.background = c.essence_hex;

  const wallPct = Math.min(100, (p.wall_progress / Math.max(1, b.wall_required)) * 100);
  $('txtWall').textContent = `${p.wall_progress.toFixed(0)} / ${b.wall_required} (${wallPct.toFixed(0)}%)`;
  $('barWall').style.width = `${wallPct}%`;

  $('txtHp').textContent = `${p.hp} / ${p.max_hp}`;
  $('barHp').style.width = `${(p.hp / p.max_hp) * 100}%`;

  $('txtStamina').textContent = `${p.stamina} / ${p.max_stamina}`;
  $('barStamina').style.width = `${(p.stamina / p.max_stamina) * 100}%`;

  $('pStones').textContent = `${p.stones} NT`;
  $('pCombat').textContent = c.total;
  $('pBoar').textContent = `${p.boar_strength} Trư`;
  $('pRep').textContent = p.reputation >= 0 ? `+${p.reputation}` : `${p.reputation}`;
  $('pLuck').textContent = p.luck >= 0 ? `+${p.luck}` : `${p.luck}`;
  $('pPriceMult').textContent = `${(b.state.price_multiplier || 1).toFixed(2)}x`;

  // Owned Gu
  $('guCountBadge').textContent = p.gu_list.length;
  const guEl = $('ownedGuList');
  if (!p.gu_list.length) {
    guEl.innerHTML = '<div class="muted small">Chưa có Cổ trùng. Chờ Ngày 3 nhập Học Đường nhận Bản Mệnh Cổ!</div>';
  } else {
    guEl.innerHTML = p.gu_list.map((g, idx) => {
      const noFeed = g.feed_interval_days >= 900;
      const hungerTag = noFeed
        ? 'Tiêu hao 1 lần'
        : (g.days_until_hungry <= 0 ? '🩸 ĐANG ĐÓI!' : `Còn ${g.days_until_hungry} ngày`);
      return `
        <div class="gu-item ${g.days_until_hungry <= 1 && !noFeed ? 'starving' : ''}">
          <div class="gu-top">
            <span class="gu-name">${escapeHtml(g.name)}</span>
            ${noFeed ? '' : `<button class="btn btn-xs btn-jade-outline" onclick="doFeedGu(${idx})">Cho Ăn</button>`}
          </div>
          <div class="gu-food">${hungerTag} • Thức ăn: ${escapeHtml(g.food_name)}</div>
        </div>
      `;
    }).join('');
  }

  // Inventory strip
  const invNames = {
    nguyet_lan_thao: 'Nguyệt Lan Thảo',
    bui_huynh_quang: 'Bụi Huỳnh Quang',
    ruou_xanh: 'Rượu Xanh',
    thit_heo_rung: 'Thịt Heo Rừng',
    mat_dong_thao_duoc: 'Thức Ăn Tổng Hợp',
    luong_kho: 'Lương Khô',
  };
  const invEntries = Object.entries(p.inventory || {}).filter(([, qty]) => qty > 0);
  $('inventoryStrip').innerHTML = invEntries.length
    ? invEntries.map(([k, q]) => `<span class="inv-chip">${invNames[k] || k}: <strong>×${q}</strong></span>`).join('')
    : '<span class="muted small">Túi vật phẩm trống</span>';

  // Gamble button in Summer
  const isSummerMarket = b.clock.season === 'Hạ' && b.state.day >= 135;
  $('btnGambleStone').classList.toggle('hidden', !isSummerMarket);

  // Shop List
  const shopEl = $('shopList');
  if (AppState.shopMode === 'items') {
    shopEl.innerHTML = b.shop_items.map((it) => `
      <div class="shop-row">
        <div>
          <div class="shop-row-name">${escapeHtml(it.name)}</div>
          <div class="shop-row-desc">${escapeHtml(it.description)}</div>
        </div>
        <button class="btn btn-xs btn-ghost" onclick="doBuyItem('${it.id}')">💎 ${it.price}</button>
      </div>
    `).join('');
  } else {
    shopEl.innerHTML = b.market_gu.map((g) => `
      <div class="shop-row">
        <div>
          <div class="shop-row-name">${escapeHtml(g.name)} ${g.season_only ? '<span class="tag">Thương Đội</span>' : ''}</div>
          <div class="shop-row-desc">${escapeHtml(g.effect)}</div>
        </div>
        <button class="btn btn-xs btn-gold" onclick="doBuyGu('${g.id}')">💎 ${g.price}</button>
      </div>
    `).join('');
  }
}

function renderClockAndSchedule(b) {
  $('clockDisplay').textContent = b.clock.display;
  const curZone = b.map_zones.find((z) => z.is_current);
  $('currentZoneName').textContent = curZone ? curZone.name : b.state.location;

  const remEl = $('scheduleReminder');
  remEl.className = `schedule-reminder severity-${b.reminder.severity}`;
  remEl.textContent = b.reminder.message;

  $('currentGoalText').textContent = b.state.goal;

  const listEl = $('dailyScheduleList');
  listEl.innerHTML = b.state.schedule.map((blk) => {
    const sh = String(Math.floor(blk.start_minute / 60)).padStart(2, '0');
    const sm = String(blk.start_minute % 60).padStart(2, '0');
    const eh = String(Math.floor(blk.end_minute / 60)).padStart(2, '0');
    const em = String(blk.end_minute % 60).padStart(2, '0');
    return `
      <div class="sched-item ${blk.done ? 'done' : ''} ${blk.mandatory ? 'mandatory' : ''}">
        <span>${blk.mandatory ? '⭐ ' : ''}${escapeHtml(blk.title)}</span>
        <span class="muted">${sh}:${sm}-${eh}:${em}</span>
      </div>
    `;
  }).join('');
}

function renderStoryFeed(b) {
  const feed = $('storyFeed');
  feed.innerHTML = b.history.map((m) => {
    const cls = m.role === 'player'
      ? 'msg msg-player'
      : (m.role === 'system' ? 'msg msg-system' : (m.kind === 'timeline' ? 'msg msg-timeline' : 'msg msg-gm'));
    const author = m.role === 'player'
      ? `👤 ${escapeHtml(b.state.player.name)}`
      : (m.role === 'system' ? '⚙️ Hệ Thống (Code Thuần)' : `📜 Quản Trò ${m.mode ? `• ${escapeHtml(m.mode)}` : ''}`);

    let diceHtml = '';
    if (m.dice) {
      const sign = m.dice.delta >= 0 ? '+' : '';
      diceHtml = `
        <div class="dice-card ${m.dice.tier_code}">
          <div>
            <strong>🎲 Xúc Xắc d100 — ${escapeHtml(m.dice.tier)}</strong>
            <div class="muted small">Target: ${m.dice.target} • ${escapeHtml(m.plan?.reasoning || '')}</div>
          </div>
          <div class="dice-num">${m.dice.player_roll} <span class="small">(${sign}${m.dice.delta})</span></div>
        </div>
      `;
    }

    let notesHtml = '';
    const effects = m.effect_notes || [];
    const impacts = m.impact_notes || [];
    if (effects.length || impacts.length || m.api_warning) {
      notesHtml = `<div class="notes-strip">
        ${effects.map((e) => `<div class="effect-note">▸ ${escapeHtml(e)}</div>`).join('')}
        ${impacts.map((i) => `<div class="impact-note">${renderMarkdownLite(i)}</div>`).join('')}
        ${m.api_warning ? `<div class="warn-note">⚠️ ${escapeHtml(m.api_warning)}</div>` : ''}
      </div>`;
    }

    return `
      <article class="${cls}">
        <div class="msg-meta">
          <span class="msg-author">${author}</span>
          <span>${escapeHtml(m.clock || '')}</span>
        </div>
        ${diceHtml}
        <div class="msg-body">${renderMarkdownLite(m.text)}</div>
        ${notesHtml}
      </article>
    `;
  }).join('');

  feed.scrollTop = feed.scrollHeight;

  // Render latest suggested actions
  const lastGm = [...b.history].reverse().find((m) => m.role === 'gm' && m.suggested_actions && m.suggested_actions.length);
  const sugEl = $('suggestedRow');
  if (lastGm && b.state.status === 'active') {
    sugEl.innerHTML = lastGm.suggested_actions.map((s) =>
      `<button type="button" class="suggest-chip">${escapeHtml(s)}</button>`
    ).join('');
    sugEl.querySelectorAll('.suggest-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        $('promptInput').value = btn.textContent;
        $('promptInput').focus();
      });
    });
  } else {
    sugEl.innerHTML = '';
  }
}

function renderMap(b) {
  const svg = $('mapSvg');
  const zones = b.map_zones;
  const byId = Object.fromEntries(zones.map((z) => [z.id, z]));

  // Draw unique edges
  const drawn = new Set();
  let edgesHtml = '';
  for (const z of zones) {
    for (const [nbId, mins] of Object.entries(z.neighbors || {})) {
      if (!byId[nbId]) continue;
      const key = [z.id, nbId].sort().join('--');
      if (drawn.has(key)) continue;
      drawn.add(key);
      const a = z.svg, t = byId[nbId].svg;
      const mx = (a.x + t.x) / 2, my = (a.y + t.y) / 2;
      edgesHtml += `<line x1="${a.x}" y1="${a.y}" x2="${t.x}" y2="${t.y}" class="map-edge" />`;
      edgesHtml += `<text x="${mx}" y="${my - 3}" fill="#64748b" font-size="9.5" text-anchor="middle">${mins}p</text>`;
    }
  }

  // Draw nodes
  let nodesHtml = '';
  for (const z of zones) {
    const cls = `map-node ${z.is_current ? 'current' : ''} ${z.hidden ? 'secret' : ''}`;
    nodesHtml += `
      <g class="${cls}" data-zone="${z.id}" transform="translate(${z.svg.x}, ${z.svg.y})">
        <circle r="${z.is_current ? 12 : 9}" />
        <text y="23" class="map-label">${escapeHtml(z.short_name)}</text>
      </g>
    `;
  }

  svg.innerHTML = `
    <text x="14" y="22" fill="#475569" font-size="10">TÂY (Hậu Sơn)</text>
    <text x="455" y="22" fill="#475569" font-size="10">ĐÔNG (Ngoại Trại)</text>
    ${edgesHtml}
    ${nodesHtml}
  `;

  svg.querySelectorAll('.map-node').forEach((g) => {
    g.addEventListener('click', () => {
      AppState.selectedZoneId = g.dataset.zone;
      renderZoneDetail(b);
    });
  });

  if (!AppState.selectedZoneId || !byId[AppState.selectedZoneId]) {
    AppState.selectedZoneId = b.state.location;
  }
  renderZoneDetail(b);
}

function renderZoneDetail(b) {
  const z = b.map_zones.find((item) => item.id === AppState.selectedZoneId) || b.map_zones[0];
  if (!z) return;
  const pathNames = (z.path || []).map((id) => {
    const f = b.map_zones.find((x) => x.id === id);
    return f ? f.short_name : id;
  }).join(' → ');

  $('zoneDetailCard').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
      <strong style="color:var(--gold-bright)">📍 ${escapeHtml(z.name)}</strong>
      <span class="tag">${escapeHtml(z.region)}</span>
    </div>
    <p class="muted small" style="margin:6px 0;">${escapeHtml(z.description)}</p>
    <div class="small" style="margin-bottom:8px;">
      ⚠️ Nguy hiểm: <strong>${z.ambient_danger}%</strong> • 🧘 Tu luyện: <strong>${z.cultivation_bonus}x</strong>
      ${!z.is_current && z.travel_minutes > 0 ? `<br/>🛣️ Lộ trình: <em>${escapeHtml(pathNames)}</em> (<strong>${z.travel_minutes} phút</strong>)` : ''}
    </div>
    ${z.is_current
      ? '<span class="tag" style="color:var(--jade)">Đang đứng tại đây</span>'
      : `<button class="btn btn-jade btn-block" onclick="doMoveTo('${z.id}')">👣 Di Chuyển Tới ${escapeHtml(z.short_name)} (${z.travel_minutes} phút)</button>`}
  `;
}

function renderNpcs(b) {
  const q = ($('npcSearch').value || '').toLowerCase().trim();
  const presentIds = new Set(b.state.active_scene?.in_scene ? (b.state.active_scene.present_npcs || []) : []);
  const list = b.npcs.filter((n) => !q || n.name.toLowerCase().includes(q) || n.faction.toLowerCase().includes(q));

  $('npcList').innerHTML = list.map((n) => {
    const affCls = n.affinity > 5 ? 'aff-pos' : (n.affinity < -5 ? 'aff-neg' : 'aff-neu');
    const isPresent = presentIds.has(n.id);
    return `
      <div class="npc-card ${isPresent ? 'present' : ''}">
        <div class="npc-head">
          <span class="npc-name">${isPresent ? '🟢 ' : ''}${escapeHtml(n.name)}</span>
          <span class="aff-pill ${affCls}">Thiện cảm: ${n.affinity >= 0 ? '+' : ''}${n.affinity}</span>
        </div>
        <div class="muted small">${escapeHtml(n.title)} • ${escapeHtml(n.faction)} • ${escapeHtml(n.rank)}</div>
        <div class="small" style="margin-top:4px;">👁️ Ấn tượng: <em>${escapeHtml(n.impression)}</em></div>
        <div class="muted small">🎯 Mục tiêu: ${escapeHtml(n.current_goal)}</div>
        ${n.memories && n.memories.length ? `
          <div class="npc-mem">
            ${n.memories.slice(-3).map((mem) => `<div>• ${escapeHtml(mem)}</div>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function renderTimelineAndRumors(b) {
  $('rumorList').innerHTML = b.rumors.length
    ? b.rumors.map((r) => `<div class="rumor-item"><strong>[Ngày ${r.day}]</strong> ${escapeHtml(r.text)}</div>`).join('')
    : '<p class="muted small">Sơn trại tạm thời yên ắng.</p>';

  $('timelineList').innerHTML = b.timeline.map((ev) => `
    <div class="tl-item ${ev.status}">
      <div style="display:flex;justify-content:space-between;">
        <strong>Ngày ${ev.day} (Mùa ${ev.season}) — ${escapeHtml(ev.title)}</strong>
        <span class="tag">${ev.status === 'done' ? '✓ Xong' : (ev.status === 'active' ? '🔥 Đang diễn ra' : 'Chưa tới')}</span>
      </div>
      <div class="muted small" style="margin-top:3px;">${escapeHtml(ev.gameplay_effect)}</div>
    </div>
  `).join('');
}

async function loadGuEncyclopedia(query = '') {
  try {
    const data = await api(`/api/gu?q=${encodeURIComponent(query)}`);
    $('guEncyclopediaList').innerHTML = data.items.slice(0, 45).map((g) => `
      <div class="ency-card">
        <h5>${escapeHtml(g.ten_goi.split('`[')[0])}</h5>
        <div class="muted small">${escapeHtml(g.pham_cap)} • ${escapeHtml(g.do_quy_hiem)} • ${escapeHtml(g.gia_thi_truong || '')}</div>
        <div class="small" style="margin-top:4px;">${escapeHtml((g.cong_nang_cu_the || '').slice(0, 210))}</div>
        <div class="muted small" style="margin-top:4px;">🍖 Thức ăn: ${escapeHtml((g.loai_thuc_an || '').slice(0, 120))}</div>
      </div>
    `).join('');
  } catch (e) {
    console.error(e);
  }
}

function showEndingModal(b) {
  const sc = b.run_score;
  $('endingTitle').textContent = sc.status === 'dead'
    ? '💀 THIÊN ĐẠO VÔ TÌNH — SINH MỆNH CHẤM DỨT'
    : '🏆 TỔNG KẾT NĂM THỨ NHẤT — CỔ NGUYỆT SƠN TRẠI';

  const breakdownRows = Object.entries(sc.breakdown || {}).map(([k, v]) =>
    `<div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px dashed #253447;"><span>${k}</span><strong>+${v}</strong></div>`
  ).join('');

  $('endingBody').innerHTML = `
    <div style="text-align:center;margin-bottom:14px;">
      <div style="font-size:28px;font-weight:700;color:var(--gold-bright);">${sc.final_score} ĐIỂM</div>
      <div style="color:var(--jade);font-weight:600;margin-top:4px;">${escapeHtml(sc.grade)}</div>
      <div class="muted small">Hệ số độ khó (Gia cảnh + Tư chất): ×${sc.difficulty_multiplier}</div>
    </div>
    ${sc.death_reason ? `<p style="color:#fca5a5;margin-bottom:10px;"><strong>Nguyên nhân tử vong:</strong> ${escapeHtml(sc.death_reason)}</p>` : ''}
    ${sc.exam_final_rank ? `<p style="margin-bottom:6px;"><strong>Hạng Niên Mạt Khảo Hạch:</strong> ${escapeHtml(sc.exam_final_rank)}</p>` : ''}
    ${sc.assigned_squad ? `<p style="margin-bottom:10px;"><strong>Phân bổ Tiểu Tổ:</strong> ${escapeHtml(sc.assigned_squad)}</p>` : ''}
    <div style="margin-top:8px;">${breakdownRows}</div>
  `;
  $('endingModal').classList.remove('hidden');
}

/* ---------- ACTIONS ---------- */
window.doMoveTo = async function (zoneId) {
  if (AppState.busy || !AppState.runId) return;
  setBusy(true);
  try {
    const res = await api(`/api/runs/${AppState.runId}/move`, {
      method: 'POST',
      body: JSON.stringify({ target_zone_id: zoneId }),
    });
    if (res.error) showToast(res.error);
    if (res.bundle) {
      AppState.bundle = res.bundle;
      AppState.selectedZoneId = res.bundle.state.location;
      renderAll();
    }
  } catch (e) {
    showToast(e.message);
  } finally {
    setBusy(false);
  }
};

async function runSchedule(mode) {
  if (AppState.busy || !AppState.runId) return;
  setBusy(true);
  try {
    const res = await api(`/api/runs/${AppState.runId}/schedule`, {
      method: 'POST',
      body: JSON.stringify({ mode }),
    });
    if (res.interrupted_reason) showToast(`🛑 Dừng lịch: ${res.interrupted_reason}`);
    if (res.bundle) {
      AppState.bundle = res.bundle;
      AppState.selectedZoneId = res.bundle.state.location;
      renderAll();
    }
  } catch (e) {
    showToast(e.message);
  } finally {
    setBusy(false);
  }
}

async function doQuickAction(action, extra = {}) {
  if (AppState.busy || !AppState.runId) return;
  setBusy(true);
  try {
    const res = await api(`/api/runs/${AppState.runId}/action`, {
      method: 'POST',
      body: JSON.stringify({ action, ...extra }),
    });
    if (res.error) showToast(res.error);
    if (res.bundle) {
      AppState.bundle = res.bundle;
      renderAll();
    }
  } catch (e) {
    showToast(e.message);
  } finally {
    setBusy(false);
  }
}

window.doFeedGu = (idx) => doQuickAction('feed_gu', { gu_index: idx });
window.doBuyItem = (itemId) => doQuickAction('buy_item', { item_id: itemId });
window.doBuyGu = (guId) => doQuickAction('buy_gu', { gu_id: guId });

async function submitPrompt(e) {
  e.preventDefault();
  if (AppState.busy || !AppState.runId) return;
  const text = $('promptInput').value.trim();
  if (!text) return;
  $('promptInput').value = '';
  setBusy(true);
  try {
    const res = await api(`/api/runs/${AppState.runId}/turn`, {
      method: 'POST',
      body: JSON.stringify({
        prompt: text,
        api_key: AppState.settings.apiKey,
        model_id: AppState.settings.modelId,
        force_offline: AppState.settings.forceOffline,
      }),
    });
    if (res.api_warning) showToast(res.api_warning, 5000);
    if (res.bundle) {
      AppState.bundle = res.bundle;
      renderAll();
    }
  } catch (e) {
    showToast('Lỗi xử lý lượt chơi: ' + e.message);
  } finally {
    setBusy(false);
  }
}

/* ---------- INIT & EVENTS ---------- */
async function init() {
  updateAptitudePreview();
  $('inpApiKey').value = AppState.settings.apiKey;
  $('inpModelId').value = AppState.settings.modelId;
  $('chkForceOffline').checked = AppState.settings.forceOffline;

  try {
    AppState.serverConfig = await api('/api/config');
    if (!localStorage.getItem('ccn_model_id') && AppState.serverConfig.default_model) {
      AppState.settings.modelId = AppState.serverConfig.default_model;
      $('inpModelId').value = AppState.settings.modelId;
    }
  } catch (e) {
    console.error(e);
  }
  updateGmBadge();
  loadGuEncyclopedia('');
  await loadSavedRuns();

  if (AppState.runId) {
    try {
      await loadRun(AppState.runId);
    } catch {
      localStorage.removeItem('ccn_active_run');
      $('creatorModal').classList.remove('hidden');
    }
  }

  // Bind events
  $('inpAptitude').addEventListener('input', updateAptitudePreview);
  $('btnRandomApt').addEventListener('click', () => {
    $('inpAptitude').value = Math.floor(Math.random() * 72) + 23;
    updateAptitudePreview();
  });
  $('btnStartNewRun').addEventListener('click', startNewRun);

  $('btnOpenCreator').addEventListener('click', () => {
    loadSavedRuns();
    $('creatorModal').classList.remove('hidden');
  });
  $('btnCloseCreator').addEventListener('click', () => $('creatorModal').classList.add('hidden'));

  $('btnOpenSettings').addEventListener('click', () => $('settingsModal').classList.remove('hidden'));
  $('btnCloseSettings').addEventListener('click', () => $('settingsModal').classList.add('hidden'));

  $('btnSaveSettings').addEventListener('click', () => {
    AppState.settings.apiKey = $('inpApiKey').value.trim();
    AppState.settings.modelId = $('inpModelId').value.trim() || 'gemini-2.5-flash';
    AppState.settings.forceOffline = $('chkForceOffline').checked;
    localStorage.setItem('ccn_api_key', AppState.settings.apiKey);
    localStorage.setItem('ccn_model_id', AppState.settings.modelId);
    localStorage.setItem('ccn_force_offline', String(AppState.settings.forceOffline));
    updateGmBadge();
    $('settingsModal').classList.add('hidden');
    showToast('Đã lưu cấu hình Quản Trò!');
  });

  $('btnTestApi').addEventListener('click', async () => {
    const out = $('apiTestResult');
    out.className = 'api-test-result';
    out.textContent = 'Đang kết nối tới Google AI Studio...';
    out.classList.remove('hidden');
    try {
      const res = await api('/api/test_gemini', {
        method: 'POST',
        body: JSON.stringify({
          api_key: $('inpApiKey').value.trim(),
          model_id: $('inpModelId').value.trim() || 'gemini-2.5-flash',
        }),
      });
      if (res.ok) {
        out.className = 'api-test-result api-ok';
        out.textContent = `✅ Kết nối thành công (${res.model}): ${res.reply?.greeting || 'OK'}`;
      } else {
        out.className = 'api-test-result api-err';
        out.textContent = `❌ Lỗi: ${res.error}`;
      }
    } catch (e) {
      out.className = 'api-test-result api-err';
      out.textContent = `❌ Lỗi: ${e.message}`;
    }
  });

  $('btnCloseEnding').addEventListener('click', () => $('endingModal').classList.add('hidden'));
  $('btnEndingNewRun').addEventListener('click', () => {
    $('endingModal').classList.add('hidden');
    loadSavedRuns();
    $('creatorModal').classList.remove('hidden');
  });

  document.querySelectorAll('[data-schedule]').forEach((btn) => {
    btn.addEventListener('click', () => runSchedule(btn.dataset.schedule));
  });

  $('btnCultivate').addEventListener('click', () => doQuickAction('cultivate', { minutes: 120, use_stones: true }));
  $('btnHeal').addEventListener('click', () => doQuickAction('heal'));
  $('btnRest').addEventListener('click', () => doQuickAction('rest', { hours: 2 }));
  $('btnGambleStone').addEventListener('click', () => doQuickAction('gamble_stone'));

  $('btnChangeGoal').addEventListener('click', () => {
    const cur = AppState.bundle?.state?.goal || '';
    const nextGoal = window.prompt('Nhập mục tiêu mới của ngươi (vd: Kiếm nguyên thạch / Săn heo rừng Rừng Trúc / Giao tiếp Đông Môn / Tu luyện):', cur);
    if (nextGoal && nextGoal.trim()) {
      doQuickAction('set_goal', { goal: nextGoal.trim() });
    }
  });

  $('promptForm').addEventListener('submit', submitPrompt);
  $('promptInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitPrompt(e);
    }
  });

  // Right tabs
  document.querySelectorAll('.rtab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.rtab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      $(`tab-${tab.dataset.tab}`).classList.add('active');
    });
  });

  // Shop tabs
  document.querySelectorAll('.mini-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.mini-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      AppState.shopMode = tab.dataset.shop;
      if (AppState.bundle) renderHud(AppState.bundle);
    });
  });

  $('npcSearch').addEventListener('input', () => {
    if (AppState.bundle) renderNpcs(AppState.bundle);
  });

  let guTimer = null;
  $('guSearch').addEventListener('input', (e) => {
    clearTimeout(guTimer);
    guTimer = setTimeout(() => loadGuEncyclopedia(e.target.value), 180);
  });
}

document.addEventListener('DOMContentLoaded', init);
