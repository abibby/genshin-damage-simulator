import { describe, expect, test } from '@jest/globals'
import { Ability, Character, Element, Stat } from '../src/characters/character'
import { run, Simulation } from '../src/simulator/simulator'

function crossJoin<A, B, C>(
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

function character(
    element: Element,
    mv: number,
    level: number = 90,
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
        },
        abilities: new Map<string, Ability>([
            [
                'n1',
                {
                    name: 'n1',
                    hits: [
                        {
                            element: element,
                            gauge: 1,
                            frame: 0,
                            motionValue: mv,
                            stat: 'atk',
                        },
                    ],
                },
            ],
        ]),
    }
}

describe('simulator', () => {
    test('base damage', () => {
        const s = new Simulation()
        const damage = run(s, [character(Element.Pyro, 10)], ['n1'])
        expect(damage).toBe(10)
    })

    test('melt', () => {
        const s = new Simulation()
        const damage = run(
            s,
            [character(Element.Cryo, 10), character(Element.Pyro, 10)],
            ['n1', '2', 'n1'],
        )
        expect(damage).toBe(10 + 10 * 2)
    })

    test('reverse melt', () => {
        const s = new Simulation()
        const damage = run(
            s,
            [character(Element.Pyro, 10), character(Element.Cryo, 10)],
            ['n1', '2', 'n1'],
        )
        expect(damage).toBe(10 + 10 * 1.5)
    })

    test('double reverse melt', () => {
        const s = new Simulation()
        const damage = run(
            s,
            [character(Element.Pyro, 10), character(Element.Cryo, 10)],
            ['n1', '2', 'n1', 'n1'],
        )
        expect(damage).toBe(10 + 10 * 1.5 + 10 * 1.5)
    })

    test('melt once', () => {
        const s = new Simulation()
        const damage = run(
            s,
            [character(Element.Cryo, 10), character(Element.Pyro, 10)],
            ['n1', '2', 'n1', 'n1'],
        )
        expect(damage).toBe(10 + 10 * 2 + 10)
    })

    const overloadDamage = [
        [1, 34],
        [10, 68],
        [20, 161],
        [30, 273],
        [40, 415],
        [50, 647],
        [60, 979],
        [70, 1533],
        [80, 2159],
        [90, 2901],
    ]

    test.each(overloadDamage)(
        'overload level %i',
        (level: number, baseDamage: number) => {
            const s = new Simulation()
            const damage = run(
                s,
                [
                    character(Element.Pyro, 10, level),
                    character(Element.Electro, 10, level),
                ],
                ['n1', '2', 'n1'],
            )
            expect(damage).toBe(10 + 10 + baseDamage)
        },
    )

    test.each(overloadDamage)(
        'overload once level %i',
        (level: number, baseDamage: number) => {
            const s = new Simulation()
            const damage = run(
                s,
                [
                    character(Element.Pyro, 10, level),
                    character(Element.Electro, 10, level),
                ],
                ['n1', '2', 'n1', 'n1'],
            )
            expect(damage).toBe(10 + 10 + baseDamage + 10)
        },
    )

    const swirlDamage = [
        [1, 10],
        [10, 20],
        [20, 48],
        [30, 82],
        [40, 124],
        [50, 194],
        [60, 294],
        [70, 460],
        [80, 648],
        [90, 868],
    ] as const

    const swirlElements = [
        [Element.Pyro],
        [Element.Cryo],
        [Element.Electro],
        [Element.Hydro],
    ] as const

    test.each(crossJoin(swirlElements, swirlDamage))(
        'double swirl %s level %i',
        (element: Element, level: number, baseDamage: number) => {
            const s = new Simulation()
            const damage = run(
                s,
                [
                    character(element, 10, level),
                    character(Element.Anemo, 10, level),
                ],
                ['n1', '2', 'n1', 'n1', 'n1'],
            )
            expect(damage).toBe(10 + 10 + baseDamage + 10 + baseDamage + 10)
        },
    )
})
