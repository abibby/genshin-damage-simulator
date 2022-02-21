import { describe, expect, test } from '@jest/globals'
import { Element } from '../src/characters/character'
import { Simulation } from '../src/simulator/simulator'
import { basicHit, character } from './util'

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
