import { keys } from '../utils'

export enum Element {
    Pyro = 'pyro',
    Cryo = 'cryo',
    Hydro = 'hydro',
    Anemo = 'anemo',
    Electro = 'electro',
    Dendro = 'dendro',
    Geo = 'geo',
    Physical = 'physical',
}

export interface Character {
    name: string
    level: number
    stats: Stats
    abilities: Map<string, Ability>
}

export class Stat {
    constructor(
        public base: number,
        public percent: number,
        public flat: number,
    ) {}

    value(): number {
        return this.base + this.base * this.percent + this.flat
    }
    valueWithBonus(bonus: Bonus): number {
        return (
            this.base +
            this.base * (this.percent + bonus.percent) +
            (this.flat + bonus.flat)
        )
    }
}

export interface Stats {
    hp: Stat
    atk: Stat
    def: Stat
    elementalMastery: number
    energyRecharge: number
    critRate: number
    critDamage: number
}

export enum SkillType {
    Normal,
    Charge,
    Skill,
    Burst,
}
export enum TriggerType {
    Cast,
    Damage,
}

export interface Trigger {
    trigger: TriggerType
    type: SkillType | null
    duration: number
    hits: Hit[]
}

export interface Ability {
    name: string
    type: SkillType
    castTime: number
    hits: Hit[]
    buffs: Buff[]
    triggers: Trigger[]
    snapshot: boolean
    icd: number
    cooldown: number
    stamina: number
}

export interface Hit {
    element: Element
    gauge: number
    frame: number
    motionValue: number
    stat: keyof Stats
}

export enum BuffCharacter {
    Self,
    Active,
    All,
}

export interface Bonus {
    flat: number
    percent: number
}

export type StatBonuses = {
    [P in keyof Stats]?: Bonus
}

export type Buff = {
    frame: number
    duration: number
    character: BuffCharacter
    statBonuses: StatBonuses
}

export function addStatBonuses(...statBonuses: StatBonuses[]): StatBonuses {
    const bonuses: StatBonuses = {}

    for (const bonus of statBonuses) {
        for (const key of keys(bonus)) {
            const value: Bonus = bonus[key] ?? { flat: 0, percent: 0 }
            if (bonuses[key] !== undefined) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                bonuses[key]!.flat += value.flat
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                bonuses[key]!.percent += value.percent
            } else {
                bonuses[key] = { ...value }
            }
        }
    }

    return bonuses
}
