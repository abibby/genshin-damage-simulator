import { Ability, Character, Element, SkillType, Stat } from './character'

function abilities(abilities: Ability[]): Map<string, Ability> {
    const m = new Map<string, Ability>()
    for (const a of abilities) {
        m.set(a.name, a)
    }
    return m
}

export function klee(): Character {
    return {
        name: 'Klee',
        level: 90,
        stats: {
            hp: new Stat(10287, 0, 5163),
            atk: new Stat(985, 0, 1541),
            def: new Stat(615, 0, 40),
            elementalMastery: 77,
            energyRecharge: 115.5,
            critRate: 68.0,
            critDamage: 127.7,
        },
        abilities: abilities([
            {
                name: 'n1',
                type: SkillType.Normal,
                castTime: 32,
                hits: [
                    {
                        element: Element.Pyro,
                        gauge: 1,
                        frame: 32,
                        motionValue: 129.9,
                        stat: 'atk',
                    },
                ],
                buffs: [],
                triggers: [],
                snapshot: false,
            },
            {
                name: 'n2',
                type: SkillType.Normal,
                castTime: 76,
                hits: [
                    {
                        element: Element.Pyro,
                        gauge: 1,
                        frame: 32,
                        motionValue: 129.9,
                        stat: 'atk',
                    },
                    {
                        element: Element.Pyro,
                        gauge: 1,
                        frame: 76,
                        motionValue: 112.3,
                        stat: 'atk',
                    },
                ],
                buffs: [],
                triggers: [],
                snapshot: false,
            },
            {
                name: 'n3',
                type: SkillType.Normal,
                castTime: 151,
                hits: [
                    {
                        element: Element.Pyro,
                        gauge: 1,
                        frame: 32,
                        motionValue: 129.9,
                        stat: 'atk',
                    },
                    {
                        element: Element.Pyro,
                        gauge: 1,
                        frame: 76,
                        motionValue: 112.3,
                        stat: 'atk',
                    },
                    {
                        element: Element.Pyro,
                        gauge: 1,
                        frame: 151,
                        motionValue: 161.9,
                        stat: 'atk',
                    },
                ],
                buffs: [],
                triggers: [],
                snapshot: false,
            },
            {
                name: 'c',
                type: SkillType.Charge,
                castTime: 50,
                hits: [
                    {
                        element: Element.Pyro,
                        gauge: 1,
                        frame: 32,
                        motionValue: 283,
                        stat: 'atk',
                    },
                ],
                buffs: [],
                triggers: [],
                snapshot: false,
            },
            {
                name: 'e',
                type: SkillType.Skill,
                castTime: 67,
                hits: [
                    {
                        element: Element.Pyro,
                        gauge: 1,
                        frame: 70,
                        motionValue: 133.28,
                        stat: 'atk',
                    },
                    {
                        element: Element.Pyro,
                        gauge: 1,
                        frame: 80,
                        motionValue: 133.28,
                        stat: 'atk',
                    },
                    {
                        element: Element.Pyro,
                        gauge: 1,
                        frame: 90,
                        motionValue: 133.28,
                        stat: 'atk',
                    },
                ],
                buffs: [],
                triggers: [],
                snapshot: false,
            },
        ]),
    }
}
