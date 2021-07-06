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
}

type Initializer interface {
	Initialize(s *Simulation)
}

type BaseCharacter struct {
	stamina   float64
	baseStats Stats
	buffs     map[string]Stats
}

var _ Character = &BaseCharacter{}

func (c *BaseCharacter) Name() string {
	return "Base Character"
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

// var Klee = &Character{
// 	Name: "Klee",
// 	Abilities: []*Ability{
// 		NewAbility(
// 			"n1",
// 			func(c *Character) bool { return true },
// 			func(c *Character) int {
// 				c.AddCooldown("explosive-spark", 1)
// 				return 130
// 			},
// 		),
// 		NewAbility(
// 			"n2",
// 			func(c *Character) bool { return true },
// 			func(c *Character) int {
// 				c.AddCooldown("explosive-spark", 1)
// 				return 130 + 112
// 			},
// 		),
// 		NewAbility(
// 			"n3",
// 			func(c *Character) bool { return true },
// 			func(c *Character) int {
// 				c.AddCooldown("explosive-spark", 1)
// 				return 130 + 112 + 162
// 			},
// 		),
// 		NewAbility(
// 			"c",
// 			func(c *Character) bool { return c.stamina >= 50 },
// 			func(c *Character) int {
// 				c.stamina -= 50
// 				if c.GetCooldown("explosive-spark") >= 2 {

// 				}
// 				return 283
// 			},
// 		),
// 		NewAbility(
// 			"e",
// 			func(c *Character) bool { return c.GetCooldown("e") == 0 },
// 			func(c *Character) int {
// 				c.stamina -= 50
// 				c.ResetCooldown("explosive-spark")
// 				return 283
// 			},
// 		),
// 	},
// 	Update: func(c *Character) {
// 		c.SubCooldown("e", 1)
// 	},
// }
