package simulator

import "math"

const MaxStamina = 240

type Character interface {
	Name() string
	Stamina() float64
	UseStamina(float64)
	GainStamina(float64)
	Stats() Stats
	AddBuff(name string, buff Stats)
	ClearBuff(name string)
	Abilities() []Ability
	OnCooldown(name string, currentFrame int) bool
	CastCooldown(name string, cooldown, currentFrame int)
}

type Initializer interface {
	Initialize(s *Simulation)
}

type BaseCharacter struct {
	stamina   float64
	baseStats Stats
	buffs     map[string]Stats
	cooldowns map[string]int
}

func (c *BaseCharacter) Stamina() float64 {
	return c.stamina
}
func (c *BaseCharacter) GainStamina(s float64) {
	c.updateStamina(s)
}
func (c *BaseCharacter) UseStamina(s float64) {
	c.updateStamina(-s)
}
func (c *BaseCharacter) updateStamina(s float64) {
	c.stamina += math.Min(math.Max(c.stamina, 0), MaxStamina)
}

func (c *BaseCharacter) Stats() Stats {
	s := c.baseStats
	for _, b := range c.buffs {
		s.AttackPercent += b.AttackPercent
		s.FlatAttack += b.FlatAttack
		s.ElementalMastery += b.ElementalMastery
		s.DamagePercent += b.DamagePercent
	}
	return s
}
func (c *BaseCharacter) AddBuff(name string, buffs Stats) {
	c.buffs[name] = buffs
}
func (c *BaseCharacter) ClearBuff(name string) {
	delete(c.buffs, name)
}

func (c *BaseCharacter) OnCooldown(name string, currentFrame int) bool {
	endFrame, ok := c.cooldowns[name]
	return !ok || endFrame < currentFrame
}

func (c *BaseCharacter) CastCooldown(name string, cooldown, currentFrame int) {
	c.cooldowns[name] = currentFrame + cooldown
}
