import type { LocationDefinition, SaveState, StaticDatabase } from './types';
import { findShortestPath, resolveLocation } from './db';

const Z_LEVELS: { z: number; label: string }[] = [
  { z: -1, label: 'Z=-1 · Động Hoa Tửu' },
  { z: 0, label: 'Z=0 · Chân Núi & Nguyên Tuyền' },
  { z: 1, label: 'Z=1 · Cổ Nguyệt Sơn Trại' },
  { z: 2, label: 'Z=2 · Vách Đá & Tiền Sơn' },
  { z: 3, label: 'Z=3 · Đỉnh Núi' },
];

const SHORT_LABELS: Record<string, string> = {
  'Ký Túc Xá Học Đường': 'Ký Túc Xá',
  'Học Đường & Diễn Võ Trường': 'Học Đường',
  'Cổ Thất Học Đường': 'Cổ Thất',
  'Gia Tộc Từ Đường': 'Từ Đường',
  'Hình Đường Gia Tộc': 'Hình Đường',
  'Dược Đường & Vườn Nguyệt Lan': 'Dược Đường',
  'Quảng Trường Sơn Trại': 'Quảng Trường',
  'Khu Phố, Khách Sạn Cổ Nguyệt & 3 Tửu Quán': 'Khách Sạn & Tửu Quán',
  'Đông Môn & Đông Môn Tửu Quán': 'Đông Môn',
  'Rừng Thanh Mâu Trúc & Sơn Khê Hậu Sơn': 'Rừng Mâu Trúc',
  'Bãi Sông Đá Cuội & Rèm Thác Mini': 'Bãi Sông & Thác Mini',
  'Vùng Ven Bạch Gia Sơn Trại & Thâm Đàm': 'Bạch Gia Trại',
  'Địa Hạ Nguyên Tuyền (Cấm Địa)': 'Nguyên Tuyền',
  'Sơn Đạo Chính & Ruộng Bậc Thang': 'Sơn Đạo & Thê Điền',
  'Thôn Trang Phàm Nhân Ven Sông': 'Thôn Phàm Nhân',
  'Sườn Rừng Săn Lợn Rừng': 'Rừng Săn Sơn Trư',
  'Động Hoa Tửu — Tầng 1 (Khe Cự Thạch)': 'Động Hoa Tửu T1',
  'Động Hoa Tửu — Tầng 2 (Ảnh Bích & Cửa Đá)': 'Động Hoa Tửu T2',
  'Tiền Sơn — Vùng Ven Hùng Gia Sơn Trại': 'Hùng Gia Trại',
  'Vách Đá Đại Thác Nước Hậu Sơn': 'Đại Thác Nước',
  'Đỉnh Thanh Mao Sơn': 'Đỉnh Thanh Mao',
};

function shortLabel(name: string): string {
  return SHORT_LABELS[name] ?? (name.length > 20 ? `${name.slice(0, 18)}…` : name);
}

function projectNodes(locs: LocationDefinition[]): Map<string, { sx: number; sy: number }> {
  const width = 720;
  const height = 380;
  const padX = 76;
  const padY = 48;
  const map = new Map<string, { sx: number; sy: number }>();
  if (locs.length === 0) return map;

  const sortedX = [...locs].sort((a, b) => a.coordinates.x - b.coordinates.x);
  const sortedY = [...locs].sort((a, b) => a.coordinates.y - b.coordinates.y);
  const xs = locs.map((l) => l.coordinates.x);
  const ys = locs.map((l) => l.coordinates.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;

  const pts = locs.map((loc) => {
    const linX = locs.length === 1 ? 0.5 : (loc.coordinates.x - minX) / spanX;
    const linY = locs.length === 1 ? 0.5 : (loc.coordinates.y - minY) / spanY;
    const rankX =
      locs.length === 1 ? 0.5 : sortedX.findIndex((s) => s.locationId === loc.locationId) / (locs.length - 1);
    const rankY =
      locs.length === 1 ? 0.5 : sortedY.findIndex((s) => s.locationId === loc.locationId) / (locs.length - 1);
    const nx = linX * 0.45 + rankX * 0.55;
    const ny = 1 - (linY * 0.45 + rankY * 0.55);
    return {
      id: loc.locationId,
      sx: padX + nx * (width - padX * 2),
      sy: padY + ny * (height - padY * 2),
    };
  });

  // Gentle collision relaxation so labels never overlap
  const minDx = 96;
  const minDy = 56;
  for (let iter = 0; iter < 40; iter++) {
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[j].sx - pts[i].sx;
        const dy = pts[j].sy - pts[i].sy;
        const ox = minDx - Math.abs(dx);
        const oy = minDy - Math.abs(dy);
        if (ox > 0 && oy > 0) {
          if (ox < oy) {
            const push = (ox / 2 + 1) * (dx >= 0 ? 1 : -1);
            pts[i].sx -= push;
            pts[j].sx += push;
          } else {
            const push = (oy / 2 + 1) * (dy >= 0 ? 1 : -1);
            pts[i].sy -= push;
            pts[j].sy += push;
          }
        }
      }
    }
    for (const p of pts) {
      p.sx = Math.max(padX, Math.min(width - padX, p.sx));
      p.sy = Math.max(padY, Math.min(height - padY, p.sy));
    }
  }

  for (const p of pts) map.set(p.id, { sx: p.sx, sy: p.sy });
  return map;
}

export function createMapModalController(params: {
  modalEl: HTMLElement;
  tabsEl: HTMLElement;
  svgEl: SVGSVGElement;
  inspectorEl: HTMLElement;
  db: StaticDatabase;
  getSave: () => SaveState | null;
  onQuickTravel: (cmd: string) => void;
}) {
  const { modalEl, tabsEl, svgEl, inspectorEl, db, getSave, onQuickTravel } = params;
  let selectedZ = 1;
  let inspectedId = 'loc_ky_tuc_xa';

  function render(): void {
    const save = getSave();
    const playerLocId = save?.player.locationId ?? 'loc_ky_tuc_xa';
    const playerLoc = db.locationMap.get(playerLocId);

    // Render Z tabs
    tabsEl.innerHTML = '';
    for (const layer of Z_LEVELS) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `z-tab ${selectedZ === layer.z ? 'active' : ''}`;
      btn.textContent = `${layer.label}${playerLoc?.coordinates.z === layer.z ? ' ●' : ''}`;
      btn.addEventListener('click', () => {
        selectedZ = layer.z;
        const first = db.locations.find((l) => l.coordinates.z === layer.z);
        if (first) inspectedId = first.locationId;
        render();
      });
      tabsEl.appendChild(btn);
    }

    // Render SVG
    const locs = db.locations.filter((l) => l.coordinates.z === selectedZ);
    const pts = projectNodes(locs);
    const seen = new Set<string>();
    const svgParts: string[] = [
      '<text x="18" y="24" fill="#5d6368" font-size="11">Bắc (+Y) ↑ · Đông (+X) →</text>',
    ];

    for (const loc of locs) {
      for (const conn of loc.connectedLocations) {
        const target = db.locationMap.get(conn.targetLocationId);
        if (!target || target.coordinates.z !== selectedZ) continue;
        const key = [loc.locationId, target.locationId].sort().join('--');
        if (seen.has(key)) continue;
        seen.add(key);
        const p1 = pts.get(loc.locationId);
        const p2 = pts.get(target.locationId);
        if (!p1 || !p2) continue;
        const mx = (p1.sx + p2.sx) / 2;
        const my = (p1.sy + p2.sy) / 2;
        svgParts.push(
          `<line x1="${p1.sx}" y1="${p1.sy}" x2="${p2.sx}" y2="${p2.sy}" stroke="#35393e" stroke-width="2" />`,
          `<text x="${mx}" y="${my - 5}" text-anchor="middle" fill="#7c8288" font-size="10">${conn.travelMinutes}p</text>`
        );
      }
    }

    for (const loc of locs) {
      const pt = pts.get(loc.locationId);
      if (!pt) continue;
      const isPlayer = loc.locationId === playerLocId;
      const isSel = loc.locationId === inspectedId;
      const hasCrossZ = loc.connectedLocations.some(
        (c) => db.locationMap.get(c.targetLocationId)?.coordinates.z !== selectedZ
      );
      const fill = isPlayer ? '#4e9a84' : loc.dangerLevel >= 40 ? '#8a4646' : '#2a2e33';
      const stroke = isSel ? '#e3e3e3' : '#555b62';

      svgParts.push(
        `<g class="map-node" data-loc="${loc.locationId}" transform="translate(${pt.sx}, ${pt.sy})" style="cursor:pointer">`,
        isPlayer
          ? '<circle r="17" fill="none" stroke="#4e9a84" stroke-opacity="0.45" stroke-width="2" />'
          : '',
        `<circle r="11" fill="${fill}" stroke="${stroke}" stroke-width="${isSel ? 2.4 : 1.4}" />`,
        hasCrossZ
          ? '<text y="3.5" text-anchor="middle" fill="#e3e3e3" font-size="10" font-weight="700">↕</text>'
          : '',
        `<text y="24" text-anchor="middle" fill="${isPlayer ? '#8be0c5' : '#d8d8d8'}" font-size="11" font-weight="${isPlayer || isSel ? 600 : 400}">${shortLabel(loc.name)}</text>`,
        '</g>'
      );
    }

    svgEl.innerHTML = svgParts.join('');
    svgEl.querySelectorAll<SVGGElement>('.map-node').forEach((g) => {
      g.addEventListener('click', () => {
        const lid = g.dataset.loc;
        if (lid) {
          inspectedId = lid;
          render();
        }
      });
    });

    // Render Inspector
    const inspected = save
      ? resolveLocation(db, save, inspectedId)
      : db.locationMap.get(inspectedId) ?? null;

    if (!inspected) {
      inspectorEl.innerHTML = '';
      return;
    }

    const route =
      save && playerLoc && inspected.locationId !== playerLoc.locationId
        ? findShortestPath(db, playerLoc.locationId, inspected.locationId)
        : null;
    const linksHtml = inspected.connectedLocations
      .map((c) => {
        const t = db.locationMap.get(c.targetLocationId);
        if (!t) return '';
        const diffZ = t.coordinates.z !== inspected.coordinates.z ? `, Z=${t.coordinates.z}` : '';
        return `<button type="button" class="btn map-jump-btn" data-jump="${t.locationId}">→ ${shortLabel(t.name)} (${c.travelMinutes}p${diffZ})</button>`;
      })
      .join('');

    const viaLabel =
      route && route.steps.length > 1
        ? ` · qua ${route.steps
            .slice(0, -1)
            .map((s) => shortLabel(s.name))
            .join(' → ')}`
        : '';

    inspectorEl.innerHTML = `
      <div class="map-insp-head">
        <strong>${inspected.name}</strong>
        <span class="pill-tag">(${inspected.coordinates.x}, ${inspected.coordinates.y}, Z=${inspected.coordinates.z}) · Nguy hiểm: ${inspected.dangerLevel}</span>
      </div>
      <p class="map-insp-desc">${inspected.description}</p>
      <div class="map-insp-links">${linksHtml}</div>
      ${
        route && route.steps.length > 0 && save
          ? `<div class="map-insp-go"><button type="button" class="btn primary" id="map-travel-btn">Đi tới đây (${route.totalMinutes} phút${viaLabel})</button></div>`
          : ''
      }
    `;

    inspectorEl.querySelectorAll<HTMLButtonElement>('.map-jump-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tid = btn.dataset.jump;
        const target = tid ? db.locationMap.get(tid) : null;
        if (target) {
          selectedZ = target.coordinates.z;
          inspectedId = target.locationId;
          render();
        }
      });
    });

    const travelBtn = inspectorEl.querySelector<HTMLButtonElement>('#map-travel-btn');
    if (travelBtn) {
      travelBtn.addEventListener('click', () => {
        close();
        onQuickTravel(`Ta đi tới ${inspected.name}`);
      });
    }
  }

  function open(): void {
    const save = getSave();
    const cur = db.locationMap.get(save?.player.locationId ?? 'loc_ky_tuc_xa');
    selectedZ = cur?.coordinates.z ?? 1;
    inspectedId = cur?.locationId ?? 'loc_ky_tuc_xa';
    render();
    modalEl.classList.add('open');
  }

  function close(): void {
    modalEl.classList.remove('open');
  }

  return { open, close, render };
}
