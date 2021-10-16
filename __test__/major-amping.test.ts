import { describe, expect, test } from '@jest/globals'
import { Element } from '../src/characters/character'
import { Simulation } from '../src/simulator/simulator'
import { basicHit, character } from './util'

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
