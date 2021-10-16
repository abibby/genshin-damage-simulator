import { describe, expect, test } from '@jest/globals'
import { Element, SkillType, TriggerType } from '../src/characters/character'
import { Simulation } from '../src/simulator/simulator'
import { basicHit, character } from './util'

describe('trigges', () => {
    test('triggered on cast', () => {
        const s = new Simulation()
        const c1 = character([])
        c1.abilities.get('n1')!.triggers.push({
            trigger: TriggerType.Cast,
            type: SkillType.Normal,
            duration: 100,
            hits: basicHit(Element.Pyro, 20),
        })
        const damage = s.run(
            [c1, character(basicHit(Element.Pyro, 10))],
            ['n1', '2', 'n1'],
        )
        expect(damage).toBe(30)
    })

    test('triggered on damage', () => {
        const s = new Simulation()
        const c1 = character([])
        c1.abilities.get('n1')!.triggers.push({
            trigger: TriggerType.Damage,
            type: SkillType.Normal,
            duration: 100,
            hits: basicHit(Element.Pyro, 20),
        })
        const damage = s.run(
            [c1, character(basicHit(Element.Pyro, 10))],
            ['n1', '2', 'n1'],
        )
        expect(damage).toBe(30)
    })
})
