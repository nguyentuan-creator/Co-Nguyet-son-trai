import type {
  ActiveRumor,
  DiceCategory,
  DiceSummary,
  EssenceCost,
  Player,
  SaveState,
  Season,
  StaticDatabase,
  TimeOfDay,
  WorldEffect,
} from './types';
import { resolveLocation, resolveObligations, resolveTimelineEvents } from './db';

export type ActivityKind = 'normal' | 'move' | 'cultivate' | 'rest' | 'explore' | 'combat' | 'imprisoned';

export function getMaxEssence(aptitude: number): number {
  return Number((aptitude / 10).toFixed(1));
}

export function getPlayerSatiety(player: Player): number {
  return typeof player.satiety === 'number' && Number.isFinite(player.satiety)
    ? Math.max(0, Math.min(100, Math.round(player.satiety)))
    : 100;
}

export function getPlayerSuspicion(player: Player): number {
  return typeof player.suspicion === 'number' && Number.isFinite(player.suspicion)
    ? Math.max(0, Math.min(100, Math.round(player.suspicion)))
    : 0;
}

export function getInventoryUsedSpace(save: SaveState, db: StaticDatabase): number {
  let total = 0;
  for (const it of save.player.inventory.items) {
    total += (db.itemMap.get(it.itemId)?.size ?? 1) * it.quantity;
  }
  return Number(total.toFixed(2));
}

export function deriveTimeOfDay(shichen: number): TimeOfDay {
  if (shichen >= 4 && shichen <= 6) return 'Morning';
  if (shichen === 7) return 'Noon';
  if (shichen >= 8 && shichen <= 9) return 'Afternoon';
  if (shichen === 10) return 'Evening';
  return 'Night';
}

export function deriveSeason(day: number, db: StaticDatabase): Season {
  const r = db.rules.time.seasonDayRanges;
  if (day <= r.Spring[1]) return 'Spring';
  if (day <= r.Summer[1]) return 'Summer';
  if (day <= r.Autumn[1]) return 'Autumn';
  return 'Winter';
}

// === 1. DICE 100 (3 distinct action categories + hidden luck + body/suspicion modifiers) ===
function computeCategoryPenalty(
  category: DiceCategory,
  player: Player,
  db: StaticDatabase
): number {
  const rules = db.rules.dice;
  const suspicion = getPlayerSuspicion(player);

  if (category === 'social') {
    let fatMod = 0;
    if (player.fatigue >= 90) fatMod = Math.round(rules.fatiguePenalty90 * 0.6);
    else if (player.fatigue >= 70) fatMod = Math.round(rules.fatiguePenalty70 * 0.5);

    const statusMod = player.statusEffects
      .filter((e) => e.effectId === 'eff_trong_thuong' || e.effectId === 'eff_kiet_suc')
      .reduce((s, e) => s + Math.round(Math.max(0, e.dcPenalty) * 0.6), 0);

    const suspMod = suspicion >= 80 ? 20 : suspicion >= 60 ? 12 : suspicion >= 40 ? 5 : 0;
    return fatMod + statusMod + suspMod;
  }

  if (category === 'cultivation') {
    let fatMod = 0;
    if (player.fatigue >= 90) fatMod = rules.fatiguePenalty90;
    else if (player.fatigue >= 70) fatMod = rules.fatiguePenalty70;

    const apMod = player.apertureStatus === 'Damaged' ? 15 : 0;
    const statusMod = player.statusEffects
      .filter(
        (e) =>
          e.effectId === 'eff_chan_thuong_khong_khieu' ||
          e.effectId === 'eff_ban_menh_phan_phe' ||
          e.effectId === 'eff_doi_khat' ||
          e.effectId === 'eff_kiet_suc'
      )
      .reduce((s, e) => s + Math.max(0, e.dcPenalty), 0);
    return fatMod + apMod + statusMod;
  }

  // 'physical' (combat / escape / stealth / break-in)
  let fatMod = 0;
  if (player.fatigue >= 90) fatMod = rules.fatiguePenalty90;
  else if (player.fatigue >= 70) fatMod = rules.fatiguePenalty70;

  const statusMod = player.statusEffects.reduce((s, e) => s + Math.max(0, e.dcPenalty), 0);
  const strBonus = player.strength >= 0.8 ? -Math.min(15, Math.floor((player.strength - 0.3) * 10)) : 0;
  return fatMod + statusMod + strBonus;
}

export function evaluatePreRolledDice(
  rawRoll: number,
  baseDC: number,
  category: DiceCategory,
  reason: string,
  player: Player,
  db: StaticDatabase
): DiceSummary {
  const rules = db.rules.dice;
  const roll = Math.max(1, Math.min(100, Math.round(rawRoll)));
  const safeBase = Math.max(1, Math.min(100, Math.round(baseDC)));
  const rawLuckMod = Math.round(-player.luck / rules.luckDivisor);
  const luckMod = Math.max(-rules.maxLuckModifier, Math.min(rules.maxLuckModifier, rawLuckMod));
  const catPenalty = computeCategoryPenalty(category, player, db);

  // "Bất khả thi" (baseDC = 100) cannot be lowered below 100 by positive hidden luck,
  // while fatigue/injury/bad luck can push targetDC above 100 (up to 120).
  const minDc = safeBase >= 100 ? 100 : 1;
  const targetDC = Math.max(minDc, Math.min(120, safeBase + luckMod + catPenalty));

  const margin = roll - targetDC;
  const isCritSuccess = roll === 100;
  const isCritFail = roll === 1;
  // If targetDC > 100, even rolling 100 fails the feat (only softens the worst outcome).
  const success = isCritFail ? false : targetDC > 100 ? false : isCritSuccess ? true : margin >= 0;

  return { roll, targetDC, margin, success, isCritSuccess, isCritFail, reason, category };
}

/**
 * Builds an ultra-compact 3-line pre-rolled action dice sheet for 1-Call GM resolution.
 * Never reveals hidden `luck` or raw modifiers — only the exact pass/fail threshold per action type!
 */
export function buildPreRolledDiceSheet(
  rawRoll: number,
  player: Player,
  db: StaticDatabase
): string {
  const cats: Array<{ key: DiceCategory; label: string }> = [
    { key: 'physical', label: 'physical(đánh/chạy/lén/đột nhập)' },
    { key: 'social', label: 'social(lừa/thuyết phục/dò tin)' },
    { key: 'cultivation', label: 'cultivation(tu luyện/luyện cổ/đột phá)' },
  ];

  const lines = cats.map(({ key, label }) => {
    let maxPassingDc = 0;
    for (let dc = 1; dc <= 99; dc++) {
      if (evaluatePreRolledDice(rawRoll, dc, key, '', player, db).success) {
        maxPassingDc = dc;
      }
    }
    const res100 = evaluatePreRolledDice(rawRoll, 100, key, '', player, db);
    const critNote =
      rawRoll === 1
        ? ' [BIẾN CỐ 1: luôn TRƯỢT nặng]'
        : rawRoll === 100
          ? res100.success
            ? ' [KỲ TÍCH 100: ĐẠT cả DC 100]'
            : ' [THOÁT HIỂM 100: DC 100 vẫn TRƯỢT nhưng tránh chết ngay]'
          : '';
    const dc100Str = res100.success ? '100:ĐẠT' : '100:TRƯỢT';
    const ruleStr =
      maxPassingDc <= 0
        ? `Mọi DC đều TRƯỢT (${dc100Str})`
        : `ĐẠT nếu baseDC<=${maxPassingDc}, TRƯỢT nếu >${maxPassingDc} (${dc100Str})`;
    return `- ${label}: ${ruleStr}${critNote}`;
  });

  return lines.join('\n');
}

export function rollDice100(
  baseDC: number,
  reason: string,
  player: Player,
  db: StaticDatabase,
  category: DiceCategory = 'physical'
): DiceSummary {
  const roll = Math.floor(Math.random() * 100) + 1;
  return evaluatePreRolledDice(roll, baseDC, category, reason, player, db);
}

// === 2. ESSENCE CALC ===
export function calculateEffectiveEssenceCost(
  cost: EssenceCost,
  userMinorRank: number,
  db: StaticDatabase
): number {
  if (cost.amount <= 0) return 0;
  if (userMinorRank <= 0) return Infinity;
  const rules = db.rules.essence;
  const userTier = Math.ceil(userMinorRank / 4);
  const baseTier = Math.ceil(cost.baseRank / 4);
  let mult = 1;

  if (userTier === baseTier) {
    const diff = userMinorRank - cost.baseRank;
    if (diff > 0) mult = Math.max(rules.sameTierMinMultiplier, 1 - diff * rules.sameTierHigherDiscount);
    else if (diff < 0) mult = 1 + Math.abs(diff) * rules.sameTierLowerPenalty;
  } else if (userTier > baseTier) {
    mult = Math.pow(rules.crossTierHigherFactor, userTier - baseTier);
  } else {
    mult = Math.pow(rules.crossTierLowerFactor, baseTier - userTier);
  }
  return Number((cost.amount * mult).toFixed(2));
}

export function useGuOrMove(
  save: SaveState,
  guIds: string[],
  moveId: string | undefined,
  db: StaticDatabase
): { ok: boolean; spent: number; message: string } {
  const player = save.player;
  let totalCost = 0;

  if (moveId) {
    const move = db.moveMap.get(moveId);
    if (!move) return { ok: false, spent: 0, message: `Không tồn tại sát chiêu ${moveId}.` };
    for (const gid of [move.coreGuId, ...move.supportGuIds]) {
      const owned = player.ownedGu.find((g) => g.guId === gid);
      if (!owned) return { ok: false, spent: 0, message: `Thiếu cổ trùng ${gid} cho sát chiêu ${move.name}.` };
      if (!owned.isRefined) return { ok: false, spent: 0, message: `Cổ trùng ${gid} chưa luyện hóa.` };
    }
    totalCost = calculateEffectiveEssenceCost(move.essenceCost, player.rank, db);
  } else {
    for (const gid of guIds) {
      const def = db.guMap.get(gid);
      const owned = player.ownedGu.find((g) => g.guId === gid);
      if (!def || !owned) {
        return { ok: false, spent: 0, message: `Nhân vật không sở hữu cổ trùng ${gid}.` };
      }
      if (!owned.isRefined) {
        return { ok: false, spent: 0, message: `${def.name} chưa được luyện hóa nên chưa thể thúc giục.` };
      }
      totalCost += calculateEffectiveEssenceCost(def.essenceCost, player.rank, db);
    }
  }

  totalCost = Number(totalCost.toFixed(2));
  if (player.currentEssence + 1e-6 < totalCost) {
    return {
      ok: false,
      spent: 0,
      message: `Không đủ chân nguyên (cần ${totalCost} thành, hiện chỉ còn ${player.currentEssence} thành).`,
    };
  }

  player.currentEssence = Math.max(0, Number((player.currentEssence - totalCost).toFixed(2)));
  return {
    ok: true,
    spent: totalCost,
    message: `Đã tiêu hao ${totalCost} thành chân nguyên (còn ${player.currentEssence} thành).`,
  };
}

// === 3. RUMORS ===
export function tickRumorsDaily(save: SaveState, db: StaticDatabase): void {
  const threshold = db.rules.time.rumorCrystallizeThreshold;
  const decay = db.rules.time.rumorDecayPerDay;

  for (const r of save.worldState.activeRumors) {
    const age = save.worldState.currentDay - r.createdDay;
    r.spreadLevel = age <= 7 ? Math.min(100, r.spreadLevel + 8) : Math.max(0, r.spreadLevel - decay);

    if (r.spreadLevel >= threshold && r.involvedIds.includes('player')) {
      const reg = save.player.publicImage.regionRep.find((x) => x.regionName === r.regionName);
      if (reg) {
        if (!reg.publicBio.includes(r.content)) {
          reg.publicBio = `${reg.publicBio} ${r.content}`.trim();
          reg.rep = Math.min(100, reg.rep + 5);
        }
      } else {
        save.player.publicImage.regionRep.push({
          regionTier: 'Clan',
          regionName: r.regionName,
          publicBio: r.content,
          rep: 15,
        });
      }
    }
  }
  save.worldState.activeRumors = save.worldState.activeRumors.filter((r) => r.spreadLevel > 0);
}

export function getRumorsKnownByNpc(
  save: SaveState,
  npcId: string,
  regionName: string
): ActiveRumor[] {
  const known: ActiveRumor[] = [];
  for (const r of save.worldState.activeRumors) {
    if (r.knownByNpcIds.includes(npcId)) {
      known.push(r);
      continue;
    }
    const chance = r.regionName === regionName ? r.spreadLevel / 100 : (r.spreadLevel / 100) * 0.25;
    if (Math.random() < chance) {
      r.knownByNpcIds.push(npcId);
      known.push(r);
    }
  }
  return known;
}

// === 4. TIME TICK (minutes -> 120-min shichen + 3 interrupt groups) ===
function evaluateCondition(save: SaveState, condition: string | null): boolean {
  if (!condition) return true;
  const c = condition.trim();
  if (c.startsWith('!')) return !save.worldState.worldFlags.some((f) => f.flagId === c.slice(1));
  return save.worldState.worldFlags.some((f) => f.flagId === c);
}

function applyWorldEffect(save: SaveState, db: StaticDatabase, eff: WorldEffect): void {
  if (eff.type === 'setFlag' && eff.flagId) {
    if (!save.worldState.worldFlags.some((f) => f.flagId === eff.flagId)) {
      save.worldState.worldFlags.push({
        flagId: eff.flagId,
        description: eff.description ?? eff.flagId,
        createdDay: save.worldState.currentDay,
      });
    }
  } else if (eff.type === 'takeNode' && eff.nodeId) {
    if (!save.nodeStates[eff.nodeId]?.isTaken) {
      save.nodeStates[eff.nodeId] = { isTaken: true, takenBy: eff.takenBy ?? null, respawnAtDay: null };
    }
  } else if (eff.type === 'giveNpcGu' && eff.npcId && eff.guId) {
    const base = db.npcMap.get(eff.npcId);
    if (!base) return;
    const prev = save.npcStates[eff.npcId] ?? {};
    const list = [...(prev.ownedGu ?? base.ownedGu)];
    if (!list.some((g) => g.guId === eff.guId)) {
      list.push({ guId: eff.guId, isVital: list.length === 0 });
    }
    save.npcStates[eff.npcId] = { ...prev, ownedGu: list };
  } else if (eff.type === 'setNpcStatus' && eff.npcId && eff.status) {
    const prev = save.npcStates[eff.npcId] ?? {};
    save.npcStates[eff.npcId] = {
      ...prev,
      status: eff.status,
      health: eff.status === 'Dead' ? 0 : prev.health,
    };
  } else if (eff.type === 'setNpcRank' && eff.npcId && typeof eff.rank === 'number') {
    const prev = save.npcStates[eff.npcId] ?? {};
    save.npcStates[eff.npcId] = { ...prev, rank: eff.rank };
  }
}

export interface TimeTickResult {
  elapsedMinutes: number;
  shichensPassed: number;
  essenceRecovered: number;
  cultivationGained: number;
  rationsConsumed: number;
  triggeredEvents: string[];
  interruptReason: string | null;
}

export function runTimeTick(
  save: SaveState,
  db: StaticDatabase,
  durationMinutes: number,
  activity: ActivityKind = 'normal',
  useStonesForCultivation = 0
): TimeTickResult {
  const minsPerShichen = db.rules.time.minutesPerShichen;
  let remaining = Math.max(0, Math.round(durationMinutes));
  let elapsedMinutes = 0;
  let shichensPassed = 0;
  let essenceRecovered = 0;
  let cultivationGained = 0;
  let rationsConsumed = 0;
  let stonesLeft = Math.max(0, Math.floor(useStonesForCultivation));
  const triggeredEvents: string[] = [];
  let interruptReason: string | null = null;
  save.player.satiety = getPlayerSatiety(save.player);

  const fatiguePerShichen = (act: ActivityKind): number =>
    act === 'rest'
      ? -18
      : act === 'cultivate'
        ? 6
        : act === 'imprisoned'
          ? 6
          : act === 'move'
            ? 8
            : act === 'explore'
              ? 10
              : act === 'combat'
                ? 12
                : 3;

  while (remaining > 0) {
    const untilNext = minsPerShichen - save.worldState.currentTime;
    if (remaining < untilNext) {
      const ratio = remaining / minsPerShichen;
      save.worldState.currentTime += remaining;
      elapsedMinutes += remaining;

      // Apply proportional fatigue for sub-shichen exertion/rest so short actions still feel real
      const fRate = fatiguePerShichen(activity);
      let subFatigue = Math.round(fRate * ratio);
      if (subFatigue === 0 && remaining >= 5) {
        if (activity === 'combat' || activity === 'explore' || activity === 'move') subFatigue = 1;
        else if (activity === 'rest' && remaining >= 10) subFatigue = -1;
      }
      if (subFatigue !== 0) {
        save.player.fatigue = Math.max(0, Math.min(100, save.player.fatigue + subFatigue));
      }
      if (remaining >= 15) {
        const curLocSub = resolveLocation(db, save, save.player.locationId);
        const inSafeCamp = curLocSub?.regionName === 'Cổ Nguyệt Sơn Trại' && activity !== 'imprisoned';
        const satRate = inSafeCamp ? 4 : activity === 'combat' ? 12 : activity === 'imprisoned' ? 10 : 9;
        const subSat = Math.max(1, Math.round(satRate * ratio));
        save.player.satiety = Math.max(0, getPlayerSatiety(save.player) - subSat);
      }

      // Apply proportional essence/cultivation if meditating/resting for >= 15 minutes
      if (remaining >= 15 && (activity === 'cultivate' || activity === 'rest')) {
        const maxEss = getMaxEssence(save.player.aptitude);
        const gainEss = maxEss * db.rules.essence.naturalRegenFractionPerShichen * ratio;
        const beforeEss = save.player.currentEssence;
        save.player.currentEssence = Math.min(maxEss, Number((save.player.currentEssence + gainEss).toFixed(2)));
        essenceRecovered += Number((save.player.currentEssence - beforeEss).toFixed(2));

        if (activity === 'cultivate' && save.player.cultivationProgress < 100) {
          const hasWineWorm = save.player.ownedGu.some((g) => g.guId === 'gu_tuu_trung' && g.isRefined);
          const gain = Number(
            (
              db.rules.cultivation.baseProgressPerShichen *
              ratio *
              (save.player.aptitude / 50) *
              (hasWineWorm ? db.rules.cultivation.wineWormMultiplier : 1)
            ).toFixed(1)
          );
          const prevProg = save.player.cultivationProgress;
          save.player.cultivationProgress = Math.min(100, Number((save.player.cultivationProgress + gain).toFixed(1)));
          cultivationGained += Number((save.player.cultivationProgress - prevProg).toFixed(1));
        }
      }

      remaining = 0;
      break;
    }

    remaining -= untilNext;
    elapsedMinutes += untilNext;
    save.worldState.currentTime = 0;
    shichensPassed += 1;

    let dayAdvanced = false;
    save.worldState.currentShichen += 1;
    if (save.worldState.currentShichen > db.rules.time.shichensPerDay) {
      save.worldState.currentShichen = 1;
      save.worldState.currentDay += 1;
      dayAdvanced = true;
    }
    save.worldState.timeOfDay = deriveTimeOfDay(save.worldState.currentShichen);
    save.worldState.season = deriveSeason(save.worldState.currentDay, db);

    // Fatigue, Satiety (hybrid: auto clan meal inside camp, auto ration consumption in wilderness) & Imprisoned hardship
    const fDelta = fatiguePerShichen(activity);
    save.player.fatigue = Math.max(0, Math.min(100, save.player.fatigue + fDelta));
    const curLocTick = resolveLocation(db, save, save.player.locationId);
    const inSafeCamp = curLocTick?.regionName === 'Cổ Nguyệt Sơn Trại' && activity !== 'imprisoned';
    const satDrain = inSafeCamp ? 4 : activity === 'combat' ? 12 : activity === 'imprisoned' ? 10 : 9;
    let nextSat = Math.max(0, getPlayerSatiety(save.player) - satDrain);

    if (inSafeCamp && nextSat <= 35) {
      // Auto-eat dorm/clan meal while safely inside Cổ Nguyệt Sơn Trại
      nextSat = 90;
      save.player.statusEffects = save.player.statusEffects.filter((e) => e.effectId !== 'eff_doi_khat');
    } else if (!inSafeCamp && activity !== 'imprisoned' && nextSat <= 30) {
      // Automatically eat 1 Lương khô from inventory during multi-shichen wilderness trips
      const ration = save.player.inventory.items.find((i) => i.itemId === 'item_luong_kho' && i.quantity > 0);
      if (ration) {
        ration.quantity -= 1;
        save.player.inventory.items = save.player.inventory.items.filter((i) => i.quantity > 0);
        rationsConsumed += 1;
        nextSat = Math.min(100, nextSat + 55);
        save.player.statusEffects = save.player.statusEffects.filter((e) => e.effectId !== 'eff_doi_khat');
      }
    }
    save.player.satiety = nextSat;

    if (nextSat <= 20 && !save.player.statusEffects.some((e) => e.effectId === 'eff_doi_khat')) {
      const tmpl = db.rules.statusEffectTemplates.find((t) => t.effectId === 'eff_doi_khat');
      if (tmpl) save.player.statusEffects.push({ ...tmpl });
    }

    if (activity === 'imprisoned') {
      if (save.player.health > 5) {
        save.player.health = Math.max(5, save.player.health - 2);
      }
      if (elapsedMinutes >= 720 && !save.player.statusEffects.some((e) => e.effectId === 'eff_doi_khat')) {
        const tmpl = db.rules.statusEffectTemplates.find((t) => t.effectId === 'eff_doi_khat');
        if (tmpl) save.player.statusEffects.push({ ...tmpl });
      }
    }

    // Essence recovery
    const maxEss = getMaxEssence(save.player.aptitude);
    let gainEss = maxEss * db.rules.essence.naturalRegenFractionPerShichen;
    if (activity === 'cultivate' && stonesLeft > 0 && save.player.inventory.primevalStones > 0) {
      save.player.inventory.primevalStones -= 1;
      stonesLeft -= 1;
      gainEss += db.rules.essence.stoneRegenPerShichen;
    }
    const beforeEss = save.player.currentEssence;
    save.player.currentEssence = Math.min(maxEss, Number((save.player.currentEssence + gainEss).toFixed(2)));
    essenceRecovered += Number((save.player.currentEssence - beforeEss).toFixed(2));

    // Cultivation progress
    if (activity === 'cultivate' && save.player.cultivationProgress < 100) {
      const hasWineWorm = save.player.ownedGu.some((g) => g.guId === 'gu_tuu_trung' && g.isRefined);
      const gain = Number(
        (
          db.rules.cultivation.baseProgressPerShichen *
          (save.player.aptitude / 50) *
          (hasWineWorm ? db.rules.cultivation.wineWormMultiplier : 1)
        ).toFixed(1)
      );
      const prevProg = save.player.cultivationProgress;
      save.player.cultivationProgress = Math.min(100, Number((save.player.cultivationProgress + gain).toFixed(1)));
      cultivationGained += Number((save.player.cultivationProgress - prevProg).toFixed(1));
    }

    // Gu hunger
    const starved: string[] = [];
    const hungry: string[] = [];
    const aliveGu: typeof save.player.ownedGu = [];
    for (const og of save.player.ownedGu) {
      const def = db.guMap.get(og.guId);
      if (!def) {
        aliveGu.push(og);
        continue;
      }
      const drain = 100 / (Math.max(1, def.feedingCycleDays) * db.rules.time.shichensPerDay);
      og.hunger = Math.max(0, Number((og.hunger - drain).toFixed(2)));
      if (og.hunger <= 0) {
        starved.push(def.name);
        if (og.isVital) {
          save.player.health = Math.max(0, save.player.health - 45);
          save.player.apertureStatus = save.player.apertureStatus === 'Damaged' ? 'Crippled' : 'Damaged';
        }
      } else {
        if (og.hunger <= db.rules.time.hungerWarningThreshold) {
          hungry.push(`${def.name} (${Math.round(og.hunger)}%)`);
        }
        aliveGu.push(og);
      }
    }
    save.player.ownedGu = aliveGu;

    // Status effects
    const nextEffects: typeof save.player.statusEffects = [];
    for (const ef of save.player.statusEffects) {
      if (ef.hpDeltaPerShichen) {
        save.player.health = Math.max(0, Math.min(100, save.player.health + ef.hpDeltaPerShichen));
      }
      if (ef.fatigueDeltaPerShichen) {
        save.player.fatigue = Math.max(0, Math.min(100, save.player.fatigue + ef.fatigueDeltaPerShichen));
      }
      if (ef.durationShichen === -1) nextEffects.push(ef);
      else if (ef.durationShichen > 1) nextEffects.push({ ...ef, durationShichen: ef.durationShichen - 1 });
    }
    save.player.statusEffects = nextEffects;

    // Daily updates
    let majorEventToday: string | null = null;
    if (dayAdvanced) {
      tickRumorsDaily(save, db);
      for (const [nid, delta] of Object.entries(save.nodeStates)) {
        if (delta.isTaken && delta.respawnAtDay !== null && save.worldState.currentDay >= delta.respawnAtDay) {
          save.nodeStates[nid] = { isTaken: false, takenBy: null, respawnAtDay: null };
        }
      }
      if (save.worldState.currentDay % 5 === 0 && getPlayerSuspicion(save.player) > 0) {
        save.player.suspicion = Math.max(0, getPlayerSuspicion(save.player) - 1);
      }
      for (const evt of resolveTimelineEvents(db, save)) {
        if (
          evt.status === 'Pending' &&
          evt.triggerDay === save.worldState.currentDay &&
          evaluateCondition(save, evt.condition)
        ) {
          save.eventStates[evt.eventId] = 'Active';
          for (const eff of evt.worldEffects) applyWorldEffect(save, db, eff);
          triggeredEvents.push(evt.name);
          if (evt.isMajor) majorEventToday = evt.name;
        }
      }
    }

    // Group 1 Interrupts
    if (starved.length > 0) {
      interruptReason = `Cổ trùng chết đói: ${starved.join(', ')}!`;
      break;
    }
    if (save.player.health <= 0) {
      interruptReason = 'Sinh lực cạn kiệt (HP = 0%).';
      break;
    }
    if (activity === 'imprisoned') {
      continue;
    }
    if (save.player.health <= db.rules.time.healthDangerThreshold) {
      interruptReason = `Thể trạng nguy kịch (HP còn ${save.player.health}%).`;
      break;
    }
    if (activity !== 'rest' && save.player.fatigue >= db.rules.time.fatigueWarningThreshold) {
      interruptReason = `Kiệt sức (mệt mỏi ${save.player.fatigue}/100), buộc phải dừng lại.`;
      break;
    }
    if (hungry.length > 0) {
      interruptReason = `Cổ trùng đói tới ngưỡng nguy hiểm: ${hungry.join(', ')}.`;
      break;
    }
    if (activity === 'cultivate' && save.player.cultivationProgress >= 100) {
      interruptReason = 'Tiến độ ôn dưỡng đạt 100%, sẵn sàng đột phá cảnh giới!';
      break;
    }
    if (!inSafeCamp && getPlayerSatiety(save.player) <= 20) {
      interruptReason = `Cạn lương khô và đói khát (Độ no còn ${getPlayerSatiety(save.player)}%).`;
      break;
    }

    // Group 2 Interrupts
    if (majorEventToday) {
      interruptReason = `Sự kiện lớn bắt đầu: ${majorEventToday}.`;
      break;
    }
    const loc = resolveLocation(db, save, save.player.locationId);
    if (loc && loc.dangerLevel > 0 && Math.random() < (loc.dangerLevel / 100) * 0.25) {
      interruptReason = `Biến cố bất ngờ phát sinh tại ${loc.name}.`;
      break;
    }

    // Group 3 Interrupts (Obligations)
    const dow = ((save.worldState.currentDay - 1) % 7) + 1;
    for (const ob of resolveObligations(db, save)) {
      const matchDay =
        ob.frequency === 'OneTime'
          ? ob.requiredDays.includes(save.worldState.currentDay)
          : ob.requiredDays.includes(dow);
      if (!matchDay) continue;
      if (save.worldState.currentShichen === ob.shichenRange[1] + 1) {
        if (save.player.locationId !== ob.locationId && !ob.isExcused) {
          const missed = ob.missedCount + 1;
          save.obligationStates[ob.obligationId] = { missedCount: missed, isExcused: false };
          if (missed > ob.maxMissedAllowed) {
            save.player.clanContribution = Math.max(0, save.player.clanContribution - 5);
            save.player.factionRep.clanLeader = Math.max(-100, save.player.factionRep.clanLeader - 4);
            interruptReason = `Vắng quá giới hạn "${ob.name}" (${missed} lần). ${ob.penaltyNote}`;
            break;
          }
        } else if (save.player.locationId === ob.locationId) {
          save.obligationStates[ob.obligationId] = { missedCount: 0, isExcused: false };
        }
      }
    }
    if (interruptReason) break;
  }

  checkEndings(save, db);

  return {
    elapsedMinutes,
    shichensPassed,
    essenceRecovered: Number(essenceRecovered.toFixed(2)),
    cultivationGained: Number(cultivationGained.toFixed(1)),
    rationsConsumed,
    triggeredEvents,
    interruptReason,
  };
}

// === 5. GU FEED / REFINE / STATE UPDATES ===
export interface FlatStateUpdate {
  healthDelta?: number;
  fatigueDelta?: number;
  satietyDelta?: number;
  suspicionDelta?: number;
  primevalStonesDelta?: number;
  strengthDelta?: number;
  clanContributionDelta?: number;
  cultivationProgressDelta?: number;
  rankDelta?: number;
  apertureStatus?: 'Normal' | 'Damaged' | 'Crippled';
  addItemId?: string;
  addItemQuantity?: number;
  removeItemId?: string;
  removeItemQuantity?: number;
  addGuId?: string;
  addGuIsVital?: boolean;
  addGuIsRefined?: boolean;
  feedGuId?: string;
  refineGuId?: string;
  takeNodeId?: string;
  addStatusEffectId?: string;
  removeStatusEffectId?: string;
  npcId?: string;
  npcAttitudeDelta?: number;
  npcPrivateNote?: string;
  factionId?: 'clanLeader' | 'chiFaction' | 'moFaction' | 'neutral';
  factionRepDelta?: number;
  addFlagId?: string;
  addFlagDescription?: string;
  rumorContent?: string;
  rumorTruthNote?: string;
  memorySummary?: string;
  changeReason?: string;
  confiscateAllStones?: boolean;
  confiscateItems?: boolean;
}

export function checkEndings(save: SaveState, db: StaticDatabase): void {
  if (save.ending) return;
  if (save.player.health <= 0) {
    save.ending = {
      type: 'death',
      title: 'Thân Tử Đạo Tiêu',
      summary: `${save.player.name} đã bỏ mạng tại Thanh Mao Sơn vào Ngày ${save.worldState.currentDay}.`,
      dayReached: save.worldState.currentDay,
    };
  } else if (save.player.apertureStatus === 'Crippled') {
    save.ending = {
      type: 'crippled_aperture',
      title: 'Không Khiếu Bị Phế',
      summary: `Không khiếu của ${save.player.name} đã vỡ nát vào Ngày ${save.worldState.currentDay}, chấm dứt con đường cổ sư.`,
      dayReached: save.worldState.currentDay,
    };
  } else if (save.worldState.currentDay >= db.rules.time.daysPerYear) {
    save.ending = {
      type: 'victory_year1',
      title: 'Hoàn Thành Năm Thứ Nhất',
      summary: `${save.player.name} đã đi trọn 1 năm tại Cổ Nguyệt Sơn Trại và vượt qua Niên Mạt Khảo Hạch.`,
      dayReached: save.worldState.currentDay,
    };
  }
}

export function applyFlatStateUpdate(
  save: SaveState,
  u: FlatStateUpdate,
  db: StaticDatabase
): { changes: string[]; warnings: string[] } {
  const changes: string[] = [];
  const warnings: string[] = [];
  const p = save.player;

  if (typeof u.healthDelta === 'number' && u.healthDelta !== 0) {
    const before = p.health;
    p.health = Math.max(0, Math.min(100, Math.round(p.health + u.healthDelta)));
    if (p.health !== before) changes.push(`HP ${p.health - before > 0 ? '+' : ''}${p.health - before}% (còn ${p.health}%)`);
  }

  if (typeof u.fatigueDelta === 'number' && u.fatigueDelta !== 0) {
    const before = p.fatigue;
    p.fatigue = Math.max(0, Math.min(100, Math.round(p.fatigue + u.fatigueDelta)));
    if (p.fatigue !== before) changes.push(`Mệt mỏi ${p.fatigue - before > 0 ? '+' : ''}${p.fatigue - before}`);
  }

  if (typeof u.satietyDelta === 'number' && u.satietyDelta !== 0) {
    const before = getPlayerSatiety(p);
    const next = Math.max(0, Math.min(100, Math.round(before + u.satietyDelta)));
    p.satiety = next;
    if (next !== before) changes.push(`Độ no ${next - before > 0 ? '+' : ''}${next - before}% (còn ${next}%)`);
    if (next >= 40) {
      p.statusEffects = p.statusEffects.filter((e) => e.effectId !== 'eff_doi_khat');
    }
  }

  if (typeof u.suspicionDelta === 'number' && u.suspicionDelta !== 0) {
    const before = getPlayerSuspicion(p);
    const next = Math.max(0, Math.min(100, Math.round(before + u.suspicionDelta)));
    p.suspicion = next;
    if (next !== before) {
      const tier =
        next >= 100
          ? 'Bạo lộ hoàn toàn'
          : next >= 80
            ? 'Gia lão truy sát'
            : next >= 60
              ? 'Truy bắt ngầm'
              : next >= 40
                ? 'Hình Đường điều tra'
                : next >= 20
                  ? 'Bị để mắt'
                  : 'An toàn';
      changes.push(`Nghi ngờ Hình Đường ${next - before > 0 ? '+' : ''}${next - before} (${next}/100 · ${tier})`);
    }
  }

  if (typeof u.primevalStonesDelta === 'number' && u.primevalStonesDelta !== 0) {
    const reasonText = typeof u.changeReason === 'string' ? u.changeReason.trim() : '';
    if (u.primevalStonesDelta > 0 && !reasonText) {
      warnings.push(
        'Từ chối cộng nguyên thạch vô cớ: bắt buộc truyền changeReason nêu rõ nguồn gốc và giải thích trong truyện.'
      );
    } else {
      const next = Number((p.inventory.primevalStones + u.primevalStonesDelta).toFixed(2));
      if (next < 0) {
        warnings.push(`Không đủ nguyên thạch (hiện có ${p.inventory.primevalStones}).`);
      } else {
        p.inventory.primevalStones = next;
        const suffix = reasonText ? ` — ${reasonText}` : '';
        changes.push(
          `Nguyên thạch ${u.primevalStonesDelta > 0 ? '+' : ''}${u.primevalStonesDelta} (còn ${next})${suffix}`
        );
      }
    }
  }

  if (u.confiscateAllStones && p.inventory.primevalStones > 0) {
    const taken = p.inventory.primevalStones;
    const reasonText = typeof u.changeReason === 'string' && u.changeReason.trim() ? ` — ${u.changeReason.trim()}` : '';
    p.inventory.primevalStones = 0;
    changes.push(`Bị tịch thu toàn bộ ${taken} nguyên thạch (còn 0)${reasonText}`);
  }

  if (u.confiscateItems && p.inventory.items.length > 0) {
    const names = p.inventory.items
      .map((i) => `${db.itemMap.get(i.itemId)?.name ?? i.itemId} ×${i.quantity}`)
      .join(', ');
    const reasonText = typeof u.changeReason === 'string' && u.changeReason.trim() ? ` — ${u.changeReason.trim()}` : '';
    p.inventory.items = [];
    changes.push(`Bị tước vật phẩm trong túi (${names})${reasonText}`);
  }

  if (typeof u.strengthDelta === 'number' && u.strengthDelta !== 0) {
    // Hard anti-exploit clamp: max +1.0 / -0.5 boar strength per single turn
    const clampedStr = Math.max(-0.5, Math.min(1.0, u.strengthDelta));
    p.strength = Math.max(0.1, Number((p.strength + clampedStr).toFixed(2)));
    changes.push(`Khí lực ${clampedStr > 0 ? '+' : ''}${clampedStr} trư lực`);
  }

  if (typeof u.clanContributionDelta === 'number' && u.clanContributionDelta !== 0) {
    p.clanContribution = Math.max(0, p.clanContribution + Math.round(u.clanContributionDelta));
    changes.push(`Cống hiến ${u.clanContributionDelta > 0 ? '+' : ''}${Math.round(u.clanContributionDelta)}`);
  }

  if (typeof u.cultivationProgressDelta === 'number' && u.cultivationProgressDelta !== 0) {
    // Hard anti-exploit clamp: cannot jump 0% -> 100% in 1 turn without real advance_time cultivation
    const clampedProg = Math.max(-30, Math.min(20, u.cultivationProgressDelta));
    p.cultivationProgress = Math.max(0, Math.min(100, Number((p.cultivationProgress + clampedProg).toFixed(1))));
    changes.push(`Ôn dưỡng không khiếu: ${p.cultivationProgress}%`);
  }

  if (typeof u.rankDelta === 'number' && u.rankDelta !== 0) {
    // Hard anti-exploit lock: must reach 100% cultivationProgress and can only advance +1 minor rank per turn
    if (u.rankDelta > 0 && p.cultivationProgress < 100) {
      warnings.push(
        `Từ chối đột phá cưỡng ép: tiến độ ôn dưỡng chưa đạt 100% (hiện ${p.cultivationProgress}%). Không thể nhảy cảnh giới!`
      );
    } else if (u.rankDelta > 0) {
      const prev = p.rank;
      p.rank = Math.max(1, Math.min(db.rules.cultivation.maxRankYear1, p.rank + 1));
      if (p.rank !== prev) {
        p.currentEssence = getMaxEssence(p.aptitude);
        p.cultivationProgress = 0;
        p.publicImage.apparentRank = Math.max(p.publicImage.apparentRank, p.rank);
        changes.push(`Đột phá cảnh giới → bậc ${p.rank}`);
      }
    }
  }

  if (u.apertureStatus) {
    p.apertureStatus = u.apertureStatus;
    changes.push(`Không khiếu: ${u.apertureStatus}`);
  }

  // Items
  if (u.removeItemId && u.removeItemQuantity && u.removeItemQuantity > 0) {
    const ex = p.inventory.items.find((i) => i.itemId === u.removeItemId);
    const def = db.itemMap.get(u.removeItemId);
    if (!ex || ex.quantity < u.removeItemQuantity) {
      warnings.push(`Không đủ ${def?.name ?? u.removeItemId} trong túi.`);
    } else {
      ex.quantity -= u.removeItemQuantity;
      p.inventory.items = p.inventory.items.filter((i) => i.quantity > 0);
      changes.push(`-${u.removeItemQuantity} ${def?.name ?? u.removeItemId}`);
      if (u.removeItemId === 'item_luong_kho' && !u.satietyDelta) {
        const nextSat = Math.min(100, getPlayerSatiety(p) + 50 * u.removeItemQuantity);
        p.satiety = nextSat;
        if (nextSat >= 40) p.statusEffects = p.statusEffects.filter((e) => e.effectId !== 'eff_doi_khat');
        changes.push(`Độ no hồi lên ${nextSat}%`);
      }
    }
  }

  if (u.addItemId && u.addItemQuantity && u.addItemQuantity > 0) {
    const def = db.itemMap.get(u.addItemId);
    if (!def) {
      warnings.push(`Vật phẩm không hợp lệ: ${u.addItemId}`);
    } else {
      const used = getInventoryUsedSpace(save, db);
      if (used + def.size * u.addItemQuantity > p.inventory.capacity + 1e-6) {
        warnings.push(`Túi đồ đầy (${used}/${p.inventory.capacity}), không thể chứa thêm ${def.name}.`);
      } else {
        const ex = p.inventory.items.find((i) => i.itemId === def.itemId);
        if (ex) ex.quantity += u.addItemQuantity;
        else p.inventory.items.push({ itemId: def.itemId, quantity: u.addItemQuantity });
        changes.push(`+${u.addItemQuantity} ${def.name}`);
      }
    }
  }

  // Gu add / feed / refine
  if (u.addGuId) {
    const def = db.guMap.get(u.addGuId);
    if (!def) {
      warnings.push(`Cổ trùng không hợp lệ: ${u.addGuId}`);
    } else {
      const hasVital = p.ownedGu.some((g) => g.isVital);
      p.ownedGu.push({
        guId: def.guId,
        isVital: !hasVital && Boolean(u.addGuIsVital),
        isRefined: Boolean(u.addGuIsRefined),
        condition: 'Healthy',
        hunger: 100,
      });
      changes.push(`Nhận cổ trùng: ${def.name}${!hasVital && u.addGuIsVital ? ' (Bản Mệnh)' : ''}`);
    }
  }

  if (u.feedGuId) {
    const og = p.ownedGu.find((g) => g.guId === u.feedGuId);
    const def = db.guMap.get(u.feedGuId);
    if (og && def) {
      const need = def.food.quantityPerFeed;
      const foodInv = p.inventory.items.find((i) => i.itemId === def.food.itemId);
      const foodDef = db.itemMap.get(def.food.itemId);
      if (need > 0 && (!foodInv || foodInv.quantity < need)) {
        warnings.push(`Thiếu ${need} ${foodDef?.name ?? def.food.itemId} để cho ${def.name} ăn.`);
      } else {
        if (foodInv && need > 0) {
          foodInv.quantity -= need;
          p.inventory.items = p.inventory.items.filter((i) => i.quantity > 0);
        }
        og.hunger = 100;
        og.condition = 'Healthy';
        changes.push(`Cho ${def.name} ăn no (100%)`);
      }
    }
  }

  if (u.refineGuId) {
    const og = p.ownedGu.find((g) => g.guId === u.refineGuId);
    const def = db.guMap.get(u.refineGuId);
    if (og && def && !og.isRefined) {
      const essCost = calculateEffectiveEssenceCost(
        { amount: Math.max(1.5, def.essenceCost.amount * 2), baseRank: def.essenceCost.baseRank },
        p.rank,
        db
      );
      if (p.currentEssence + 1e-6 < essCost) {
        warnings.push(`Thiếu chân nguyên luyện hóa ${def.name} (cần ${essCost} thành).`);
      } else {
        p.currentEssence = Math.max(0, Number((p.currentEssence - essCost).toFixed(2)));
        og.isRefined = true;
        if (p.ownedGu.every((g) => !g.isVital)) og.isVital = true;
        changes.push(`Luyện hóa thành công ${def.name} (-${essCost} thành)`);
      }
    }
  }

  // Take resource node
  if (u.takeNodeId) {
    const lid = db.nodeToLocationMap.get(u.takeNodeId);
    const loc = lid ? resolveLocation(db, save, lid) : null;
    const node = loc?.resourceNodes.find((n) => n.nodeId === u.takeNodeId);
    if (node && !node.isTaken) {
      save.nodeStates[node.nodeId] = {
        isTaken: true,
        takenBy: 'player',
        respawnAtDay: node.isUnique ? null : save.worldState.currentDay + Math.max(1, node.respawnDays),
      };
      changes.push(`Thu hoạch: ${node.name}`);
      if (node.refId && db.guMap.has(node.refId)) {
        p.ownedGu.push({
          guId: node.refId,
          isVital: false,
          isRefined: false,
          condition: 'Healthy',
          hunger: 100,
        });
        changes.push(`Thu phục cổ hoang: ${db.guMap.get(node.refId)?.name}`);
      } else if (node.refId && db.itemMap.has(node.refId)) {
        const itDef = db.itemMap.get(node.refId)!;
        const ex = p.inventory.items.find((i) => i.itemId === itDef.itemId);
        if (ex) ex.quantity += 1;
        else p.inventory.items.push({ itemId: itDef.itemId, quantity: 1 });
        changes.push(`+1 ${itDef.name}`);
      }
    }
  }

  // Status effects
  if (u.addStatusEffectId) {
    const tmpl = db.rules.statusEffectTemplates.find((e) => e.effectId === u.addStatusEffectId);
    if (tmpl && !p.statusEffects.some((e) => e.effectId === tmpl.effectId)) {
      p.statusEffects.push({ ...tmpl });
      changes.push(`Trạng thái: ${tmpl.name}`);
    }
  }
  if (u.removeStatusEffectId) {
    const before = p.statusEffects.length;
    p.statusEffects = p.statusEffects.filter((e) => e.effectId !== u.removeStatusEffectId);
    if (p.statusEffects.length < before) changes.push(`Hóa giải trạng thái: ${u.removeStatusEffectId}`);
  }

  // Relationships & Faction
  if (u.npcId && (typeof u.npcAttitudeDelta === 'number' || u.npcPrivateNote)) {
    const npc = db.npcMap.get(u.npcId);
    if (npc) {
      const delta = Math.round(u.npcAttitudeDelta ?? 0);
      const ex = p.relationships.find((r) => r.npcId === u.npcId);
      if (ex) {
        ex.attitude = Math.max(-100, Math.min(100, ex.attitude + delta));
        if (u.npcPrivateNote) ex.privateNote = u.npcPrivateNote;
      } else {
        p.relationships.push({
          npcId: u.npcId,
          attitude: Math.max(-100, Math.min(100, delta)),
          privateNote: u.npcPrivateNote ?? 'Đã từng tiếp xúc.',
        });
      }
      if (delta !== 0) changes.push(`Quan hệ ${npc.name} ${delta > 0 ? '+' : ''}${delta}`);
    }
  }

  if (u.factionId && typeof u.factionRepDelta === 'number' && u.factionRepDelta !== 0) {
    p.factionRep[u.factionId] = Math.max(
      -100,
      Math.min(100, p.factionRep[u.factionId] + Math.round(u.factionRepDelta))
    );
    changes.push(`Phe ${u.factionId} ${u.factionRepDelta > 0 ? '+' : ''}${Math.round(u.factionRepDelta)}`);
  }

  // Flags, Rumors, Memory
  if (u.addFlagId) {
    if (!save.worldState.worldFlags.some((f) => f.flagId === u.addFlagId)) {
      save.worldState.worldFlags.push({
        flagId: u.addFlagId,
        description: u.addFlagDescription ?? u.addFlagId,
        createdDay: save.worldState.currentDay,
      });
      changes.push(`Dấu ấn: ${u.addFlagDescription ?? u.addFlagId}`);
    }
  }

  if (u.rumorContent && u.rumorContent.trim()) {
    const curLoc = db.locationMap.get(p.locationId);
    save.worldState.activeRumors.push({
      rumorId: `rumor_${save.worldState.currentDay}_${save.worldState.activeRumors.length + 1}`,
      content: u.rumorContent.trim(),
      truthNote: u.rumorTruthNote?.trim() ?? u.rumorContent.trim(),
      originLocationId: p.locationId,
      regionName: curLoc?.regionName ?? 'Cổ Nguyệt Sơn Trại',
      spreadLevel: 25,
      createdDay: save.worldState.currentDay,
      involvedIds: ['player', ...(u.npcId ? [u.npcId] : [])],
      knownByNpcIds: u.npcId ? [u.npcId] : [],
    });
    changes.push(`Tin đồn: "${u.rumorContent.trim()}"`);
  }

  if (u.memorySummary && u.memorySummary.trim()) {
    save.worldState.memoryLog.push({
      day: save.worldState.currentDay,
      summary: u.memorySummary.trim(),
      involvedNpcIds: u.npcId ? [u.npcId] : [],
    });
  }

  checkEndings(save, db);
  return { changes, warnings };
}
