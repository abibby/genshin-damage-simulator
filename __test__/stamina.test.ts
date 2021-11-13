import { describe, expect, test } from '@jest/globals'
import { Element } from '../src/characters/character'
import { OutOfStaminaError } from '../src/simulator/errors'
import { Simulation } from '../src/simulator/simulator'
import { basicHit, character } from './util'

describe('no reactions', () => {
    test('stamina', () => {
        const s = new Simulation()
        const c = character(basicHit(Element.Pyro, 10))

        c.abilities.get('n1')!.castTime = 100
        c.abilities.get('n1')!.stamina = 100
        const damage = s.run([c], ['n1', 'n1'])

        expect(damage).toEqual(20)
    })

    test('out of stamina', () => {
        const s = new Simulation()
        const c = character(basicHit(Element.Pyro, 10))

        c.abilities.get('n1')!.stamina = 240

        expect(() => s.run([c], ['n1', 'n1'])).toThrowError(OutOfStaminaError)
    })

    test('out of stamina', () => {
        const s = new Simulation()
        const c1 = character(basicHit(Element.Pyro, 10))
        const c2 = character([])

        c1.abilities.get('n1')!.stamina = 240

        c2.abilities.get('n1')!.castTime = 1000

        const damage = s.run([c1, c2], ['n1', '2', 'n1', '1', 'n1'])

        expect(damage).toEqual(20)
    })
})
