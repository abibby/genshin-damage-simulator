package simulator

import "fmt"

type Ability interface {
	Name() string
	FrameCount(s *Simulation, c Character) int
	CanUse(s *Simulation, c Character) bool
	Damage(s *Simulation, c Character) Damage
}

type NormalAttack struct {
	attackNumber int
	frameCount   int
	damage       Damage
}

var _ Ability = &NormalAttack{}

func NewNormalAttack(attackNumber, frameCount int, damage Damage) Ability {
	return &NormalAttack{
		attackNumber: attackNumber,
		frameCount:   frameCount,
		damage:       damage,
	}
}

func (n *NormalAttack) Name() string {
	return fmt.Sprintf("n%d", n.attackNumber)
}
func (n *NormalAttack) FrameCount(s *Simulation, c Character) int {
	return n.frameCount
}
func (n *NormalAttack) CanUse(s *Simulation, c Character) bool {
	return true
}
func (n *NormalAttack) Damage(s *Simulation, c Character) Damage {
	return n.damage
}

type ChargeAttack struct {
	frameCount  int
	staminaCost int
	damage      Damage
}

var _ Ability = &ChargeAttack{}

func NewChargeAttack(frameCount, staminaCost int, damage Damage) Ability {
	return &ChargeAttack{
		frameCount:  frameCount,
		staminaCost: staminaCost,
		damage:      damage,
	}
}
func (c *ChargeAttack) Name() string {
	return "c"
}
func (c *ChargeAttack) FrameCount(s *Simulation, character Character) int {
	return c.frameCount
}
func (c *ChargeAttack) CanUse(s *Simulation, character Character) bool {
	return character.Stamina() >= float64(c.staminaCost)
}
func (c *ChargeAttack) Damage(s *Simulation, character Character) Damage {
	character.UseStamina(float64(c.staminaCost))
	return c.damage
}

type ElementalSkill struct {
	frameCount int
	cooldown   int // cooldown in frames
	charges    int
	damage     Damage
}

var _ Ability = &ElementalSkill{}

func NewElementalSkill(frameCount, cooldown, charges int, damage Damage) Ability {
	return &ElementalSkill{
		frameCount: frameCount,
		cooldown:   cooldown,
		charges:    charges,
		damage:     damage,
	}
}
func (e *ElementalSkill) Name() string {
	return "e"
}
func (e *ElementalSkill) FrameCount(s *Simulation, character Character) int {
	return e.frameCount
}
func (e *ElementalSkill) CanUse(s *Simulation, character Character) bool {
	// TODO: implement multiple charges
	return character.OnCooldown(e.Name(), s.Frame)
}
func (e *ElementalSkill) Damage(s *Simulation, character Character) Damage {
	character.CastCooldown(e.Name(), e.cooldown, s.Frame)
	return e.damage
}
