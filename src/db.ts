import gameRulesJson from '../database/game_rules.json';
import itemsJson from '../database/items.json';
import guJson from '../database/gu.json';
import recipesJson from '../database/recipes.json';
import killerMovesJson from '../database/killer_moves.json';
import locationsJson from '../database/locations.json';
import npcsJson from '../database/npcs.json';
import obligationsJson from '../database/obligations.json';
import timelineEventsJson from '../database/timeline_events.json';
import type {
  EventStatus,
  GameRules,
  GuDefinition,
  ItemDefinition,
  KillerMoveDefinition,
  LocationDefinition,
  Npc,
  Obligation,
  PublicImage,
  RecipeDefinition,
  ResourceNode,
  SaveState,
  StaticDatabase,
  TimelineEvent,
} from './types';

let cachedDb: StaticDatabase | null = null;

export function loadStaticDatabase(): StaticDatabase {
  if (cachedDb) return cachedDb;

  const rules = gameRulesJson as unknown as GameRules;
  const items = itemsJson as unknown as ItemDefinition[];
  const gu = guJson as unknown as GuDefinition[];
  const recipes = recipesJson as unknown as RecipeDefinition[];
  const killerMoves = killerMovesJson as unknown as KillerMoveDefinition[];
  const locations = locationsJson as unknown as LocationDefinition[];
  const npcs = npcsJson as unknown as Npc[];
  const obligations = obligationsJson as unknown as Obligation[];
  const timelineEvents = timelineEventsJson as unknown as TimelineEvent[];

  const nodeToLocationMap = new Map<string, string>();
  for (const loc of locations) {
    for (const node of loc.resourceNodes) {
      nodeToLocationMap.set(node.nodeId, loc.locationId);
    }
  }

  cachedDb = {
    rules,
    items,
    gu,
    recipes,
    killerMoves,
    locations,
    npcs,
    obligations,
    timelineEvents,
    itemMap: new Map(items.map((x) => [x.itemId, x])),
    guMap: new Map(gu.map((x) => [x.guId, x])),
    recipeMap: new Map(recipes.map((x) => [x.recipeId, x])),
    moveMap: new Map(killerMoves.map((x) => [x.moveId, x])),
    locationMap: new Map(locations.map((x) => [x.locationId, x])),
    npcMap: new Map(npcs.map((x) => [x.npcId, x])),
    obligationMap: new Map(obligations.map((x) => [x.obligationId, x])),
    eventMap: new Map(timelineEvents.map((x) => [x.eventId, x])),
    nodeToLocationMap,
  };

  return cachedDb;
}

export interface PublicNpcView {
  npcId: string;
  name: string;
  role: string;
  status: Npc['status'];
  locationId: string;
  publicImage: PublicImage;
  attitude: number | null;
  privateNote: string | null;
}

interface NpcEncounterRule {
  /** 'mission2d' rolls once per 2-day mission block; 'shichen' rolls once per shichen */
  cadence: 'mission2d' | 'shichen';
  /** Dice 1–100 must be >= target to appear at chanceLocationId */
  target: number;
  chanceLocationId: string;
  chanceShichenRange: [number, number];
  fallbackLocationId: string;
}

/**
 * Deterministic 1–100 Encounter Dice seeded by (worldDiceSeed, day/bucket, shichen, key).
 * Consistent within the same day/shichen (prevents room-spamming) while feeling organic across playthroughs.
 */
export function rollEncounterDice(
  seed: number,
  dayBucket: number,
  shichenBucket: number,
  key: string
): number {
  let h = (seed ^ 0x9e3779b9) >>> 0;
  h = Math.imul(h ^ (dayBucket * 2654435761), 2246822519) >>> 0;
  h = Math.imul(h ^ (shichenBucket * 3266489917), 668265263) >>> 0;
  for (let i = 0; i < key.length; i++) {
    h = Math.imul(h ^ key.charCodeAt(i), 16777619) >>> 0;
  }
  h ^= h >>> 13;
  h = Math.imul(h, 1274126177) >>> 0;
  h ^= h >>> 16;
  return (h % 100) + 1;
}

/**
 * Encounter Dice rules (`dice >= target` to encounter):
 * - Rank-2 squads spend most days on multi-day wilderness missions, returning to Đông Môn only when rolling >= target.
 * - Cổ Nguyệt Đống Thổ mostly socializes with elders at Từ Đường, rarely auditing the inn.
 * - Outside fixed class hours, classmates only appear in public spots when their shichen encounter dice beats target.
 */
const NPC_ENCOUNTER_RULES: Record<string, NpcEncounterRule> = {
  npc_thanh_thu: {
    cadence: 'mission2d',
    target: 80,
    chanceLocationId: 'loc_dong_mon',
    chanceShichenRange: [8, 10],
    fallbackLocationId: 'loc_bach_gia_trai',
  },
  npc_xich_son: {
    cadence: 'mission2d',
    target: 80,
    chanceLocationId: 'loc_dong_mon',
    chanceShichenRange: [8, 10],
    fallbackLocationId: 'loc_rung_san_heo_rung',
  },
  npc_mac_nhan: {
    cadence: 'mission2d',
    target: 80,
    chanceLocationId: 'loc_dong_mon',
    chanceShichenRange: [8, 10],
    fallbackLocationId: 'loc_hung_gia_trai',
  },
  npc_giac_tam: {
    cadence: 'mission2d',
    target: 75,
    chanceLocationId: 'loc_dong_mon',
    chanceShichenRange: [9, 11],
    fallbackLocationId: 'loc_rung_san_heo_rung',
  },
  npc_cuu_phu: {
    cadence: 'shichen',
    target: 82,
    chanceLocationId: 'loc_khach_san',
    chanceShichenRange: [10, 11],
    fallbackLocationId: 'loc_tu_duong',
  },
};

const ROAMING_SCHEDULE_TARGETS: Record<string, Record<string, number>> = {
  npc_phuong_nguyen: {
    loc_khach_san: 62,
    loc_rung_truc_sau_trai: 65,
  },
  npc_giang_nha: {
    loc_khach_san: 55,
  },
  npc_kim_chau: {
    loc_duoc_duong: 60,
  },
  npc_phuong_chinh: {
    loc_tu_duong: 50,
  },
};

export function resolveNpc(db: StaticDatabase, save: SaveState, npcId: string): Npc | null {
  const base = db.npcMap.get(npcId);
  if (!base) return null;
  const delta = save.npcStates[npcId];

  let effectiveLocation = delta?.locationId ?? base.locationId;
  if (!delta?.locationId) {
    const seed = save.worldState.worldDiceSeed ?? 1337;
    const day = save.worldState.currentDay;
    const shichen = save.worldState.currentShichen;
    const rule = NPC_ENCOUNTER_RULES[npcId];

    if (rule) {
      const inWindow =
        shichen >= rule.chanceShichenRange[0] && shichen <= rule.chanceShichenRange[1];
      if (inWindow) {
        const dayBucket = rule.cadence === 'mission2d' ? Math.floor((day - 1) / 2) : day;
        const shichenBucket = rule.cadence === 'mission2d' ? 0 : shichen;
        const roll = rollEncounterDice(seed, dayBucket, shichenBucket, `npc:${npcId}`);
        effectiveLocation = roll >= rule.target ? rule.chanceLocationId : rule.fallbackLocationId;
      } else {
        effectiveLocation = rule.fallbackLocationId;
      }
    } else if (base.schedule.length > 0) {
      const match = base.schedule.find(
        (s) => shichen >= s.shichenRange[0] && shichen <= s.shichenRange[1]
      );
      if (match) {
        const roamTarget = ROAMING_SCHEDULE_TARGETS[npcId]?.[match.locationId];
        if (roamTarget !== undefined) {
          const roll = rollEncounterDice(seed, day, shichen, `roam:${npcId}:${match.locationId}`);
          effectiveLocation = roll >= roamTarget ? match.locationId : 'loc_ky_tuc_xa';
        } else {
          effectiveLocation = match.locationId;
        }
      }
    }
  }

  if (!delta) {
    return { ...base, locationId: effectiveLocation };
  }

  return {
    ...base,
    rank: delta.rank ?? base.rank,
    health: delta.health ?? base.health,
    status: delta.status ?? base.status,
    locationId: effectiveLocation,
    currentEssence: delta.currentEssence ?? base.currentEssence,
    ownedGu: delta.ownedGu ?? base.ownedGu,
  };
}

const VILLAGE_MICRO_EVENTS = [
  'Hai tộc nhân đang trao đổi nhỏ bên lề đường về giá cánh hoa Nguyệt Lan tuần này.',
  'Một nhóm phàm nhân gia nô vội vã khúm núm nép sát tường trúc nhường lối khi thấy học đồ Cổ sư đi qua.',
  'Gió núi Thanh Mao thổi qua mái trúc, mây xám kéo về báo hiệu cơn mưa nhẹ sắp đổ xuống.',
  'Vài tộc nhân vừa từ Đông Môn về đang bàn tán chuyện thú dữ ngoài sườn núi gần đây hoạt động mạnh hơn.',
];

const WILDERNESS_LUCKY_EVENTS = [
  'Ven bờ đá ẩm thấp lộ ra vài bụi thảo dược rừng xanh mướt có thể hái bán hoặc làm thuốc.',
  'Trên thân trúc mâu gần đó còn sót lại dấu vết phát sáng mờ nhạt của một con phàm cổ hoang dã cấp thấp vừa bò qua.',
  'Gốc cổ thụ khuất gió có nấm rừng và quả dại sạch, đủ bổ sung chút lương thực dọc đường.',
];

const WILDERNESS_HAZARD_EVENTS = [
  'Trong bụi rậm vang lên tiếng khịt mũi trầm đục — một con sơn trư (lợn rừng) lạc đàn đang sục tìm thức ăn gần lối mòn.',
  'Dưới lớp lá khô ven đường mòn ẩn giấu chiếc bẫy dây thòng lọng cũ của thợ săn phàm nhân.',
  'Mưa rừng lất phất làm rêu đá trơn trượt, tầm nhìn giữa rừng trúc mù sương giảm rõ rệt.',
  'Một con thanh xà độc nằm cuộn tròn trên cành trúc thấp sát lối đi, khẽ thè lưỡi dè chừng.',
];

/**
 * Encounter Dice for zone micro-events (`dice >= target`).
 * Returns null when no encounter triggers (costs 0 tokens!).
 * Hidden player luck subtly tilts fortunate vs hazardous wilderness outcomes without exposing luck.
 */
export function resolveZoneEncounter(
  db: StaticDatabase,
  save: SaveState,
  locationId: string
): string | null {
  const loc = db.locationMap.get(locationId);
  if (!loc) return null;
  if (
    locationId === 'loc_ky_tuc_xa' ||
    locationId === 'loc_hoc_duong' ||
    locationId === 'loc_co_that' ||
    locationId === 'loc_tu_duong' ||
    locationId === 'loc_hinh_duong'
  ) {
    return null;
  }

  const seed = save.worldState.worldDiceSeed ?? 1337;
  const day = save.worldState.currentDay;
  const shichen = save.worldState.currentShichen;
  const triggerRoll = rollEncounterDice(seed, day, shichen, `evt:${locationId}`);

  const isWilderness = loc.regionName !== 'Cổ Nguyệt Sơn Trại' || loc.dangerLevel >= 20;
  const target = isWilderness ? 64 : 84;
  if (triggerRoll < target) return null;

  const pickRoll = rollEncounterDice(seed, day, shichen, `evtPick:${locationId}`);
  if (!isWilderness) {
    return VILLAGE_MICRO_EVENTS[pickRoll % VILLAGE_MICRO_EVENTS.length];
  }

  // Subtle hidden luck tilt (40% lucky baseline +/- up to 15% from hidden luck)
  const luckChance = 40 + Math.round((save.player.luck / 50) * 15);
  const fortuneRoll = rollEncounterDice(seed, day, shichen, `evtLuck:${locationId}`);
  const pool = fortuneRoll <= luckChance ? WILDERNESS_LUCKY_EVENTS : WILDERNESS_HAZARD_EVENTS;
  return pool[pickRoll % pool.length];
}

function hasWorldFlag(save: SaveState, flagId: string): boolean {
  return save.worldState.worldFlags.some((f) => f.flagId === flagId);
}

function isCaravanActive(save: SaveState): boolean {
  return (
    hasWorldFlag(save, 'flag_caravan_arrived') &&
    save.worldState.currentDay >= 105 &&
    save.worldState.currentDay <= 130
  );
}

function isNpcAvailable(npcId: string, save: SaveState): boolean {
  if (npcId === 'npc_co_phu' || npcId === 'npc_co_kim_sinh') {
    return isCaravanActive(save);
  }
  if (npcId === 'npc_vuong_dai_ma_dao') {
    return hasWorldFlag(save, 'flag_vuong_dai_active') || save.worldState.currentDay >= 195;
  }
  return true;
}

export function resolveNpcsAtLocation(
  db: StaticDatabase,
  save: SaveState,
  locationId: string
): Npc[] {
  return db.npcs
    .filter((n) => isNpcAvailable(n.npcId, save))
    .map((n) => resolveNpc(db, save, n.npcId))
    .filter((n): n is Npc => n !== null && n.locationId === locationId && n.status === 'Alive');
}

/**
 * Strictly returns ONLY publicImage for UI display (never leaks true rank, aptitude, or true bio).
 */
export function resolvePublicNpcViews(db: StaticDatabase, save: SaveState): PublicNpcView[] {
  const relMap = new Map(save.player.relationships.map((r) => [r.npcId, r]));
  return db.npcs
    .filter((n) => isNpcAvailable(n.npcId, save))
    .map((n) => resolveNpc(db, save, n.npcId))
    .filter((n): n is Npc => n !== null)
    .map((npc) => {
      const rel = relMap.get(npc.npcId);
      return {
        npcId: npc.npcId,
        name: npc.name,
        role: npc.role,
        status: npc.status,
        locationId: npc.locationId,
        publicImage: npc.publicImage,
        attitude: rel ? rel.attitude : null,
        privateNote: rel ? rel.privateNote : null,
      };
    });
}

export function resolveLocation(
  db: StaticDatabase,
  save: SaveState,
  locationId: string
): LocationDefinition | null {
  const base = db.locationMap.get(locationId);
  if (!base) return null;

  const caravanOpen = isCaravanActive(save);
  const resolvedNodes: ResourceNode[] = base.resourceNodes
    .filter((node) => (node.nodeId === 'node_lai_tho_cap_mo' ? caravanOpen : true))
    .map((node) => {
      const delta = save.nodeStates[node.nodeId];
      if (!delta) return { ...node };
      return { ...node, isTaken: delta.isTaken, takenBy: delta.takenBy };
    });

  const description =
    locationId === 'loc_quang_truong' && caravanOpen
      ? `${base.description} Hiện tại thương đội Cổ Phú đang hạ trại tại đây, dựng kín lều chợ phiên, sạp cổ trùng và Đổ Thạch Tràng sầm uất.`
      : base.description;

  return { ...base, description, resourceNodes: resolvedNodes };
}

export function resolveObligations(db: StaticDatabase, save: SaveState): Obligation[] {
  return db.obligations.map((ob) => {
    const delta = save.obligationStates[ob.obligationId];
    return delta ? { ...ob, missedCount: delta.missedCount, isExcused: delta.isExcused } : { ...ob };
  });
}

export function resolveTimelineEvents(db: StaticDatabase, save: SaveState): TimelineEvent[] {
  return db.timelineEvents.map((evt) => {
    const status: EventStatus = save.eventStates[evt.eventId] ?? evt.status;
    return { ...evt, status };
  });
}

export function formatMinorRank(rank: number): string {
  if (rank <= 0) return 'Phàm nhân';
  if (rank > 20) return `${rank - 15} chuyển Cổ Tiên`;
  const tier = Math.ceil(rank / 4);
  const sub = ['Sơ giai', 'Trung giai', 'Cao giai', 'Đỉnh phong'][(rank - 1) % 4];
  const tierName = ['', 'Nhất chuyển', 'Nhị chuyển', 'Tam chuyển', 'Tứ chuyển', 'Ngũ chuyển'][tier] ?? `${tier} chuyển`;
  return `${tierName} ${sub}`;
}

export function formatClock(
  shichen: number,
  minutesInShichen: number,
  shichenNames: string[]
): { shichenLabel: string; hhmm: string } {
  const baseHour = (23 + (shichen - 1) * 2) % 24;
  const totalMins = baseHour * 60 + Math.max(0, Math.min(119, Math.floor(minutesInShichen)));
  const hh = Math.floor(totalMins / 60) % 24;
  const mm = totalMins % 60;
  const name = shichenNames[shichen - 1] ?? `Canh ${shichen}`;
  return {
    shichenLabel: `Giờ ${name}`,
    hhmm: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`,
  };
}

// === Multi-hop Pathfinding (Dijkstra) & Step-by-Step En-Route Obstacle Simulation ===

/** Restricted / secret locations that cannot be auto-routed through or jumped into from afar. */
export const RESTRICTED_AUTO_PATH_IDS = new Set<string>([
  'loc_linh_tuyen',
  'loc_dong_hoa_tuu_t1',
  'loc_dong_hoa_tuu_t2',
]);

export interface PathStep {
  locationId: string;
  name: string;
  legMinutes: number;
  cumulativeMinutes: number;
}

export interface ShortestPathResult {
  fromId: string;
  toId: string;
  steps: PathStep[];
  totalMinutes: number;
}

export interface TravelIntent {
  destId: string;
  waypointId?: string;
  avoidIds: Set<string>;
  isSneaking: boolean;
}

export type TravelBlockerKind =
  | 'departure_hold'
  | 'truancy'
  | 'suspicion'
  | 'hostile_npc'
  | 'zone_encounter';

export interface TravelPlan {
  fromId: string;
  intendedDestId: string;
  intendedDestName: string;
  plannedRouteNames: string[];
  plannedTotalMinutes: number;
  isSneaking: boolean;
  blocked: boolean;
  resolvedLocationId: string;
  resolvedLocationName: string;
  elapsedMinutes: number;
  traversedSteps: PathStep[];
  blockerReason: string | null;
  blockerKind: TravelBlockerKind | null;
  npcsAtResolved: string[];
  destZoneEvent: string | null;
}

function normalizeLocationText(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/\s+/g, ' ')
    .trim();
}

function runSingleDijkstra(
  db: StaticDatabase,
  fromId: string,
  toId: string,
  avoidIds?: Set<string>
): ShortestPathResult | null {
  if (fromId === toId) {
    return { fromId, toId, steps: [], totalMinutes: 0 };
  }
  const startLoc = db.locationMap.get(fromId);
  const destLoc = db.locationMap.get(toId);
  if (!startLoc || !destLoc) return null;

  // Never auto-route into secret/restricted locations unless directly adjacent
  if (RESTRICTED_AUTO_PATH_IDS.has(toId)) {
    const direct = startLoc.connectedLocations.find((c) => c.targetLocationId === toId);
    if (!direct) return null;
    return {
      fromId,
      toId,
      steps: [
        {
          locationId: toId,
          name: destLoc.name,
          legMinutes: direct.travelMinutes,
          cumulativeMinutes: direct.travelMinutes,
        },
      ],
      totalMinutes: direct.travelMinutes,
    };
  }

  const dist = new Map<string, number>();
  const prev = new Map<string, { nodeId: string; legMinutes: number }>();
  const visited = new Set<string>();

  for (const loc of db.locations) {
    dist.set(loc.locationId, Infinity);
  }
  dist.set(fromId, 0);

  while (visited.size < db.locations.length) {
    let curId: string | null = null;
    let bestCost = Infinity;
    for (const [id, cost] of dist.entries()) {
      if (!visited.has(id) && cost < bestCost) {
        bestCost = cost;
        curId = id;
      }
    }
    if (!curId || bestCost === Infinity) break;
    if (curId === toId) break;
    visited.add(curId);

    const curLoc = db.locationMap.get(curId);
    if (!curLoc) continue;

    for (const edge of curLoc.connectedLocations) {
      const nextId = edge.targetLocationId;
      if (visited.has(nextId)) continue;
      // Never route through restricted/secret locations as intermediate nodes
      if (nextId !== toId && RESTRICTED_AUTO_PATH_IDS.has(nextId)) continue;

      const penalty = avoidIds?.has(nextId) && nextId !== toId ? 500 : 0;
      const candCost = bestCost + edge.travelMinutes + penalty;
      if (candCost < (dist.get(nextId) ?? Infinity)) {
        dist.set(nextId, candCost);
        prev.set(nextId, { nodeId: curId, legMinutes: edge.travelMinutes });
      }
    }
  }

  if (!prev.has(toId)) return null;

  const rawHops: { locationId: string; legMinutes: number }[] = [];
  let trace = toId;
  while (trace !== fromId) {
    const p = prev.get(trace);
    if (!p) return null;
    rawHops.push({ locationId: trace, legMinutes: p.legMinutes });
    trace = p.nodeId;
  }
  rawHops.reverse();

  let cumulative = 0;
  const steps: PathStep[] = rawHops.map((h) => {
    cumulative += h.legMinutes;
    return {
      locationId: h.locationId,
      name: db.locationMap.get(h.locationId)?.name ?? h.locationId,
      legMinutes: h.legMinutes,
      cumulativeMinutes: cumulative,
    };
  });

  return { fromId, toId, steps, totalMinutes: cumulative };
}

export function findShortestPath(
  db: StaticDatabase,
  fromId: string,
  toId: string,
  options?: { avoidIds?: Set<string>; waypointId?: string }
): ShortestPathResult | null {
  const avoidIds = options?.avoidIds;
  const waypointId = options?.waypointId;

  if (waypointId && waypointId !== fromId && waypointId !== toId) {
    const leg1 = runSingleDijkstra(db, fromId, waypointId, avoidIds);
    const leg2 = runSingleDijkstra(db, waypointId, toId, avoidIds);
    if (leg1 && leg2) {
      let cumulative = 0;
      const combined: PathStep[] = [];
      for (const s of [...leg1.steps, ...leg2.steps]) {
        cumulative += s.legMinutes;
        combined.push({
          locationId: s.locationId,
          name: s.name,
          legMinutes: s.legMinutes,
          cumulativeMinutes: cumulative,
        });
      }
      return { fromId, toId, steps: combined, totalMinutes: cumulative };
    }
  }

  return runSingleDijkstra(db, fromId, toId, avoidIds);
}

const LOCATION_ALIASES: Array<{ alias: string; locationId: string }> = [
  { alias: 'dong hoa tuu tang 2', locationId: 'loc_dong_hoa_tuu_t2' },
  { alias: 'tang 2 dong hoa tuu', locationId: 'loc_dong_hoa_tuu_t2' },
  { alias: 'dong hoa tuu tang 1', locationId: 'loc_dong_hoa_tuu_t1' },
  { alias: 'tang 1 dong hoa tuu', locationId: 'loc_dong_hoa_tuu_t1' },
  { alias: 'rung thanh mau truc', locationId: 'loc_rung_truc_sau_trai' },
  { alias: 'rung san heo rung', locationId: 'loc_rung_san_heo_rung' },
  { alias: 'suon rung san lon rung', locationId: 'loc_rung_san_heo_rung' },
  { alias: 'dong mon tuu quan', locationId: 'loc_dong_mon' },
  { alias: 'bai song da cuoi', locationId: 'loc_bai_song_khe_hoa_tuu' },
  { alias: 'dia ha nguyen tuyen', locationId: 'loc_linh_tuyen' },
  { alias: 'gia toc tu duong', locationId: 'loc_tu_duong' },
  { alias: 'ky tuc xa hoc duong', locationId: 'loc_ky_tuc_xa' },
  { alias: 'thon trang pham nhan', locationId: 'loc_thon_pham_nhan' },
  { alias: 'bach gia son trai', locationId: 'loc_bach_gia_trai' },
  { alias: 'hung gia son trai', locationId: 'loc_hung_gia_trai' },
  { alias: 'dai thac nuoc', locationId: 'loc_dai_thac_nuoc' },
  { alias: 'ruong bac thang', locationId: 'loc_son_dao_ruong_bac_thang' },
  { alias: 'vuon nguyet lan', locationId: 'loc_duoc_duong' },
  { alias: 'dien vo truong', locationId: 'loc_hoc_duong' },
  { alias: 'rung mau truc', locationId: 'loc_rung_truc_sau_trai' },
  { alias: 'rung lon rung', locationId: 'loc_rung_san_heo_rung' },
  { alias: 'suon rung san', locationId: 'loc_rung_san_heo_rung' },
  { alias: 'dinh thanh mao', locationId: 'loc_dinh_thanh_mao' },
  { alias: 'quang truong', locationId: 'loc_quang_truong' },
  { alias: 'do thach trang', locationId: 'loc_quang_truong' },
  { alias: 'thon pham nhan', locationId: 'loc_thon_pham_nhan' },
  { alias: 'lang pham nhan', locationId: 'loc_thon_pham_nhan' },
  { alias: 'dong hoa tuu', locationId: 'loc_dong_hoa_tuu_t1' },
  { alias: 'khe hoa tuu', locationId: 'loc_bai_song_khe_hoa_tuu' },
  { alias: 'khe cu thach', locationId: 'loc_dong_hoa_tuu_t1' },
  { alias: 'bach gia trai', locationId: 'loc_bach_gia_trai' },
  { alias: 'hung gia trai', locationId: 'loc_hung_gia_trai' },
  { alias: 'nguyen tuyen', locationId: 'loc_linh_tuyen' },
  { alias: 'ky tuc xa', locationId: 'loc_ky_tuc_xa' },
  { alias: 'hinh duong', locationId: 'loc_hinh_duong' },
  { alias: 'duoc duong', locationId: 'loc_duoc_duong' },
  { alias: 'hoc duong', locationId: 'loc_hoc_duong' },
  { alias: 'khach san', locationId: 'loc_khach_san' },
  { alias: 'tuu quan', locationId: 'loc_khach_san' },
  { alias: 'quan ruou', locationId: 'loc_khach_san' },
  { alias: 'rung truc', locationId: 'loc_rung_truc_sau_trai' },
  { alias: 'tu duong', locationId: 'loc_tu_duong' },
  { alias: 'dong mon', locationId: 'loc_dong_mon' },
  { alias: 'cong dong', locationId: 'loc_dong_mon' },
  { alias: 'cong trai', locationId: 'loc_dong_mon' },
  { alias: 'bai song', locationId: 'loc_bai_song_khe_hoa_tuu' },
  { alias: 'rem thac', locationId: 'loc_bai_song_khe_hoa_tuu' },
  { alias: 'linh tuyen', locationId: 'loc_linh_tuyen' },
  { alias: 'cam dia', locationId: 'loc_linh_tuyen' },
  { alias: 'co that', locationId: 'loc_co_that' },
  { alias: 'khu pho', locationId: 'loc_khach_san' },
  { alias: 'tiem ren', locationId: 'loc_khach_san' },
  { alias: 'son dao', locationId: 'loc_son_dao_ruong_bac_thang' },
  { alias: 'chan nui', locationId: 'loc_son_dao_ruong_bac_thang' },
  { alias: 'tham dam', locationId: 'loc_bach_gia_trai' },
  { alias: 'hau son', locationId: 'loc_rung_truc_sau_trai' },
  { alias: 'dinh nui', locationId: 'loc_dinh_thanh_mao' },
  { alias: 'cho phien', locationId: 'loc_quang_truong' },
  { alias: 'phong ngu', locationId: 'loc_ky_tuc_xa' },
  { alias: 've phong', locationId: 'loc_ky_tuc_xa' },
  { alias: 'ky tuc', locationId: 'loc_ky_tuc_xa' },
  { alias: 'lop hoc', locationId: 'loc_hoc_duong' },
  { alias: 'ktx', locationId: 'loc_ky_tuc_xa' },
].sort((a, b) => b.alias.length - a.alias.length);

const TRAVEL_VERB_RE =
  /(^|\s)(di|den|toi|ra|vao|sang|quay ve|tro ve|quay lai|chay|len|chuon|vong|ghe|tien|buoc|roi|leo|xuong|men theo|len duong|thang toi|thang ra)(\s|$)/;

const NON_TRAVEL_PREFIX_RE =
  /\b(hoi|ke|noi|nghe|ban|nhin|ngam|nhac|nghi|ban tan|do hoi|tham do)\s+(?:\S+\s+){0,4}(ve|den|toi|phia|o|tai)?\s*$/;

const AVOID_PREFIX_RE = /\b(ne|tranh|vong tranh|bo qua|khong qua|khong di qua|tranh xa)\s*$/;
const WAYPOINT_PREFIX_RE = /\b(vong qua|di qua|re qua|theo duong|ngang qua|qua)\s*$/;
const SNEAK_RE =
  /\b(len|len lut|an nap|ne tranh|ne|tranh mat|cat dau|khong de ai thay|im lang|nhe nhang|tron hoc|tron ra)\b/;

export function parseTravelIntent(
  db: StaticDatabase,
  userText: string,
  currentLocationId: string
): TravelIntent | null {
  const norm = normalizeLocationText(userText);
  if (!norm) return null;

  // Must contain a genuine movement verb (and not just "hoi ... ve ...")
  const hasTravelVerb = TRAVEL_VERB_RE.test(norm) || /\b(ve)\s+(ky tuc|phong|hoc duong|trai)\b/.test(norm);
  if (!hasTravelVerb) return null;

  // Find all non-overlapping location mentions in order of appearance
  const matches: Array<{ start: number; end: number; locationId: string }> = [];
  for (const { alias, locationId } of LOCATION_ALIASES) {
    if (!db.locationMap.has(locationId)) continue;
    let searchFrom = 0;
    while (searchFrom < norm.length) {
      const idx = norm.indexOf(alias, searchFrom);
      if (idx < 0) break;
      const beforeOk = idx === 0 || !/[a-z0-9]/.test(norm[idx - 1]);
      const end = idx + alias.length;
      const afterOk = end === norm.length || !/[a-z0-9]/.test(norm[end]);
      if (beforeOk && afterOk) {
        const overlaps = matches.some((m) => idx < m.end && end > m.start);
        if (!overlaps) {
          matches.push({ start: idx, end, locationId });
        }
      }
      searchFrom = idx + alias.length;
    }
  }

  if (matches.length === 0) return null;
  matches.sort((a, b) => a.start - b.start);

  const avoidIds = new Set<string>();
  const waypoints: string[] = [];
  const destinations: string[] = [];

  for (const m of matches) {
    const prefix = norm.slice(Math.max(0, m.start - 36), m.start);
    if (NON_TRAVEL_PREFIX_RE.test(prefix)) continue;

    if (AVOID_PREFIX_RE.test(prefix)) {
      avoidIds.add(m.locationId);
    } else if (WAYPOINT_PREFIX_RE.test(prefix)) {
      waypoints.push(m.locationId);
    } else {
      destinations.push(m.locationId);
    }
  }

  let destId: string | undefined;
  let waypointId: string | undefined;

  if (destinations.length > 0) {
    destId = destinations[destinations.length - 1];
    if (waypoints.length > 0 && waypoints[0] !== destId) {
      waypointId = waypoints[0];
    } else if (destinations.length >= 2 && destinations[0] !== destId && destinations[0] !== currentLocationId) {
      waypointId = destinations[0];
    }
  } else if (waypoints.length > 0) {
    destId = waypoints[waypoints.length - 1];
    if (waypoints.length >= 2 && waypoints[0] !== destId) {
      waypointId = waypoints[0];
    }
  }

  if (!destId || destId === currentLocationId) return null;
  if (avoidIds.has(destId)) return null;

  return {
    destId,
    waypointId,
    avoidIds,
    isSneaking: SNEAK_RE.test(norm),
  };
}

function projectSaveClock(save: SaveState, addMinutes: number): SaveState {
  if (addMinutes <= 0) return save;
  const rawMin = save.worldState.currentTime + addMinutes;
  const extraShichen = Math.floor(rawMin / 120);
  const newTime = rawMin % 120;
  const totalShichen = save.worldState.currentShichen - 1 + extraShichen;
  const extraDays = Math.floor(totalShichen / 12);
  const newShichen = (totalShichen % 12) + 1;
  return {
    ...save,
    worldState: {
      ...save.worldState,
      currentDay: save.worldState.currentDay + extraDays,
      currentShichen: newShichen,
      currentTime: newTime,
    },
  };
}

function rollTravelD100(): number {
  return Math.floor(Math.random() * 100) + 1;
}

function hasLeavePermitOrExcused(db: StaticDatabase, save: SaveState): boolean {
  const hasPermit = save.player.inventory.items.some(
    (it) => it.itemId === 'item_giay_phep_ra_trai' && it.quantity > 0
  );
  if (hasPermit) return true;
  const ob = resolveObligations(db, save).find((o) => o.obligationId === 'ob_hoc_duong_hang_ngay');
  return Boolean(ob?.isExcused);
}

function isClassSessionActive(db: StaticDatabase, save: SaveState): boolean {
  if (save.worldState.currentDay > 360) return false;
  if (hasLeavePermitOrExcused(db, save)) return false;
  const s = save.worldState.currentShichen;
  return s >= 5 && s <= 6;
}

/**
 * Step-by-step En-Route Travel & Obstacle Simulator:
 * 1. Parses travel intent & computes shortest path (honoring waypoints / avoided nodes).
 * 2. Checks departure hold & walks each hop in order, rolling obstacle dice per hop.
 * 3. Breaks IMMEDIATELY at the first obstacle — never checks hops beyond the stop!
 */
export function simulateTravelPlan(
  db: StaticDatabase,
  save: SaveState,
  userText: string
): TravelPlan | null {
  const fromId = save.player.locationId;
  const intent = parseTravelIntent(db, userText, fromId);
  if (!intent) return null;

  const path = findShortestPath(db, fromId, intent.destId, {
    avoidIds: intent.avoidIds,
    waypointId: intent.waypointId,
  });
  if (!path || path.steps.length === 0) return null;

  const fromName = db.locationMap.get(fromId)?.name ?? fromId;
  const destName = db.locationMap.get(intent.destId)?.name ?? intent.destId;
  const plannedRouteNames = path.steps.map((s) => s.name);
  const luckTilt = Math.round((save.player.luck / 50) * 8); // hidden, subtle +/-8%

  // Step 0: Departure Hold — trying to walk out of Học Đường right during active class!
  if (fromId === 'loc_hoc_duong' && isClassSessionActive(db, save)) {
    const npcsNow = resolveNpcsAtLocation(db, save, 'loc_hoc_duong');
    const elderHere = npcsNow.some((n) => n.npcId === 'npc_hoc_duong_gia_lao');
    if (elderHere) {
      const catchChance = intent.isSneaking ? Math.max(55, 78 - luckTilt) : 100;
      if (rollTravelD100() <= catchChance) {
        return {
          fromId,
          intendedDestId: intent.destId,
          intendedDestName: destName,
          plannedRouteNames,
          plannedTotalMinutes: path.totalMinutes,
          isSneaking: intent.isSneaking,
          blocked: true,
          resolvedLocationId: fromId,
          resolvedLocationName: fromName,
          elapsedMinutes: 0,
          traversedSteps: [],
          blockerReason:
            'Đang trong giờ học tại Học Đường — Học Đường Gia Lão lập tức nhận ra ngươi định rời khỏi lớp.',
          blockerKind: 'departure_hold',
          npcsAtResolved: npcsNow.map((n) => n.name),
          destZoneEvent: null,
        };
      }
    }
  }

  // Walk hop-by-hop; break IMMEDIATELY on first obstacle without checking later hops
  const traversed: PathStep[] = [];
  const relMap = new Map(save.player.relationships.map((r) => [r.npcId, r]));
  const suspicion = typeof save.player.suspicion === 'number' ? save.player.suspicion : 0;

  for (let i = 0; i < path.steps.length; i++) {
    const step = path.steps[i];
    const isFinalHop = i === path.steps.length - 1;
    traversed.push(step);

    if (isFinalHop) break;

    const hopSave = projectSaveClock(save, step.cumulativeMinutes);
    const hopNpcs = resolveNpcsAtLocation(db, hopSave, step.locationId);
    const hopNpcNames = hopNpcs.map((n) => n.name);

    // Obstacle 1: Skipping class and walking right past Học Đường during class hours
    if (step.locationId === 'loc_hoc_duong' && isClassSessionActive(db, hopSave)) {
      const elderHere = hopNpcs.some((n) => n.npcId === 'npc_hoc_duong_gia_lao');
      if (elderHere) {
        const baseChance = intent.isSneaking ? 35 : 75;
        const detectChance = Math.max(15, Math.min(92, baseChance - luckTilt));
        if (rollTravelD100() <= detectChance) {
          return {
            fromId,
            intendedDestId: intent.destId,
            intendedDestName: destName,
            plannedRouteNames,
            plannedTotalMinutes: path.totalMinutes,
            isSneaking: intent.isSneaking,
            blocked: true,
            resolvedLocationId: step.locationId,
            resolvedLocationName: step.name,
            elapsedMinutes: step.cumulativeMinutes,
            traversedSteps: traversed,
            blockerReason:
              'Trốn học đi ngang Học Đường đúng giờ lên lớp — bị Học Đường Gia Lão và giám thị phát hiện chặn hỏi.',
            blockerKind: 'truancy',
            npcsAtResolved: hopNpcNames,
            destZoneEvent: null,
          };
        }
      }
    }

    // Obstacle 2: Passing Hình Đường with elevated suspicion
    if (step.locationId === 'loc_hinh_duong' && suspicion >= 20) {
      const stopChance = Math.max(
        15,
        Math.min(85, suspicion + (intent.isSneaking ? -15 : 15) - luckTilt)
      );
      if (rollTravelD100() <= stopChance) {
        return {
          fromId,
          intendedDestId: intent.destId,
          intendedDestName: destName,
          plannedRouteNames,
          plannedTotalMinutes: path.totalMinutes,
          isSneaking: intent.isSneaking,
          blocked: true,
          resolvedLocationId: step.locationId,
          resolvedLocationName: step.name,
          elapsedMinutes: step.cumulativeMinutes,
          traversedSteps: traversed,
          blockerReason:
            'Đi ngang Hình Đường với dấu hiệu khả nghi cao — đệ tử chấp pháp Hình Đường chặn lại tra xét.',
          blockerKind: 'suspicion',
          npcsAtResolved: hopNpcNames,
          destZoneEvent: null,
        };
      }
    }

    // Obstacle 3: Passing an intermediate node where a deeply hostile NPC is present
    const hostileNpc = hopNpcs.find((n) => (relMap.get(n.npcId)?.attitude ?? 0) <= -30);
    if (hostileNpc) {
      const clashChance = Math.max(
        15,
        Math.min(80, (intent.isSneaking ? 30 : 60) - luckTilt)
      );
      if (rollTravelD100() <= clashChance) {
        return {
          fromId,
          intendedDestId: intent.destId,
          intendedDestName: destName,
          plannedRouteNames,
          plannedTotalMinutes: path.totalMinutes,
          isSneaking: intent.isSneaking,
          blocked: true,
          resolvedLocationId: step.locationId,
          resolvedLocationName: step.name,
          elapsedMinutes: step.cumulativeMinutes,
          traversedSteps: traversed,
          blockerReason: `Đi ngang ${step.name} thì chạm mặt ${hostileNpc.name} (đang có hiềm khích sâu) chặn lối.`,
          blockerKind: 'hostile_npc',
          npcsAtResolved: hopNpcNames,
          destZoneEvent: null,
        };
      }
    }

    // Obstacle 4: Wilderness / dangerous zone roadblock on intermediate hop
    const locDef = db.locationMap.get(step.locationId);
    if (locDef && locDef.dangerLevel >= 20) {
      const rawChance = Math.min(60, Math.round(locDef.dangerLevel * 0.85));
      const hazardChance = Math.max(
        10,
        Math.min(70, rawChance - (intent.isSneaking ? 6 : 0) - luckTilt)
      );
      if (rollTravelD100() <= hazardChance) {
        let hazardDesc: string;
        if (step.locationId === 'loc_bach_gia_trai') {
          hazardDesc = 'Chạm trán tiểu tổ tuần tra của Bạch Gia Sơn Trại cảnh giác chặn lối xét hỏi.';
        } else if (step.locationId === 'loc_hung_gia_trai') {
          hazardDesc = 'Chạm trán toán cổ sư tuần sơn của Hùng Gia Sơn Trại chặn đường đề phòng.';
        } else {
          hazardDesc =
            WILDERNESS_HAZARD_EVENTS[Math.floor(Math.random() * WILDERNESS_HAZARD_EVENTS.length)];
        }
        return {
          fromId,
          intendedDestId: intent.destId,
          intendedDestName: destName,
          plannedRouteNames,
          plannedTotalMinutes: path.totalMinutes,
          isSneaking: intent.isSneaking,
          blocked: true,
          resolvedLocationId: step.locationId,
          resolvedLocationName: step.name,
          elapsedMinutes: step.cumulativeMinutes,
          traversedSteps: traversed,
          blockerReason: `Trên đường băng qua ${step.name}: ${hazardDesc}`,
          blockerKind: 'zone_encounter',
          npcsAtResolved: hopNpcNames,
          destZoneEvent: null,
        };
      }
    }
  }

  // Clear path all the way to destination!
  const arrivalSave = projectSaveClock(save, path.totalMinutes);
  const destNpcs = resolveNpcsAtLocation(db, arrivalSave, intent.destId).map((n) => n.name);
  const destZoneEvent = resolveZoneEncounter(db, arrivalSave, intent.destId);

  return {
    fromId,
    intendedDestId: intent.destId,
    intendedDestName: destName,
    plannedRouteNames,
    plannedTotalMinutes: path.totalMinutes,
    isSneaking: intent.isSneaking,
    blocked: false,
    resolvedLocationId: intent.destId,
    resolvedLocationName: destName,
    elapsedMinutes: path.totalMinutes,
    traversedSteps: traversed,
    blockerReason: null,
    blockerKind: null,
    npcsAtResolved: destNpcs,
    destZoneEvent,
  };
}
