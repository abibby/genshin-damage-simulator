import { Character, Element, getStat } from '../characters/character'
import { byKey } from '../utils'

export class Simulation {
    private activeCharacterIndex: number = 0
    public aura: Element = Element.Physical
    public gauge: number = 0

    public activeCharacter(characters: Character[]): Character {
        const c = characters[this.activeCharacterIndex]
        if (c === undefined) {
            throw new Error(
                `No character at index ${this.activeCharacterIndex}`,
            )
        }
        return c
    }
    public setActiveCharacter(i: number): void {
        this.activeCharacterIndex = i - 1
    }
}

interface DamageInstance {
    element: Element
    gauge: number
    damage: number
    elementalMastery: number
    level: number
    frame: number
}

// https://library.keqingmains.com/mechanics/combat/elemental-reactions/elemental-gauge-theory
type Reactions = {
    [P in Element]?: {
        [Q in Element]?: (
            damage: number,
            elementalMastery: number,
            level: number,
        ) => [number, number]
    }
}

function transformativeEMBonus(em: number): number {
    return 1 + (1600 * (em / (em + 2000))) / 100
}
function swirl(dmg: number, em: number, level: number): [number, number] {
    const baseDamage =
        [10, 20, 48, 82, 124, 194, 294, 460, 648, 868][
            Math.floor(level / 10)
        ] ?? 0
    return [dmg + baseDamage * transformativeEMBonus(em), 0.625]
}

function overload(dmg: number, em: number, level: number): [number, number] {
    const baseDamage =
        [34, 68, 161, 273, 415, 647, 979, 1533, 2159, 2901][
            Math.floor(level / 10)
        ] ?? 0
    return [dmg + baseDamage * transformativeEMBonus(em), 1.25]
}

function ampingEMBonus(em: number): number {
    return 1 + (278 * (em / (em + 1400))) / 100
}

function majorAmplifying(dmg: number, em: number): [number, number] {
    return [dmg * 2 * ampingEMBonus(em), 2.5]
}

function minorAmplifying(dmg: number, em: number): [number, number] {
    return [dmg * 1.5 * ampingEMBonus(em), 0.625]
}
function crystallize(dmg: number): [number, number] {
    return [dmg, 0.625]
}

const reactions: Reactions = {
    [Element.Pyro]: {
        [Element.Anemo]: swirl,
        [Element.Geo]: crystallize,
        [Element.Cryo]: minorAmplifying,
        [Element.Electro]: overload,
        [Element.Hydro]: majorAmplifying,
    },
    [Element.Cryo]: {
        [Element.Anemo]: swirl,
        [Element.Geo]: crystallize,
        [Element.Pyro]: majorAmplifying,
    },
    [Element.Hydro]: {
        [Element.Anemo]: swirl,
        [Element.Geo]: crystallize,
        [Element.Pyro]: minorAmplifying,
    },
    // [Element.Anemo]: undefined,
    [Element.Electro]: {
        [Element.Anemo]: swirl,
        [Element.Geo]: crystallize,
        [Element.Pyro]: overload,
    },
    // [Element.Dendro]: undefined,
    // [Element.Geo]: undefined,
    // [Element.Physical]: undefined,
}

function reaction(
    aura: Element,
    trigger: Element,
    damage: number,
    elementalMastery: number,
    level: number,
): [number, number] {
    return (
        reactions[aura]?.[trigger]?.(damage, elementalMastery, level) ?? [
            damage,
            0,
        ]
    )
}

function critDamage(c: Character, baseDamage: number): number {
    const cr = Math.min(c.stats.critRate / 100, 1)
    const cd = c.stats.critDamage / 100
    return baseDamage * cr * (1 + cd) + baseDamage * (1 - cr)
}

export function run(
    simulation: Simulation,
    characters: Character[],
    sequence: string[],
): number {
    const instances: DamageInstance[] = []
    let currentFrame = 0
    for (const step of sequence) {
        if (step.match(/^[1-4]$/)) {
            simulation.setActiveCharacter(Number(step))
            continue
        }
        const c = simulation.activeCharacter(characters)
        const ability = c.abilities.get(step)
        if (ability === undefined) {
            throw new Error(`No ability ${step} on character ${c.name}`)
        }
        currentFrame += ability.castTime
        for (const hit of ability.hits) {
            instances.push({
                frame: currentFrame + hit.frame,
                element: hit.element,
                gauge: hit.gauge,
                damage: critDamage(
                    c,
                    (hit.motionValue / 100) * getStat(c.stats, hit.stat),
                ),
                elementalMastery: c.stats.elementalMastery,
                level: c.level,
            })
        }
    }

    instances.sort(byKey('frame'))

    return instances.reduce((total, instance) => {
        const [damage, gaugeModifier] = reaction(
            simulation.aura,
            instance.element,
            instance.damage,
            instance.elementalMastery,
            instance.level,
        )
        if (simulation.gauge === 0 || simulation.aura === instance.element) {
            simulation.aura = instance.element
            simulation.gauge = instance.gauge
        } else {
            simulation.gauge -= instance.gauge * gaugeModifier
        }
        if (simulation.gauge <= 0) {
            simulation.aura = Element.Physical
            simulation.gauge = 0
        }
        return total + damage
    }, 0)
}
