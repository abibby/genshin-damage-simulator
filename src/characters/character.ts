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

    value() {
        return this.base + this.base * this.percent + this.flat
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

export function getStat(stats: Stats, key: keyof Stats): number {
    const stat = stats[key]
    if (typeof stat === 'number') {
        return stat
    }
    return stat.value()
}

export interface Ability {
    name: string
    castTime: number
    hits: Hit[]
    buffs: Buffs[]
}

export interface Hit {
    element: Element
    gauge: number
    frame: number
    motionValue: number
    stat: keyof Stats
}

export interface Buff {
    frame: number
    duration: number
}

export interface StatBuff extends Buff {
    flat: number
    percent: number
}

export interface FlatBuff extends Buff {
    flat: number
}

export type Buffs = {
    [P in keyof Stats]?: Stats[P] extends Stat ? StatBuff : FlatBuff
}
