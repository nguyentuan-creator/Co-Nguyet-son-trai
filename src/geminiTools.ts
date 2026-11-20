import {
  GoogleGenAI,
  HarmBlockThreshold,
  HarmCategory,
  type Content,
  type GenerateContentResponseUsageMetadata,
} from '@google/genai';
import defaultStoryPrompt from '../prompts/story_prompt.md?raw';
import type {
  ChatMessage,
  DiceCategory,
  SaveState,
  StaticDatabase,
  TokenUsage,
  TurnDetails,
} from './types';
import {
  findShortestPath,
  formatClock,
  formatMinorRank,
  resolveLocation,
  resolveNpcsAtLocation,
  resolveObligations,
  resolveTimelineEvents,
  resolveZoneEncounter,
  simulateTravelPlan,
  type TravelPlan,
} from './db';
import {
  applyFlatStateUpdate,
  buildPreRolledDiceSheet,
  checkEndings,
  evaluatePreRolledDice,
  getMaxEssence,
  getPlayerSatiety,
  getPlayerSuspicion,
  getRumorsKnownByNpc,
  runTimeTick,
  useGuOrMove,
  type ActivityKind,
  type FlatStateUpdate,
} from './engine';

export const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
];

export function createAiClient(apiKey: string): GoogleGenAI {
  return new GoogleGenAI({ apiKey, httpOptions: { apiVersion: 'v1beta' } });
}

function normalizeForMatch(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd');
}

export function buildLiveContext(
  db: StaticDatabase,
  save: SaveState,
  userText = '',
  travelPlan: TravelPlan | null = null,
  isEscapeTurn = false
): string {
  const { player, worldState } = save;
  const loc = resolveLocation(db, save, player.locationId);
  const npcsHere = resolveNpcsAtLocation(db, save, player.locationId);
  const presentIds = new Set(npcsHere.map((n) => n.npcId));
  const clock = formatClock(
    worldState.currentShichen,
    worldState.currentTime,
    db.rules.time.shichenNames
  );
  const maxEss = getMaxEssence(player.aptitude);
  const normInput = normalizeForMatch(userText);

  const npcBriefs = npcsHere.map((npc) => {
    const rel = player.relationships.find((r) => r.npcId === npc.npcId);
    const knownRumors = getRumorsKnownByNpc(
      save,
      npc.npcId,
      loc?.regionName ?? 'Cổ Nguyệt Sơn Trại'
    );
    const shortName = normalizeForMatch(npc.name).replace(/^co nguyet\s+/, '');
    const mentioned =
      normInput.length > 0 &&
      (normInput.includes(shortName) ||
        (npc.npcId === 'npc_hoc_duong_gia_lao' && normInput.includes('gia lao')));
    const expandDetail =
      npcsHere.length <= 2 || mentioned || Boolean(rel && (rel.attitude !== 0 || rel.privateNote));

    const entry: Record<string, unknown> = {
      id: npc.npcId,
      name: npc.name,
      role: npc.role,
      rank: formatMinorRank(npc.rank),
    };
    if (npc.publicImage.apparentRank !== npc.rank) {
      entry.apparentRank = formatMinorRank(npc.publicImage.apparentRank);
    }
    if (rel && rel.attitude !== 0) entry.att = rel.attitude;
    if (rel?.privateNote) entry.note = rel.privateNote;
    if (knownRumors.length > 0) entry.rumors = knownRumors.map((r) => r.content);
    if (expandDetail) {
      entry.personality = npc.personality;
      entry.goals = npc.goals;
    }
    return entry;
  });

  const notableRelations = player.relationships
    .filter((r) => !presentIds.has(r.npcId) && (r.attitude !== 0 || Boolean(r.privateNote)))
    .slice(0, 8)
    .map((r) => {
      const n = db.npcMap.get(r.npcId);
      const item: Record<string, unknown> = {
        id: r.npcId,
        name: n?.name ?? r.npcId,
        att: r.attitude,
      };
      if (r.privateNote) item.note = r.privateNote;
      return item;
    });

  const factionRep: Record<string, number> = {};
  for (const [k, v] of Object.entries(player.factionRep)) {
    if (v !== 0) factionRep[k] = v;
  }

  const ownedGu = player.ownedGu.map((g) => {
    const def = db.guMap.get(g.guId);
    return {
      guId: g.guId,
      name: def?.name ?? g.guId,
      vital: g.isVital,
      refined: g.isRefined,
      hunger: `${Math.round(g.hunger)}%`,
      ...(def ? { cost: `${def.essenceCost.amount} thành`, effect: def.effect } : {}),
    };
  });

  const suspicion = getPlayerSuspicion(player);
  const playerCtx: Record<string, unknown> = {
    name: player.name,
    rank: `${player.rank} (${formatMinorRank(player.rank)})`,
    aptitude: `${player.aptitudeGrade} ${player.aptitude}%`,
    essence: `${player.currentEssence}/${maxEss} thành`,
    cultivation: `${player.cultivationProgress}%`,
    strength: `${player.strength} trư lực`,
    bodyReality:
      player.ownedGu.length === 0 && player.strength <= 0.3
        ? 'PHÀM NHÂN (0 Cổ trùng, chưa cải tạo): thể chất ngang người thường 15t; CẤM dồn chân nguyên vào đấm/đá.'
        : 'Chỉ có siêu năng lực qua Cổ trùng trong ownedGu.',
    hp: `${player.health}%`,
    fatigue: `${player.fatigue}/100`,
    satiety: `${getPlayerSatiety(player)}%`,
    stones: player.inventory.primevalStones,
  };
  if (suspicion > 0) playerCtx.suspicion = `${suspicion}/100`;
  if (player.apertureStatus !== 'Normal') playerCtx.aperture = player.apertureStatus;
  if (player.clanContribution !== 0) playerCtx.contribution = player.clanContribution;
  if (Object.keys(factionRep).length > 0) playerCtx.factionRep = factionRep;
  if (player.statusEffects.length > 0) {
    playerCtx.statusEffects = player.statusEffects.map((e) => `${e.effectId}:${e.name}`);
  }
  if (ownedGu.length > 0) playerCtx.ownedGu = ownedGu;
  if (player.inventory.items.length > 0) {
    playerCtx.items = player.inventory.items.map((i) => ({
      id: i.itemId,
      name: db.itemMap.get(i.itemId)?.name ?? i.itemId,
      qty: i.quantity,
    }));
  }
  if (player.knownMoveIds.length > 0) {
    playerCtx.knownMoves = player.knownMoveIds.map((id) => ({
      id,
      name: db.moveMap.get(id)?.name ?? id,
    }));
  }
  if (player.knownRecipeIds.length > 0) {
    playerCtx.knownRecipes = player.knownRecipeIds.map((id) => ({
      id,
      name: db.recipeMap.get(id)?.name ?? id,
    }));
  }

  // Include concise NPC names on adjacent locations so 1-Call room transitions stay 100% accurate!
  const locCtx: Record<string, unknown> | null = loc
    ? {
        id: loc.locationId,
        name: loc.name,
        danger: loc.dangerLevel,
        desc: loc.description,
        connected: loc.connectedLocations.map((c) => {
          const destNpcs = resolveNpcsAtLocation(db, save, c.targetLocationId).map((n) => n.name);
          const item: Record<string, unknown> = {
            id: c.targetLocationId,
            name: db.locationMap.get(c.targetLocationId)?.name ?? c.targetLocationId,
            mins: c.travelMinutes,
          };
          if (destNpcs.length > 0) item.npcs = destNpcs;
          return item;
        }),
      }
    : null;
  if (loc && locCtx) {
    const availableNodes = loc.resourceNodes.filter((n) => !n.isTaken);
    if (availableNodes.length > 0) {
      locCtx.nodes = availableNodes.map((n) => ({
        id: n.nodeId,
        name: n.name,
        dc: n.hiddenDifficulty,
      }));
    }
  }

  const events = resolveTimelineEvents(db, save)
    .filter((e) => e.status === 'Active' || (e.status === 'Pending' && e.triggerDay <= worldState.currentDay + 3))
    .map((e) => ({ id: e.eventId, name: e.name, day: e.triggerDay, status: e.status, summary: e.summary }));

  const obligations = resolveObligations(db, save)
    .slice(0, 3)
    .map((ob) => ({
      name: ob.name,
      loc: ob.locationId,
      shichen: ob.shichenRange,
      missed: `${ob.missedCount}/${ob.maxMissedAllowed}`,
    }));

  const zoneEncounter = resolveZoneEncounter(db, save, player.locationId);

  const ctx: Record<string, unknown> = {
    clock: `Ngày ${worldState.currentDay} (${worldState.season}) · ${clock.shichenLabel} ${clock.hhmm} (${worldState.timeOfDay})`,
    player: playerCtx,
    location: locCtx,
  };
  if (npcBriefs.length > 0) ctx.npcsPresent = npcBriefs;
  if (zoneEncounter) ctx.zoneEncounter = zoneEncounter;
  if (travelPlan) {
    if (travelPlan.blocked) {
      ctx.travelPlan = {
        status: 'BI_CHAN_DUNG_NGAY',
        intendedDest: travelPlan.intendedDestName,
        stoppedAtId: travelPlan.resolvedLocationId,
        stoppedAtName: travelPlan.resolvedLocationName,
        walkedRoute: travelPlan.traversedSteps.map((s) => `${s.name} (${s.legMinutes}p)`),
        elapsedMins: travelPlan.elapsedMinutes,
        blocker: travelPlan.blockerReason,
        ...(travelPlan.npcsAtResolved.length > 0 ? { npcsAtStop: travelPlan.npcsAtResolved } : {}),
        rule: 'BẮT BUỘC DỪNG LƯỢT NGAY TẠI stoppedAtId! CHƯA tới intendedDest; KHÔNG tự viết PC bỏ qua đi tiếp.',
      };
    } else {
      ctx.travelPlan = {
        status: isEscapeTurn
          ? 'CHI_TOI_DICH_NEU_XUC_XAC_CHAY_TRON_DAT'
          : 'TROT_LOT_TOI_DICH',
        route: travelPlan.traversedSteps.map((s) => `${s.name} (${s.legMinutes}p)`),
        arrivedId: travelPlan.resolvedLocationId,
        arrivedName: travelPlan.resolvedLocationName,
        totalMins: travelPlan.elapsedMinutes,
        ...(travelPlan.npcsAtResolved.length > 0 ? { npcsAtDest: travelPlan.npcsAtResolved } : {}),
        ...(travelPlan.destZoneEvent ? { destEvent: travelPlan.destZoneEvent } : {}),
      };
    }
  }
  if (notableRelations.length > 0) ctx.notableRelations = notableRelations;
  if (events.length > 0) ctx.events = events;
  if (obligations.length > 0) ctx.obligations = obligations;
  if (worldState.worldFlags.length > 0) ctx.worldFlags = worldState.worldFlags.slice(-10);
  if (worldState.memoryLog.length > 0) ctx.memoryLog = worldState.memoryLog.slice(-8);

  return JSON.stringify(ctx);
}

const ESCAPE_ACTION_RE =
  /\b(chay tron|bo chay|tau thoat|thao chay|vuot nguc|tron khoi|cat duoi|vung day chay|pha vay)\b/;

function detectEscapeAction(userText: string): boolean {
  const norm = normalizeForMatch(userText).replace(/\s+/g, ' ').trim();
  if (!norm) return false;
  const stripped = norm.replace(/\b(khong|dung|cho|chang)\s+(chay tron|bo chay|tron)\b/g, '');
  return ESCAPE_ACTION_RE.test(stripped);
}

const MANDATORY_DICE_PATTERNS: RegExp[] = [
  /\b(chay tron|bo chay|tau thoat|lan tron|thao chay|chay thoat|tron khoi|tron di|cat duoi|chuon)\b/,
  /\b(dot nhap|len vao|len lut|len di|an trom|trom|moc tui|cuop|nghe len|theo doi|rinh|luc soat|cay cua|pha khoa)\b/,
  /\b(tan cong|danh len|danh nhau|ra tay|ha thu|dam|chem|ne tranh|ne don|do don|chong tra|am sat|bat ngo danh)\b/,
  /\b(gia chet|gia vo|lua gat|lua doi|doa|de doa|uy hiep|dot pha|khang cu|vung day chay)\b/,
];

function detectMandatoryDiceAction(userText: string): boolean {
  const norm = normalizeForMatch(userText).replace(/\s+/g, ' ').trim();
  if (!norm) return false;
  const strippedNegations = norm.replace(
    /\b(khong|dung|cho|chang)\s+(chay tron|bo chay|tron|danh|tan cong|trom|lua|gia chet)\b/g,
    ''
  );
  return MANDATORY_DICE_PATTERNS.some((re) => re.test(strippedNegations));
}

interface ParsedStateBlock {
  dice?: { cat?: string; dc?: number; reason?: string };
  useGu?: string[];
  moveId?: string;
  move?: string;
  forcedMove?: boolean;
  mins?: number;
  act?: string;
  cultStones?: number;
  hp?: number;
  fat?: number;
  sat?: number;
  susp?: number;
  stones?: number;
  reason?: string;
  confStones?: boolean;
  confItems?: boolean;
  str?: number;
  contrib?: number;
  prog?: number;
  rank?: number;
  ap?: 'Normal' | 'Damaged' | 'Crippled';
  addItem?: string;
  addQty?: number;
  remItem?: string;
  remQty?: number;
  addGu?: string;
  vital?: boolean;
  refined?: boolean;
  feedGu?: string;
  refGu?: string;
  node?: string;
  addEff?: string;
  remEff?: string;
  npc?: string;
  att?: number;
  note?: string;
  fac?: 'clanLeader' | 'chiFaction' | 'moFaction' | 'neutral';
  facRep?: number;
  flag?: string;
  flagDesc?: string;
  rumor?: string;
  rumorTruth?: string;
  mem?: string;
}

function splitStoryAndState(rawOutput: string): { storyText: string; state: ParsedStateBlock | null } {
  const openMatch = rawOutput.match(/<STATE>/i);
  if (!openMatch || openMatch.index === undefined) {
    return { storyText: rawOutput.trim(), state: null };
  }

  const storyText = rawOutput.slice(0, openMatch.index).trim();
  const afterOpen = rawOutput.slice(openMatch.index + openMatch[0].length);
  const closeIdx = afterOpen.search(/<\/STATE>/i);
  let jsonCandidate = (closeIdx >= 0 ? afterOpen.slice(0, closeIdx) : afterOpen).trim();

  // Strip optional markdown code fences if a lightweight model wrapped the JSON
  jsonCandidate = jsonCandidate.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const firstBrace = jsonCandidate.indexOf('{');
  const lastBrace = jsonCandidate.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    jsonCandidate = jsonCandidate.slice(firstBrace, lastBrace + 1);
  }

  try {
    const parsed = JSON.parse(jsonCandidate) as unknown;
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return { storyText, state: parsed as ParsedStateBlock };
    }
  } catch {
    // Graceful fallback: reconcileTurnPhysics will still advance time & catch severe physics
  }
  return { storyText, state: null };
}

function applyResolvedMovement(
  draft: SaveState,
  db: StaticDatabase,
  details: TurnDetails,
  targetId: string,
  travelMins: number,
  forced: boolean,
  label: string
): void {
  const dest = db.locationMap.get(targetId);
  if (!dest || targetId === draft.player.locationId) return;
  draft.player.locationId = dest.locationId;
  const mins = Math.max(1, Math.round(travelMins));
  const tick = runTimeTick(draft, db, mins, forced ? 'normal' : 'move', 0);
  details.minutesPassed += tick.elapsedMinutes;
  details.changes.push(`${label} (+${tick.elapsedMinutes} phút)`);
  if (tick.rationsConsumed > 0) {
    details.changes.push(`Tự dùng ${tick.rationsConsumed} Lương khô dọc đường`);
  }
  if (tick.interruptReason) details.interrupts.push(tick.interruptReason);
}

function applyTravelPlanOnly(
  travelPlan: TravelPlan,
  draft: SaveState,
  db: StaticDatabase,
  details: TurnDetails
): void {
  if (travelPlan.blocked) {
    if (travelPlan.resolvedLocationId !== draft.player.locationId) {
      applyResolvedMovement(
        draft,
        db,
        details,
        travelPlan.resolvedLocationId,
        travelPlan.elapsedMinutes,
        false,
        `Bị chặn trên đường tới ${travelPlan.intendedDestName} → Dừng tại ${travelPlan.resolvedLocationName}`
      );
    } else if (travelPlan.blockerReason) {
      details.changes.push(`Bị chặn tại ${travelPlan.resolvedLocationName}: ${travelPlan.blockerReason}`);
    }
    return;
  }

  const routeStr =
    travelPlan.traversedSteps.length > 1
      ? `Di chuyển: ${travelPlan.traversedSteps.map((s) => s.name).join(' → ')}`
      : `Di chuyển đến ${travelPlan.resolvedLocationName}`;
  applyResolvedMovement(
    draft,
    db,
    details,
    travelPlan.resolvedLocationId,
    travelPlan.elapsedMinutes,
    false,
    routeStr
  );
}

function applyParsedStateBlock(
  state: ParsedStateBlock,
  rawRoll: number,
  draft: SaveState,
  db: StaticDatabase,
  details: TurnDetails,
  travelPlan: TravelPlan | null,
  isEscapeTurn: boolean
): void {
  // 1. Pre-rolled Action Dice verification (identical rawRoll & hidden luck!)
  if (state.dice && typeof state.dice.dc === 'number' && Number.isFinite(state.dice.dc)) {
    const cat: DiceCategory =
      state.dice.cat === 'social' || state.dice.cat === 'cultivation' ? state.dice.cat : 'physical';
    const reason =
      typeof state.dice.reason === 'string' && state.dice.reason.trim()
        ? state.dice.reason.trim()
        : 'Hành động có rủi ro';
    const res = evaluatePreRolledDice(rawRoll, state.dice.dc, cat, reason, draft.player, db);
    details.diceRolls.push(res);
  }

  // 2. Gu / Killer Move essence check
  if (Array.isArray(state.useGu) && state.useGu.length > 0) {
    const guIds = state.useGu.map(String).filter(Boolean);
    const moveId = typeof state.moveId === 'string' && state.moveId ? state.moveId : undefined;
    const res = useGuOrMove(draft, guIds, moveId, db);
    if (res.ok && res.spent > 0) {
      details.essenceSpent = Number((details.essenceSpent + res.spent).toFixed(2));
      details.changes.push(res.message);
    } else if (!res.ok) {
      details.changes.push(`⚠ ${res.message}`);
    }
  }

  // 3. Location transition (multi-hop Dijkstra + TravelPlan en-route hard clamp!)
  const rawMoveId = typeof state.move === 'string' ? state.move.trim() : '';
  const forced = Boolean(state.forcedMove);
  const escapeFailed = isEscapeTurn && details.diceRolls.some((d) => !d.success);
  const escapeSucceeded = isEscapeTurn && details.diceRolls.some((d) => d.success);

  if (forced && rawMoveId) {
    const dest = db.locationMap.get(rawMoveId);
    if (dest && rawMoveId !== draft.player.locationId) {
      const path = findShortestPath(db, draft.player.locationId, rawMoveId);
      const mins = path?.totalMinutes ?? 10;
      applyResolvedMovement(
        draft,
        db,
        details,
        dest.locationId,
        mins,
        true,
        `Chuyển tới ${dest.name} (cưỡng bức)`
      );
    }
  } else if (travelPlan && travelPlan.blocked) {
    // Hard clamp: stopped by an en-route obstacle unless escaping departure hold with a passing dice roll!
    if (travelPlan.blockerKind === 'departure_hold' && escapeSucceeded && rawMoveId) {
      const path = findShortestPath(db, draft.player.locationId, rawMoveId);
      if (path && path.steps.length > 0) {
        const routeStr =
          path.steps.length > 1
            ? `Thoát thân: ${path.steps.map((s) => s.name).join(' → ')}`
            : `Thoát thân tới ${path.steps[0].name}`;
        applyResolvedMovement(draft, db, details, rawMoveId, path.totalMinutes, false, routeStr);
      }
    } else {
      applyTravelPlanOnly(travelPlan, draft, db, details);
    }
  } else if (travelPlan && !travelPlan.blocked && !isEscapeTurn) {
    // Clear travel plan: allow an explicit intermediate stop if AI stopped early, otherwise apply exact route
    const intermediateStep =
      rawMoveId && rawMoveId !== travelPlan.resolvedLocationId
        ? travelPlan.traversedSteps.find((s) => s.locationId === rawMoveId)
        : undefined;
    if (intermediateStep) {
      const idx = travelPlan.traversedSteps.findIndex((s) => s.locationId === rawMoveId);
      const subSteps = travelPlan.traversedSteps.slice(0, idx + 1);
      const routeStr =
        subSteps.length > 1
          ? `Di chuyển: ${subSteps.map((s) => s.name).join(' → ')}`
          : `Di chuyển đến ${intermediateStep.name}`;
      applyResolvedMovement(
        draft,
        db,
        details,
        intermediateStep.locationId,
        intermediateStep.cumulativeMinutes,
        false,
        routeStr
      );
    } else {
      applyTravelPlanOnly(travelPlan, draft, db, details);
    }
  } else if (rawMoveId && !escapeFailed) {
    // Freeform move (or successful escape move): use Dijkstra so multi-hop moves always charge real time
    const path = findShortestPath(db, draft.player.locationId, rawMoveId);
    if (path && path.steps.length > 0) {
      const routeStr =
        path.steps.length > 1
          ? `Di chuyển: ${path.steps.map((s) => s.name).join(' → ')}`
          : `Di chuyển đến ${path.steps[0].name}`;
      applyResolvedMovement(draft, db, details, rawMoveId, path.totalMinutes, false, routeStr);
    }
  }

  // 4. Time tick (additional elapsed minutes beyond travel)
  if (typeof state.mins === 'number' && state.mins > 0) {
    const extraMins = Math.max(0, Math.min(10080, Math.round(state.mins)) - details.minutesPassed);
    if (extraMins > 0) {
      const validActs: ActivityKind[] = [
        'normal',
        'move',
        'cultivate',
        'rest',
        'explore',
        'combat',
        'imprisoned',
      ];
      const act: ActivityKind = validActs.includes(String(state.act) as ActivityKind)
        ? (String(state.act) as ActivityKind)
        : 'normal';
      const stones = Math.max(0, Number(state.cultStones ?? 0));

      const hpBefore = draft.player.health;
      const fatBefore = draft.player.fatigue;
      const tick = runTimeTick(draft, db, extraMins, act, stones);
      details.minutesPassed += tick.elapsedMinutes;
      if (tick.shichensPassed > 0) {
        details.changes.push(`Qua ${tick.shichensPassed} canh giờ (${tick.elapsedMinutes} phút)`);
      }
      if (draft.player.health !== hpBefore) {
        const dHp = draft.player.health - hpBefore;
        details.changes.push(`HP ${dHp > 0 ? '+' : ''}${dHp}% (còn ${draft.player.health}%)`);
      }
      if (draft.player.fatigue !== fatBefore) {
        const dFat = draft.player.fatigue - fatBefore;
        details.changes.push(`Mệt mỏi ${dFat > 0 ? '+' : ''}${dFat} (tổng ${draft.player.fatigue}/100)`);
      }
      if (tick.cultivationGained > 0) {
        details.changes.push(`Ôn dưỡng +${tick.cultivationGained}% (tổng ${draft.player.cultivationProgress}%)`);
      }
      if (tick.essenceRecovered > 0) {
        details.changes.push(`Hồi +${tick.essenceRecovered} thành chân nguyên`);
      }
      if (tick.rationsConsumed > 0) {
        details.changes.push(`Tự dùng ${tick.rationsConsumed} Lương khô dọc đường`);
      }
      for (const ev of tick.triggeredEvents) {
        details.changes.push(`Sự kiện: ${ev}`);
      }
      if (tick.interruptReason) details.interrupts.push(tick.interruptReason);
    }
  }

  // 5. Flat state updates (with ALL hard anti-exploit locks in engine.ts!)
  const flat: FlatStateUpdate = {
    healthDelta: typeof state.hp === 'number' ? state.hp : undefined,
    fatigueDelta: typeof state.fat === 'number' ? state.fat : undefined,
    satietyDelta: typeof state.sat === 'number' ? state.sat : undefined,
    suspicionDelta: typeof state.susp === 'number' ? state.susp : undefined,
    primevalStonesDelta: typeof state.stones === 'number' ? state.stones : undefined,
    changeReason: typeof state.reason === 'string' ? state.reason : undefined,
    confiscateAllStones: Boolean(state.confStones),
    confiscateItems: Boolean(state.confItems),
    strengthDelta: typeof state.str === 'number' ? state.str : undefined,
    clanContributionDelta: typeof state.contrib === 'number' ? state.contrib : undefined,
    cultivationProgressDelta: typeof state.prog === 'number' ? state.prog : undefined,
    rankDelta: typeof state.rank === 'number' ? state.rank : undefined,
    apertureStatus: state.ap,
    addItemId: typeof state.addItem === 'string' ? state.addItem : undefined,
    addItemQuantity: typeof state.addQty === 'number' ? state.addQty : state.addItem ? 1 : undefined,
    removeItemId: typeof state.remItem === 'string' ? state.remItem : undefined,
    removeItemQuantity: typeof state.remQty === 'number' ? state.remQty : state.remItem ? 1 : undefined,
    addGuId: typeof state.addGu === 'string' ? state.addGu : undefined,
    addGuIsVital: typeof state.vital === 'boolean' ? state.vital : undefined,
    addGuIsRefined: typeof state.refined === 'boolean' ? state.refined : undefined,
    feedGuId: typeof state.feedGu === 'string' ? state.feedGu : undefined,
    refineGuId: typeof state.refGu === 'string' ? state.refGu : undefined,
    takeNodeId: typeof state.node === 'string' ? state.node : undefined,
    addStatusEffectId: typeof state.addEff === 'string' ? state.addEff : undefined,
    removeStatusEffectId: typeof state.remEff === 'string' ? state.remEff : undefined,
    npcId: typeof state.npc === 'string' ? state.npc : undefined,
    npcAttitudeDelta: typeof state.att === 'number' ? state.att : undefined,
    npcPrivateNote: typeof state.note === 'string' ? state.note : undefined,
    factionId: state.fac,
    factionRepDelta: typeof state.facRep === 'number' ? state.facRep : undefined,
    addFlagId: typeof state.flag === 'string' ? state.flag : undefined,
    addFlagDescription: typeof state.flagDesc === 'string' ? state.flagDesc : undefined,
    rumorContent: typeof state.rumor === 'string' ? state.rumor : undefined,
    rumorTruthNote: typeof state.rumorTruth === 'string' ? state.rumorTruth : undefined,
    memorySummary: typeof state.mem === 'string' ? state.mem : undefined,
  };

  const updRes = applyFlatStateUpdate(draft, flat, db);
  details.changes.push(...updRes.changes);
  if (updRes.warnings.length > 0) {
    details.changes.push(...updRes.warnings.map((w) => `⚠ ${w}`));
  }
}

const INJURY_PROSE_PATTERN =
  /(mau tuoi|trao mau|hoc mau|phun.*mau|trung don|danh manh|bi danh|dau nhuc|rach toac|gay xuong|gay.*chan|bi thuong|chan thuong|toi sam mat may|nga guc|dam vao|chem trung|quet trung|dap manh|de gi xuong)/;

const SEVERE_INJURY_PATTERN =
  /(gay xuong|gay hai chan|hoc mau|phun.*mau tuoi|bat tinh|chim vao bong toi|don roi tan khoc|tra tan|trong thuong|thoi thop|da thang vao bung)/;

const HARDSHIP_STARVATION_PATTERN =
  /(khong mot giot nuoc|khong mot hat com|doi khat|vat kiet.*sinh luc|thuy lao|giam cam|bo doi|kiet suc|nguc toi|tu giam)/;

const DIRECT_BLOW_PATTERN =
  /(dap manh.*cuoc|danh manh|tung.*cuoc|tung.*quyen|trung don|mau tuoi trao|phun.*mau|nga guc xuong)/;

/**
 * Code-level safety net so time, fatigue, and HP never silently freeze
 * or stay unrealistically mild compared to brutal consequences narrated in prose.
 */
function reconcileTurnPhysics(
  beforeSave: SaveState,
  draft: SaveState,
  db: StaticDatabase,
  details: TurnDetails,
  fullText: string
): void {
  const hasDice = details.diceRolls.length > 0;
  const failedRolls = details.diceRolls.filter((d) => !d.success);
  const worstMargin = failedRolls.reduce((min, d) => Math.min(min, d.margin), 0);

  if (details.minutesPassed === 0) {
    const fallbackMins = hasDice ? 5 : 3;
    const fallbackAct: ActivityKind = hasDice ? 'explore' : 'normal';
    const tick = runTimeTick(draft, db, fallbackMins, fallbackAct, 0);
    details.minutesPassed += tick.elapsedMinutes;
    if (tick.interruptReason) details.interrupts.push(tick.interruptReason);
  }

  const normProse = normalizeForMatch(fullText);

  const hasHardship = HARDSHIP_STARVATION_PATTERN.test(normProse);
  if (hasHardship && draft.player.fatigue <= beforeSave.player.fatigue + 10) {
    const prev = draft.player.fatigue;
    const targetFat = Math.min(95, Math.max(prev + 35, 75));
    draft.player.fatigue = targetFat;
    if (draft.player.fatigue !== prev) {
      details.changes.push(`Mệt mỏi +${draft.player.fatigue - prev} (tổng ${draft.player.fatigue}/100) — Giam cầm/đói khát`);
    }
  } else if (hasDice && draft.player.fatigue <= beforeSave.player.fatigue) {
    const fAdd =
      failedRolls.length === 0
        ? 3
        : worstMargin <= -30 || failedRolls.some((d) => d.isCritFail)
          ? 10
          : 6;
    const prev = draft.player.fatigue;
    draft.player.fatigue = Math.min(100, prev + fAdd);
    if (draft.player.fatigue !== prev) {
      details.changes.push(`Mệt mỏi +${draft.player.fatigue - prev} (tổng ${draft.player.fatigue}/100)`);
    }
  }

  const hpLostSoFar = beforeSave.player.health - draft.player.health;

  if (SEVERE_INJURY_PATTERN.test(normProse)) {
    const minSevereLoss = 35;
    if (hpLostSoFar < minSevereLoss) {
      const extraDmg = minSevereLoss - Math.max(0, hpLostSoFar);
      draft.player.health = Math.max(0, draft.player.health - extraDmg);
      details.changes.push(
        `HP -${extraDmg}% bổ sung (còn ${draft.player.health}%) — Trọng thương thực tế`
      );
    }
    if (!draft.player.statusEffects.some((e) => e.effectId === 'eff_trong_thuong')) {
      const tmpl = db.rules.statusEffectTemplates.find((t) => t.effectId === 'eff_trong_thuong');
      if (tmpl) {
        draft.player.statusEffects.push({ ...tmpl });
        details.changes.push(`Trạng thái: +${tmpl.name}`);
      }
    }
  } else if (hasHardship) {
    if (hpLostSoFar < 20 && draft.player.health > 5) {
      const extraDmg = Math.min(draft.player.health - 5, 25 - Math.max(0, hpLostSoFar));
      if (extraDmg > 0) {
        draft.player.health -= extraDmg;
        details.changes.push(
          `HP -${extraDmg}% (còn ${draft.player.health}%) — Đói khát/giam cầm suy kiệt`
        );
      }
    }
    if (
      /(doi khat|khong mot giot nuoc|khong mot hat com|bo doi)/.test(normProse) &&
      !draft.player.statusEffects.some((e) => e.effectId === 'eff_doi_khat')
    ) {
      const tmpl = db.rules.statusEffectTemplates.find((t) => t.effectId === 'eff_doi_khat');
      if (tmpl) {
        draft.player.statusEffects.push({ ...tmpl });
        details.changes.push(`Trạng thái: +${tmpl.name}`);
      }
    }
  } else if (failedRolls.length > 0 && hpLostSoFar <= 0 && INJURY_PROSE_PATTERN.test(normProse)) {
    const dmg =
      worstMargin <= -40 || failedRolls.some((d) => d.isCritFail)
        ? 25
        : worstMargin <= -20
          ? 18
          : 12;
    draft.player.health = Math.max(0, draft.player.health - dmg);
    details.changes.push(`HP -${dmg}% (còn ${draft.player.health}%) — Thương tích trong lượt`);
  } else if (hpLostSoFar <= 0 && DIRECT_BLOW_PATTERN.test(normProse)) {
    const dmg = 15;
    draft.player.health = Math.max(0, draft.player.health - dmg);
    details.changes.push(`HP -${dmg}% (còn ${draft.player.health}%) — Bị đánh trong lượt`);
  }

  checkEndings(draft, db);
}

export interface RunTurnParams {
  apiKey: string;
  model: string;
  db: StaticDatabase;
  save: SaveState;
  history: ChatMessage[];
  userText: string;
  onStatus?: (status: string) => void;
  onChunk?: (piece: string) => void;
}

export interface RunTurnResult {
  nextSave: SaveState;
  fullText: string;
  details: TurnDetails;
}

/**
 * Single-Call <STATE> + Pre-Rolled 3-Category Action Dice + Encounter Dice Engine.
 * Cuts token usage by ~75–85% (1 API call instead of 2–4 Function Calling rounds)
 * while running 100% real deterministic rules on `draft` with transactional rollback!
 */
export async function runGeminiGameTurn(params: RunTurnParams): Promise<RunTurnResult> {
  const { apiKey, model, db, save, history, userText, onStatus, onChunk } = params;
  const draft: SaveState = structuredClone(save);
  const ai = createAiClient(apiKey);

  // Pre-roll fresh 1–100 action dice locally (hidden luck + category modifiers pre-computed!)
  const rawRoll = Math.floor(Math.random() * 100) + 1;
  const diceSheet = buildPreRolledDiceSheet(rawRoll, draft.player, db);
  const forceDice = detectMandatoryDiceAction(userText);
  const isEscapeTurn = detectEscapeAction(userText);
  // Step-by-step en-route pathfinding & obstacle dice simulation (breaks immediately at first obstacle!)
  const travelPlan = simulateTravelPlan(db, draft, userText);

  const usage: TokenUsage = {
    promptTokens: 0,
    outputTokens: 0,
    thoughtTokens: 0,
    cachedTokens: 0,
    totalTokens: 0,
    apiCalls: 0,
  };

  const details: TurnDetails = {
    model,
    diceRolls: [],
    essenceSpent: 0,
    minutesPassed: 0,
    interrupts: [],
    changes: [],
    usage,
  };

  // Compact 4-message recent history (2 turns + memoryLog/worldFlags/notableRelations in CONTEXT)
  const recentHistory: Content[] = history.slice(-4).map((m) => ({
    role: m.role,
    parts: [{ text: m.text }],
  }));

  const liveCtx = buildLiveContext(db, draft, userText, travelPlan, isEscapeTurn);
  const mandatoryHint = forceDice
    ? ' LƯỢT NÀY BẮT BUỘC DÙNG [XÚC XẮC] VÀ GHI "dice" VÀO <STATE>!'
    : '';
  const travelStopHint = travelPlan?.blocked
    ? ` ĐANG BỊ CHẶN TẠI ${travelPlan.resolvedLocationName} — BẮT BUỘC DỪNG LƯỢT NGAY TẠI ĐÓ, CẤM TỰ VIẾT PC ĐI TIẾP TỚI ${travelPlan.intendedDestName}!`
    : '';

  const contents: Content[] = [
    ...recentHistory,
    {
      role: 'user',
      parts: [
        {
          text: `[CONTEXT]\n${liveCtx}\n[XÚC XẮC]\n${diceSheet}\n[LUẬT] Giữ ngôi 2 "ngươi"; không viết lời/suy nghĩ/hành động thay PC; chống god-moding; cấm chưởng phong/kình phong cho CẢ PC & NPC nếu không dùng Cổ trùng; cuối lượt BẮT BUỘC có 1 dòng <STATE>{...}</STATE>.${mandatoryHint}${travelStopHint}\n[HÀNH ĐỘNG]\n${userText}`,
        },
      ],
    },
  ];

  const isTransient503 = (err: unknown): boolean => {
    const m = err instanceof Error ? err.message : String(err);
    return m.includes('503') || m.includes('UNAVAILABLE') || m.toLowerCase().includes('high demand');
  };

  let rawOutput = '';
  let emittedLen = 0;
  let stateStarted = false;
  let roundUsage: GenerateContentResponseUsageMetadata | undefined;

  for (let attempt = 0; attempt <= 2; attempt++) {
    rawOutput = '';
    emittedLen = 0;
    stateStarted = false;
    roundUsage = undefined;
    let streamedVisibleThisAttempt = false;

    onStatus?.(
      attempt > 0
        ? `Máy chủ Google tạm quá tải (503), đang tự thử lại (${attempt}/2)...`
        : 'Quản trò đang dẫn truyện...'
    );

    try {
      const stream = await ai.models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction: defaultStoryPrompt,
          safetySettings: SAFETY_SETTINGS,
          temperature: 0.75,
        },
      });

      for await (const chunk of stream) {
        if (chunk.usageMetadata) {
          roundUsage = chunk.usageMetadata;
        }
        const candidateParts = chunk.candidates?.[0]?.content?.parts ?? [];
        for (const p of candidateParts) {
          if (p.text && !(p as { thought?: boolean }).thought) {
            rawOutput += p.text;
            if (!stateStarted) {
              const stateIdx = rawOutput.search(/<STATE/i);
              if (stateIdx >= 0) {
                stateStarted = true;
                if (stateIdx > emittedLen) {
                  const cleanSlice = rawOutput.slice(emittedLen, stateIdx);
                  if (cleanSlice) {
                    streamedVisibleThisAttempt = true;
                    onChunk?.(cleanSlice);
                  }
                  emittedLen = stateIdx;
                }
              } else {
                // Hold back 8 chars so a split "<STATE>" tag never flashes on screen
                const safeEnd = Math.max(emittedLen, rawOutput.length - 8);
                if (safeEnd > emittedLen) {
                  const cleanSlice = rawOutput.slice(emittedLen, safeEnd);
                  if (cleanSlice) {
                    streamedVisibleThisAttempt = true;
                    onChunk?.(cleanSlice);
                  }
                  emittedLen = safeEnd;
                }
              }
            }
          }
        }
      }
      break;
    } catch (err) {
      if (attempt < 2 && !streamedVisibleThisAttempt && isTransient503(err)) {
        await new Promise((r) => setTimeout(r, (attempt + 1) * 2000));
        continue;
      }
      throw err;
    }
  }

  usage.apiCalls = 1;
  if (roundUsage) {
    const pTok = roundUsage.promptTokenCount ?? 0;
    const oTok = roundUsage.candidatesTokenCount ?? 0;
    const tTok = roundUsage.thoughtsTokenCount ?? 0;
    const cTok = roundUsage.cachedContentTokenCount ?? 0;
    const totTok = roundUsage.totalTokenCount ?? pTok + oTok + tTok;
    usage.promptTokens = pTok;
    usage.outputTokens = oTok;
    usage.thoughtTokens = tTok;
    usage.cachedTokens = cTok;
    usage.totalTokens = totTok;
  }

  const { storyText, state } = splitStoryAndState(rawOutput);
  if (!storyText.trim()) {
    throw new Error('Gemini trả về phản hồi rỗng. Hãy bấm Thử lại.');
  }

  // Flush any remaining held-back story characters before <STATE>
  if (!stateStarted && storyText.length > emittedLen) {
    onChunk?.(storyText.slice(emittedLen));
  }

  if (state) {
    applyParsedStateBlock(state, rawRoll, draft, db, details, travelPlan, isEscapeTurn);
  } else {
    if (forceDice) {
      // Safety fallback if a lite model omitted <STATE> completely on a mandatory dice turn
      details.diceRolls.push(
        evaluatePreRolledDice(rawRoll, 65, 'physical', 'Phán định hành động rủi ro', draft.player, db)
      );
    }
    if (travelPlan && !isEscapeTurn) {
      applyTravelPlanOnly(travelPlan, draft, db, details);
    }
  }

  reconcileTurnPhysics(save, draft, db, details, storyText);
  draft.turnCount += 1;
  draft.updatedAt = new Date().toISOString();

  return {
    nextSave: draft,
    fullText: storyText,
    details,
  };
}
