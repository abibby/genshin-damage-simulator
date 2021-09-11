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
}

type Reactions = {
    [P in Element]?: {
        [Q in Element]?: (
            damage: number,
            elementalMastery: number,
        ) => [number, number]
    }
}

const reactions: Reactions = {
    [Element.Pyro]: {
        [Element.Cryo](dmg, em) {
            return [dmg * 1.5, 0.625]
        },
    },
    [Element.Cryo]: {
        [Element.Pyro](dmg, em) {
            return [dmg * 2, 2.5]
        },
    },
    // [Element.Hydro]: undefined,
    // [Element.Anemo]: undefined,
    // [Element.Electro]: undefined,
    // [Element.Dendro]: undefined,
    // [Element.Geo]: undefined,
    // [Element.Physical]: undefined,
}

function reaction(
    aura: Element,
    trigger: Element,
    damage: number,
    elementalMastery: number,
): [number, number] {
    return reactions[aura]?.[trigger]?.(damage, elementalMastery) ?? [damage, 0]
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
            })
        }
    }
    return instances.reduce((total, instance) => {
        const [damage, gaugeModifier] = reaction(
            simulation.aura,
            instance.element,
            instance.damage,
            instance.elementalMastery,
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
