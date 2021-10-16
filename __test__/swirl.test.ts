import { describe, expect, test } from '@jest/globals'
import { Element } from '../src/characters/character'
import { Simulation } from '../src/simulator/simulator'
import { basicHit, character, crossJoin } from './util'

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
