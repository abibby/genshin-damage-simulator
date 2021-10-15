import { describe, expect, test } from '@jest/globals'
import { BuffCharacter, Element } from '../src/characters/character'
import { Simulation } from '../src/simulator/simulator'
import { basicHit, character } from './util'

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
