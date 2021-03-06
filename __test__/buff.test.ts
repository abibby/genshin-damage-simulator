import { describe, expect, test } from '@jest/globals'
import { BuffCharacter, Element, SkillType } from '../src/characters/character'
import { characterSwitchTime, Simulation } from '../src/simulator/simulator'
import { basicHit, character, multiHit } from './util'

describe('buff', () => {
    test('base damage', () => {
        const s = new Simulation()
        const c1 = character([])
        c1.abilities.get('n1')!.buffs[0] = {
            frame: 0,
            duration: characterSwitchTime + 60,
            character: BuffCharacter.All,
            bonuses: [
                {
                    flat: 50,
                    percent: 0,
                    target: 'atk',
                    conditions: {},
                },
            ],
        }
        const damage = s.run(
            [c1, character(basicHit(Element.Pyro, 10))],
            ['n1', '2', 'n1'],
        )
        expect(damage).toBe(15)
    })

    test('snapshot', () => {
        const s = new Simulation()
        const c1 = character([])
        c1.abilities.get('n1')!.buffs[0] = {
            frame: 0,
            duration: characterSwitchTime + 15,
            character: BuffCharacter.All,
            bonuses: [
                {
                    flat: 50,
                    percent: 0,
                    target: 'atk',
                    conditions: {},
                },
            ],
        }

        const c2 = character(multiHit(Element.Pyro, 10, 2, 10))
        c2.abilities.get('n1')!.snapshot = true

        const damage = s.run([c1, c2], ['n1', '2', 'n1'])
        expect(damage).toBe(characterSwitchTime)
    })

    test('non snapshot', () => {
        const s = new Simulation()
        const c1 = character([])
        c1.abilities.get('n1')!.buffs[0] = {
            frame: 0,
            duration: characterSwitchTime + 15,
            character: BuffCharacter.All,
            bonuses: [
                {
                    flat: 50,
                    percent: 0,
                    target: 'atk',
                    conditions: {},
                },
            ],
        }

        const c2 = character(multiHit(Element.Pyro, 10, 2, 10))

        const damage = s.run([c1, c2], ['n1', '2', 'n1'])
        expect(damage).toBe(25)
    })

    test('flat damage', () => {
        const s = new Simulation()
        const c1 = character([])
        c1.abilities.get('n1')!.buffs[0] = {
            frame: 0,
            duration: characterSwitchTime + 60,
            character: BuffCharacter.All,
            bonuses: [
                {
                    flat: 50,
                    percent: 0,
                    target: SkillType.Normal,
                    conditions: {},
                },
            ],
        }

        const c2 = character(basicHit(Element.Pyro, 10))

        const damage = s.run([c1, c2], ['n1', '2', 'n1'])
        expect(damage).toBe(60)
    })

    // TODO: add test for conditions, e.g. dont buff noncryo damage on cryo condition
})
