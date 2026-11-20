export type ApertureStatus = 'Normal' | 'Damaged' | 'Crippled';
export type Severity = 'Mild' | 'Moderate' | 'Severe';
export type NpcStatus = 'Alive' | 'Missing' | 'Dead';
export type FactionId = 'clanLeader' | 'chiFaction' | 'moFaction' | 'neutral' | 'outsider';
export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter';
export type TimeOfDay = 'Morning' | 'Noon' | 'Afternoon' | 'Evening' | 'Night';
export type EventStatus = 'Pending' | 'Active' | 'Completed' | 'Altered';

export interface EssenceCost {
  amount: number;
  baseRank: number;
}

export interface StatusEffect {
  effectId: string;
  name: string;
  severity: Severity;
  hpDeltaPerShichen: number;
  fatigueDeltaPerShichen: number;
  dcPenalty: number;
  durationShichen: number;
  cureCondition: string;
}

export interface FactionReputation {
  clanLeader: number;
  chiFaction: number;
  moFaction: number;
  neutral: number;
}

export interface OwnedGu {
  guId: string;
  isVital: boolean;
  isRefined: boolean;
  condition: 'Healthy' | 'Injured';
  hunger: number;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
}

export interface Inventory {
  capacity: number;
  primevalStones: number;
  items: InventoryItem[];
}

export interface Relationship {
  npcId: string;
  attitude: number;
  privateNote: string;
}

export interface RegionRep {
  regionTier: string;
  regionName: string;
  publicBio: string;
  rep: number;
}

export interface PublicImage {
  appearance: string;
  apparentRank: number;
  apparentAptitude: number;
  regionRep: RegionRep[];
}

export interface Player {
  name: string;
  age: number;
  origin: string;
  rank: number;
  aptitude: number;
  aptitudeGrade: 'Đinh đẳng' | 'Bính đẳng' | 'Ất đẳng';
  currentEssence: number;
  apertureStatus: ApertureStatus;
  cultivationProgress: number;
  strength: number;
  health: number;
  fatigue: number;
  /** Độ no 0–100% (tự tiêu hao lương khô khi dã ngoại; ở nội trại tự dùng cơm ký túc xá) */
  satiety?: number;
  /** Điểm nghi ngờ Hình Đường 0–100 (20 để mắt, 40 điều tra, 60 truy bắt, 80 truy sát, 100 bạo lộ) */
  suspicion?: number;
  statusEffects: StatusEffect[];
  /** Strictly hidden from UI everywhere */
  luck: number;
  locationId: string;
  clanContribution: number;
  factionRep: FactionReputation;
  ownedGu: OwnedGu[];
  inventory: Inventory;
  relationships: Relationship[];
  knownRecipeIds: string[];
  knownMoveIds: string[];
  publicImage: PublicImage;
}

export interface NpcScheduleEntry {
  shichenRange: [number, number];
  locationId: string;
  activity: string;
}

export interface Npc {
  npcId: string;
  name: string;
  age: number;
  rank: number;
  aptitude: number;
  currentEssence: number;
  strength: number;
  health: number;
  status: NpcStatus;
  statusEffects: StatusEffect[];
  faction: FactionId;
  role: string;
  personality: string;
  goals: string;
  locationId: string;
  schedule: NpcScheduleEntry[];
  bio: string;
  ownedGu: { guId: string; isVital: boolean }[];
  inventory: Inventory;
  publicImage: PublicImage;
}

export interface GuDefinition {
  guId: string;
  name: string;
  rank: number;
  path: string;
  category: string;
  effect: string;
  essenceCost: EssenceCost;
  food: { itemId: string; quantityPerFeed: number };
  feedingCycleDays: number;
  basePrice: number;
  refinementNote: string;
}

export interface RecipeDefinition {
  recipeId: string;
  name: string;
  resultGuId: string;
  rank: number;
  path: string;
  requiredGu: { guId: string; quantity: number }[];
  materials: { itemId: string; quantity: number }[];
  baseDifficulty: number;
  essenceRequirement: EssenceCost;
  timeRequiredShichen: number;
  failurePenalty: string;
  sourceNote: string;
}

export interface KillerMoveDefinition {
  moveId: string;
  name: string;
  rank: number;
  path: string;
  category: string;
  coreGuId: string;
  supportGuIds: string[];
  effect: string;
  essenceCost: EssenceCost;
  activationTime: string;
  baseDifficulty: number;
  backlash: string;
}

export interface ItemDefinition {
  itemId: string;
  name: string;
  type: string;
  description: string;
  size: number;
  basePrice: number;
}

export interface ResourceNode {
  nodeId: string;
  name: string;
  resourceType: string;
  refId: string | null;
  isUnique: boolean;
  isTaken: boolean;
  takenBy: string | null;
  respawnDays: number;
  hiddenDifficulty: number;
}

export interface LocationDefinition {
  locationId: string;
  name: string;
  regionName: string;
  coordinates: { x: number; y: number; z: number };
  description: string;
  dangerLevel: number;
  connectedLocations: { targetLocationId: string; travelMinutes: number }[];
  resourceNodes: ResourceNode[];
}

export interface Obligation {
  obligationId: string;
  name: string;
  locationId: string;
  frequency: 'Daily' | 'Weekly' | 'OneTime';
  requiredDays: number[];
  shichenRange: [number, number];
  maxMissedAllowed: number;
  missedCount: number;
  isExcused: boolean;
  penaltyNote: string;
}

export interface WorldEffect {
  type: 'setFlag' | 'takeNode' | 'giveNpcGu' | 'setNpcStatus' | 'setNpcRank';
  flagId?: string;
  description?: string;
  nodeId?: string;
  takenBy?: string;
  npcId?: string;
  guId?: string;
  status?: NpcStatus;
  rank?: number;
}

export interface TimelineEvent {
  eventId: string;
  name: string;
  triggerDay: number;
  recurrenceDays: number;
  isMajor: boolean;
  condition: string | null;
  summary: string;
  worldEffects: WorldEffect[];
  status: EventStatus;
}

export interface GameRules {
  saveVersion: string;
  dice: {
    minRoll: number;
    maxRoll: number;
    luckDivisor: number;
    maxLuckModifier: number;
    fatiguePenalty70: number;
    fatiguePenalty90: number;
  };
  essence: {
    sameTierHigherDiscount: number;
    sameTierMinMultiplier: number;
    sameTierLowerPenalty: number;
    crossTierHigherFactor: number;
    crossTierLowerFactor: number;
    naturalRegenFractionPerShichen: number;
    stoneRegenPerShichen: number;
  };
  time: {
    minutesPerShichen: number;
    shichensPerDay: number;
    daysPerYear: number;
    shichenNames: string[];
    seasonDayRanges: Record<Season, [number, number]>;
    fatigueWarningThreshold: number;
    hungerWarningThreshold: number;
    healthDangerThreshold: number;
    rumorCrystallizeThreshold: number;
    rumorDecayPerDay: number;
  };
  cultivation: {
    baseProgressPerShichen: number;
    breakthroughMinorBaseDC: number;
    breakthroughMajorBaseDC: number;
    failedBreakthroughProgressLoss: number;
    wineWormMultiplier: number;
    maxRankYear1: number;
  };
  starterGuPool: string[];
  statusEffectTemplates: StatusEffect[];
}

export interface StaticDatabase {
  rules: GameRules;
  items: ItemDefinition[];
  gu: GuDefinition[];
  recipes: RecipeDefinition[];
  killerMoves: KillerMoveDefinition[];
  locations: LocationDefinition[];
  npcs: Npc[];
  obligations: Obligation[];
  timelineEvents: TimelineEvent[];
  itemMap: Map<string, ItemDefinition>;
  guMap: Map<string, GuDefinition>;
  recipeMap: Map<string, RecipeDefinition>;
  moveMap: Map<string, KillerMoveDefinition>;
  locationMap: Map<string, LocationDefinition>;
  npcMap: Map<string, Npc>;
  obligationMap: Map<string, Obligation>;
  eventMap: Map<string, TimelineEvent>;
  nodeToLocationMap: Map<string, string>;
}

export interface WorldFlag {
  flagId: string;
  description: string;
  createdDay: number;
}

export interface MemoryEntry {
  day: number;
  summary: string;
  involvedNpcIds: string[];
}

export interface ActiveRumor {
  rumorId: string;
  content: string;
  truthNote: string;
  originLocationId: string;
  regionName: string;
  spreadLevel: number;
  createdDay: number;
  involvedIds: string[];
  knownByNpcIds: string[];
}

export interface WorldState {
  currentDay: number;
  currentShichen: number;
  currentTime: number;
  timeOfDay: TimeOfDay;
  season: Season;
  /** Seed cố định theo save để gieo Encounter Dice nhất quán theo ngày/canh giờ */
  worldDiceSeed?: number;
  worldFlags: WorldFlag[];
  memoryLog: MemoryEntry[];
  activeRumors: ActiveRumor[];
}

export interface NpcStateDelta {
  rank?: number;
  health?: number;
  status?: NpcStatus;
  locationId?: string;
  currentEssence?: number;
  ownedGu?: { guId: string; isVital: boolean }[];
}

export interface NodeStateDelta {
  isTaken: boolean;
  takenBy: string | null;
  respawnAtDay: number | null;
}

export interface ObligationStateDelta {
  missedCount: number;
  isExcused: boolean;
}

export type DiceCategory = 'physical' | 'social' | 'cultivation';

export interface DiceSummary {
  roll: number;
  targetDC: number;
  margin: number;
  success: boolean;
  isCritSuccess: boolean;
  isCritFail: boolean;
  reason: string;
  category?: DiceCategory;
}

export interface TokenUsage {
  promptTokens: number;
  outputTokens: number;
  thoughtTokens: number;
  cachedTokens: number;
  totalTokens: number;
  apiCalls: number;
}

export interface TurnDetails {
  model: string;
  diceRolls: DiceSummary[];
  essenceSpent: number;
  minutesPassed: number;
  interrupts: string[];
  changes: string[];
  usage?: TokenUsage;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  details?: TurnDetails;
}

export interface GameEnding {
  type: 'victory_year1' | 'death' | 'crippled_aperture';
  title: string;
  summary: string;
  dayReached: number;
}

export interface SaveState {
  saveVersion: string;
  createdAt: string;
  updatedAt: string;
  turnCount: number;
  player: Player;
  worldState: WorldState;
  npcStates: Record<string, NpcStateDelta>;
  nodeStates: Record<string, NodeStateDelta>;
  eventStates: Record<string, EventStatus>;
  obligationStates: Record<string, ObligationStateDelta>;
  ending: GameEnding | null;
}
