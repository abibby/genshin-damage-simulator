import { Character, getStat } from '../characters/character'

export class Simulation {
    private activeCharacterIndex: number = 0

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

export function run(
    simulation: Simulation,
    characters: Character[],
    sequence: string[],
): number {
    console.log('run')

    let totalDamage = 0
    for (const step of sequence) {
        console.log(step)
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
            console.log(hit)

            totalDamage += (hit.motionValue * getStat(c.stats, hit.stat)) / 100
        }
    }
    return totalDamage
}
