import PriorityQueue from 'priorityqueuejs'
import {
    addStatBonuses,
    Character,
    Element,
    Hit,
    SkillType,
    StatBonuses,
    Stats,
    TriggerType,
} from '../characters/character'
import { TimedMap } from './timed-map'

interface DamageInstance {
    type: 'damage'
    element: Element
    gauge: number
    motionValue: number
    stat: keyof Stats
    character: Character
    startFrame: number
}

interface BuffInstance {
    type: 'buff'
    name: string
    character: Character
    statBonuses: StatBonuses
    startFrame: number
    endFrame: number
}

interface TriggerInstance {
    type: 'trigger'
    name: string
    character: Character
    trigger: TriggerType
    skillType: SkillType
    hits: Hit[]
    startFrame: number
    endFrame: number
}

type Instance = DamageInstance | BuffInstance | TriggerInstance

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

export class Simulation {
    private activeCharacterIndex = 0
    private aura: Element = Element.Physical
    private gauge = 0
    private currentFrame = 0
    private totalDamage = 0

    private readonly buffs = new TimedMap<BuffInstance>()
    private readonly triggers = new TimedMap<TriggerInstance>()

    private activeCharacter(characters: Character[]): Character {
        const c = characters[this.activeCharacterIndex]
        if (c === undefined) {
            throw new Error(
                `No character at index ${this.activeCharacterIndex}`,
            )
        }
        return c
    }
    private setActiveCharacter(i: number): void {
        this.activeCharacterIndex = i - 1
    }

    private getStat(
        character: Character,
        frame: number,
        key: keyof Stats,
    ): number {
        let buffs: StatBonuses = {}
        for (const buff of this.buffs.atTime(frame)) {
            buffs = addStatBonuses(buffs, buff.statBonuses)
        }

        const stat = character.stats[key]

        const buff = buffs[key] ?? { percent: 0, flat: 0 }
        if (typeof stat === 'number') {
            return stat + buff.flat
        }
        return stat.valueWithBonus(buff)
    }

    private getTriggedDamage(
        type: SkillType | null,
        triggerType: TriggerType,
        frame: number,
    ): DamageInstance[] {
        const instances: DamageInstance[] = []

        for (const trigger of this.triggers.atTime(frame)) {
            if (
                (trigger.skillType === type || trigger.skillType === null) &&
                trigger.trigger === triggerType
            ) {
                for (const hit of trigger.hits) {
                    instances.push({
                        type: 'damage',
                        startFrame: frame + hit.frame,
                        element: hit.element,
                        gauge: hit.gauge,
                        motionValue: hit.motionValue,
                        stat: hit.stat,
                        character: trigger.character,
                    })
                }
            }
        }

        return instances
    }

    public run(characters: Character[], sequence: string[]): number {
        const instanceQueue = new PriorityQueue<Instance>(
            (a, b) => b.startFrame - a.startFrame,
        )
        // const instances: DamageInstance[] = []
        // let totalDamage = 0
        // let currentFrame = 0
        for (const step of sequence.concat(['end'])) {
            if (step.match(/^[1-4]$/)) {
                this.setActiveCharacter(Number(step))
                continue
            }
            const c = this.activeCharacter(characters)
            if (step === 'end') {
                this.currentFrame = Number.MAX_SAFE_INTEGER
            } else {
                const ability = c.abilities.get(step)
                if (ability === undefined) {
                    throw new Error(`No ability ${step} on character ${c.name}`)
                }
                this.currentFrame += ability.castTime

                for (const buff of ability.buffs) {
                    instanceQueue.enq({
                        type: 'buff',
                        name: ability.name,
                        startFrame: this.currentFrame + buff.frame,
                        endFrame:
                            this.currentFrame + buff.frame + buff.duration,
                        character: c,
                        statBonuses: buff.statBonuses,
                    })
                }

                for (const trigger of ability.triggers) {
                    this.triggers.set({
                        type: 'trigger',
                        name: ability.name,
                        skillType: ability.type,
                        character: c,
                        hits: trigger.hits,
                        trigger: trigger.trigger,
                        startFrame: this.currentFrame + ability.castTime,
                        endFrame: this.currentFrame + trigger.duration,
                    })
                }

                for (const hit of ability.hits) {
                    instanceQueue.enq({
                        type: 'damage',
                        startFrame: this.currentFrame + hit.frame,
                        element: hit.element,
                        gauge: hit.gauge,
                        motionValue: hit.motionValue,
                        stat: hit.stat,
                        character: c,
                    })
                    for (const instance of this.getTriggedDamage(
                        ability.type,
                        TriggerType.Damage,
                        this.currentFrame + hit.frame,
                    )) {
                        instanceQueue.enq(instance)
                    }
                }
                for (const instance of this.getTriggedDamage(
                    ability.type,
                    TriggerType.Cast,
                    this.currentFrame,
                )) {
                    instanceQueue.enq(instance)
                }
            }

            while (
                !instanceQueue.isEmpty() &&
                instanceQueue.peek().startFrame < this.currentFrame
            ) {
                const instance = instanceQueue.deq()
                switch (instance.type) {
                    case 'damage':
                        this.totalDamage += this.simulateInstance(instance)
                        break
                    case 'buff':
                        this.buffs.set(instance)
                        break
                    case 'trigger':
                        break
                }
            }
        }

        return this.totalDamage
    }

    private simulateInstance(instance: DamageInstance): number {
        const [damage, gaugeModifier] = reaction(
            this.aura,
            instance.element,
            critDamage(
                instance.character,
                (instance.motionValue / 100) *
                    this.getStat(
                        instance.character,
                        instance.startFrame,
                        instance.stat,
                    ),
            ),
            instance.character.stats.elementalMastery,
            instance.character.level,
        )

        if (this.gauge === 0 || this.aura === instance.element) {
            this.aura = instance.element
            this.gauge = instance.gauge
        } else {
            this.gauge -= instance.gauge * gaugeModifier
        }
        if (this.gauge <= 0) {
            this.aura = Element.Physical
            this.gauge = 0
        }
        return damage
    }
}
