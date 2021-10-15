import { describe, expect, test } from '@jest/globals'
import { Element } from '../src/characters/character'
import { Simulation } from '../src/simulator/simulator'
import { basicHit, character, multiHit } from './util'

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
