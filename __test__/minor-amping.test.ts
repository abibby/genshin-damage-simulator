import { describe, expect, test } from '@jest/globals'
import { Element } from '../src/characters/character'
import { Simulation } from '../src/simulator/simulator'
import { basicHit, character, multiHit } from './util'

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
