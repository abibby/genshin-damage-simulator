import {
    Ability,
    Character,
    Element,
    Hit,
    SkillType,
    Stat,
    Stats,
} from '../src/characters/character'

export function crossJoin<A, B, C>(
    a: readonly (readonly [A])[],
    b: readonly (readonly [B, C])[],
): [A, B, C][] {
    const result: [A, B, C][] = []
    for (const av of a) {
        for (const bv of b) {
            result.push([...av, ...bv])
        }
    }
    return result
}

export function character(
    hits: Hit[],
    level = 90,
    stats: Partial<Stats> = {},
): Character {
    return {
        name: 'test character',
        level: level,
        stats: {
            hp: new Stat(100, 0, 0),
            atk: new Stat(100, 0, 0),
            def: new Stat(100, 0, 0),
            elementalMastery: 0,
            energyRecharge: 0,
            critRate: 0,
            critDamage: 0,
            ...stats,
        },
        abilities: new Map<string, Ability>([
            [
                'n1',
                {
                    name: 'n1',
                    type: SkillType.Normal,
                    castTime: 10,
                    hits: hits,
                    buffs: [],
                    triggers: [],
                    snapshot: false,
                },
            ],
        ]),
    }
}

export function basicHit(element: Element, mv: number): Hit[] {
    return [
        {
            element: element,
            gauge: 1,
            frame: 0,
            motionValue: mv,
            stat: 'atk',
        },
    ]
}
export function multiHit(
    element: Element,
    mv: number,
    count: number,
    interval: number,
): Hit[] {
    const hits: Hit[] = []
    for (let i = 0; i < count; i++) {
        hits.push({
            element: element,
            gauge: 1,
            frame: i * interval,
            motionValue: mv,
            stat: 'atk',
        })
    }
    return hits
}
