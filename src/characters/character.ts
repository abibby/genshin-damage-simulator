export enum Element {
    Pyro,
    Cryo,
    Hydro,
    Anemo,
    Electro,
    Dendro,
    Geo,
    Physical,
}

export interface Character {
    name: string
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
    hits: Hit[]
}

export interface Hit {
    element: Element
    gauge: number
    frame: number
    motionValue: number
    stat: keyof Stats
}
