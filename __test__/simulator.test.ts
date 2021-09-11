import { describe, expect, test } from '@jest/globals'
import { Ability, Character, Element, Stat } from '../src/characters/character'
import { run, Simulation } from '../src/simulator/simulator'

function character(element: Element, mv: number): Character {
    return {
        name: 'test character',
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
})
