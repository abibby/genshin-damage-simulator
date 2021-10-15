import { describe, expect, test } from '@jest/globals'
import { BuffCharacter, Element } from '../src/characters/character'
import { Simulation } from '../src/simulator/simulator'
import { basicHit, character, crossJoin, multiHit } from './util'

describe('no reactions', () => {
    test('base damage', () => {
        const s = new Simulation()
        const damage = s.run([character(basicHit(Element.Pyro, 10))], ['n1'])
        expect(damage).toBe(10)
    })

    test('crit', () => {
        const s = new Simulation()
        const damage = s.run(
            [
                character(basicHit(Element.Pyro, 10), 90, {
                    critRate: 50,
                    critDamage: 100,
                }),
            ],
            ['n1'],
        )
        expect(damage).toBe(15)
    })

    test('crit overcap', () => {
        const s = new Simulation()
        const damage = s.run(
            [
                character(basicHit(Element.Pyro, 10), 90, {
                    critRate: 150,
                    critDamage: 100,
                }),
            ],
            ['n1'],
        )
        expect(damage).toBe(20)
    })

    test('multihit', () => {
        const s = new Simulation()
        const damage = s.run(
            [character(multiHit(Element.Pyro, 10, 2, 20))],
            ['n1'],
        )
        expect(damage).toBe(20)
    })
})

describe('buff', () => {
    test('base damage', () => {
        const s = new Simulation()
        const c1 = character([])
        c1.abilities.get('n1')!.buffs[0] = {
            frame: 0,
            duration: 60,
            character: BuffCharacter.All,
            statBonuses: {
                atk: {
                    flat: 50,
                    percent: 0,
                },
            },
        }
        const damage = s.run(
            [c1, character(basicHit(Element.Pyro, 10))],
            ['n1', '2', 'n1'],
        )
        expect(damage).toBe(15)
    })
})

describe('major amping', () => {
    const majorAmping = [
        [Element.Cryo, Element.Pyro],
        [Element.Pyro, Element.Hydro],
    ]

    test.each(majorAmping)(
        'major amping %s -> %s',
        (aura: Element, trigger: Element) => {
            const s = new Simulation()
            const damage = s.run(
                [
                    character(basicHit(aura, 10)),
                    character(basicHit(trigger, 10)),
                ],
                ['n1', '2', 'n1'],
            )
            expect(damage).toBe(10 + 10 * 2)
        },
    )

    test.each(majorAmping)(
        'single major amping %s -> %s',
        (aura: Element, trigger: Element) => {
            const s = new Simulation()
            const damage = s.run(
                [
                    character(basicHit(aura, 10)),
                    character(basicHit(trigger, 10)),
                ],
                ['n1', '2', 'n1', 'n1'],
            )
            expect(damage).toBe(10 + 10 * 2 + 10)
        },
    )

    test.each(majorAmping)(
        'major amping crit %s -> %s',
        (aura: Element, trigger: Element) => {
            const s = new Simulation()
            const damage = s.run(
                [
                    character(basicHit(aura, 10)),
                    character(basicHit(trigger, 10), 90, {
                        critRate: 50,
                        critDamage: 100,
                    }),
                ],
                ['n1', '2', 'n1'],
            )
            expect(damage).toBe(10 + 10 * 2 * 1.5)
        },
    )
})

describe('minor amping', () => {
    const mainorAmping = [
        [Element.Pyro, Element.Cryo],
        [Element.Hydro, Element.Pyro],
    ]

    test.each(mainorAmping)(
        'minor amping %s -> %s',
        (aura: Element, trigger: Element) => {
            const s = new Simulation()
            const damage = s.run(
                [
                    character(basicHit(aura, 10)),
                    character(basicHit(trigger, 10)),
                ],
                ['n1', '2', 'n1'],
            )
            expect(damage).toBe(10 + 10 * 1.5)
        },
    )

    test.each(mainorAmping)(
        'double minor amping %s -> %s',
        (aura: Element, trigger: Element) => {
            const s = new Simulation()
            const damage = s.run(
                [
                    character(basicHit(aura, 10)),
                    character(basicHit(trigger, 10)),
                ],
                ['n1', '2', 'n1', 'n1'],
            )
            expect(damage).toBe(10 + 10 * 1.5 + 10 * 1.5)
        },
    )

    test.each(mainorAmping)(
        'minor amping crit %s -> %s',
        (aura: Element, trigger: Element) => {
            const s = new Simulation()
            const damage = s.run(
                [
                    character(basicHit(aura, 10)),
                    character(basicHit(trigger, 10), 90, {
                        critRate: 50,
                        critDamage: 100,
                    }),
                ],
                ['n1', '2', 'n1'],
            )
            expect(damage).toBe(10 + 10 * 1.5 * 1.5)
        },
    )

    test.each(mainorAmping)(
        'deploy minor amping %s -> %s',
        (aura: Element, trigger: Element) => {
            const s = new Simulation()
            const damage = s.run(
                [
                    character(multiHit(aura, 10, 3, 19)),
                    character(basicHit(trigger, 10)),
                ],
                ['n1', '2', 'n1', 'n1', 'n1', 'n1', 'n1', 'n1'],
            )
            // hydro | pyro vape | hydro | pyro vape | pyro vape | hydro | pyro vape | pyro vape | pyro
            expect(damage).toBe(
                // hydro
                10 * 3 +
                    // pyro vape
                    10 * 1.5 * 5 +
                    // pyro
                    10,
            )
        },
    )

    test.each(mainorAmping)(
        'minor amping em %s -> %s',
        (aura: Element, trigger: Element) => {
            const s = new Simulation()
            const damage = s.run(
                [
                    character(basicHit(aura, 10)),
                    character(basicHit(trigger, 10), 90, {
                        elementalMastery: 100,
                    }),
                ],
                ['n1', '2', 'n1'],
            )
            expect(damage).toBeCloseTo(10 + 10 * 1.5 * 1.18533333)
        },
    )
})

describe('overload', () => {
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
            const damage = s.run(
                [
                    character(basicHit(Element.Pyro, 10), level),
                    character(basicHit(Element.Electro, 10), level),
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
            const damage = s.run(
                [
                    character(basicHit(Element.Pyro, 10), level),
                    character(basicHit(Element.Electro, 10), level),
                ],
                ['n1', '2', 'n1', 'n1'],
            )
            expect(damage).toBe(10 + 10 + baseDamage + 10)
        },
    )

    test.each(overloadDamage)(
        'overload crit level %i',
        (level: number, baseDamage: number) => {
            const s = new Simulation()
            const damage = s.run(
                [
                    character(basicHit(Element.Pyro, 10), level),
                    character(basicHit(Element.Electro, 10), level, {
                        critRate: 50,
                        critDamage: 100,
                    }),
                ],
                ['n1', '2', 'n1'],
            )
            expect(damage).toBe(10 + 10 * 1.5 + baseDamage)
        },
    )

    test.each(overloadDamage)(
        'overload em level %i',
        (level: number, baseDamage: number) => {
            const s = new Simulation()
            const damage = s.run(
                [
                    character(basicHit(Element.Pyro, 10), level),
                    character(basicHit(Element.Electro, 10), level, {
                        elementalMastery: 100,
                    }),
                ],
                ['n1', '2', 'n1'],
            )

            expect(damage).toBeCloseTo(10 + 10 + baseDamage * 1.76190476)
        },
    )
})

describe('swirl', () => {
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
        (aura: Element, level: number, baseDamage: number) => {
            const s = new Simulation()
            const damage = s.run(
                [
                    character(basicHit(aura, 10), level),
                    character(basicHit(Element.Anemo, 10), level),
                ],
                ['n1', '2', 'n1', 'n1', 'n1'],
            )
            expect(damage).toBe(10 + 10 + baseDamage + 10 + baseDamage + 10)
        },
    )

    test.each(crossJoin(swirlElements, swirlDamage))(
        'swirl %s crit level %i',
        (aura: Element, level: number, baseDamage: number) => {
            const s = new Simulation()
            const damage = s.run(
                [
                    character(basicHit(aura, 10), level),
                    character(basicHit(Element.Anemo, 10), level, {
                        critRate: 50,
                        critDamage: 100,
                    }),
                ],
                ['n1', '2', 'n1'],
            )
            expect(damage).toBe(10 + 10 * 1.5 + baseDamage)
        },
    )
})
