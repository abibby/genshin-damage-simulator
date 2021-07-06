package simulator

import "fmt"

type Ability interface {
	Name() string
	FrameCount(s *Simulation, c Character) int
	CanUse(s *Simulation, c Character) bool
	Damage(s *Simulation, c Character) Damage
}

type NormalAttack struct {
	name       string
	frameCount int
	damage     Damage
}

var _ Ability = &NormalAttack{}

func NewNormalAttack(name string, frameCount, damage int) Ability {
	return &NormalAttack{
		name:       name,
		frameCount: frameCount,
		damage: Damage{DamageInstance{
			Frame:   0,
			Damage:  float32(damage),
			Element: Physical,
			Gauge:   0,
		}},
	}
}
func NewNormalAttacks(v ...int) []Ability {
	if len(v)%2 != 0 {
		panic("len(v) must be even")
	}
	a := make([]Ability, 0, len(v)/2)
	for i := 0; i < len(v); i += 2 {
		a = append(a, NewNormalAttack(fmt.Sprintf("n%d", i/2), v[i], v[i+1]))
	}
	return a
}
func (n *NormalAttack) Name() string {
	return n.name
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

// func NewAbility(name string, canUse func(c *Character) bool, damage func(c *Character) int) *Ability {
// 	return &Ability{
// 		Name:   name,
// 		CanUse: canUse,
// 		Damage: damage,
// 	}
// }

// func NewBasicAttack(name string, damage int) *Ability {
// 	return &Ability{
// 		Name: name,
// 		CanUse: func(c *Character) bool {
// 			return true
// 		},
// 		Damage: func(c *Character) int {
// 			return damage
// 		},
// 	}
// }

// func NewChargeAttack(name string, damage, stamina int) *Ability {
// 	return &Ability{
// 		Name: name,
// 		CanUse: func(c *Character) bool {
// 			return c.stamina >= stamina
// 		},
// 		Damage: func(c *Character) int {
// 			c.stamina -= stamina
// 			return damage
// 		},
// 	}
// }
