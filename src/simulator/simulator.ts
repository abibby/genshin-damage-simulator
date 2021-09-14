import { Character, Element, getStat } from '../characters/character'

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

function swirl(dmg: number, em: number, level: number): [number, number] {
    const baseDamage =
        [10, 20, 48, 82, 124, 194, 294, 460, 648, 868][
            Math.floor(level / 10)
        ] ?? 0
    return [dmg + baseDamage, 0.625]
}

const reactions: Reactions = {
    [Element.Pyro]: {
        [Element.Anemo]: swirl,
        [Element.Cryo](dmg, em) {
            return [dmg * 1.5, 0.625]
        },
        [Element.Electro](dmg, em, level) {
            const baseDamage =
                [34, 68, 161, 273, 415, 647, 979, 1533, 2159, 2901][
                    Math.floor(level / 10)
                ] ?? 0
            return [dmg + baseDamage, 1.25]
        },
    },
    [Element.Cryo]: {
        [Element.Anemo]: swirl,
        [Element.Pyro](dmg, em) {
            return [dmg * 2, 2.5]
        },
    },
    [Element.Hydro]: {
        [Element.Anemo]: swirl,
    },
    // [Element.Anemo]: undefined,
    [Element.Electro]: {
        [Element.Anemo]: swirl,
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

export function run(
    simulation: Simulation,
    characters: Character[],
    sequence: string[],
): number {
    const instances: DamageInstance[] = []
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
        for (const hit of ability.hits) {
            instances.push({
                element: hit.element,
                gauge: hit.gauge,
                damage: (hit.motionValue / 100) * getStat(c.stats, hit.stat),
                elementalMastery: c.stats.elementalMastery,
                level: c.level,
            })
        }
    }
    return instances.reduce((total, instance) => {
        const [damage, gaugeModifier] = reaction(
            simulation.aura,
            instance.element,
            instance.damage,
            instance.elementalMastery,
            instance.level,
        )
        if (simulation.gauge === 0) {
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
