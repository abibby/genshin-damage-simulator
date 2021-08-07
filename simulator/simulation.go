package simulator

import (
	"math/rand"
	"os"

	"github.com/davecgh/go-spew/spew"
)

type EventType string

const (
	EventBeforeNormalAttack = "before-normal-attack"
	EventAfterNormalAttack  = "after-normal-attack"

	EventBeforeChargeAttack = "before-charge-attack"
	EventAfterChargeAttack  = "after-charge-attack"

	EventBeforeElementalSkill = "before-elemental-skill"
	EventAfterElementalSkill  = "after-elemental-skill"

	EventBeforeElementalBurst = "before-elemental-burst"
	EventAfterElementalBurst  = "after-elemental-burst"
)

const FPS = 60

type Simulation struct {
	*EventTarget

	Frame  int
	Random rand.Rand
}

func NewSimulation() *Simulation {
	return &Simulation{
		EventTarget: NewEventTarget(),
	}
}

func SimulateCharacter(s *Simulation, c Character, totalFrames int) {
	damages := []Damage{}
	abilities := c.Abilities()
	for s.Frame < totalFrames {
		for _, ability := range abilities {
			if !ability.CanUse(s, c) {
				continue
			}
			damages = append(damages, ability.Damage(s, c))
			s.Frame += ability.FrameCount(s, c)
			break
		}
	}

	spew.Dump(TotalDamage(damages))
	os.Exit(1)
}

func TotalDamage(damages []Damage) float32 {
	totalDamage := float32(0)

	for _, d := range damages {
		for _, instance := range d {
			totalDamage += instance.Damage
		}
	}

	return totalDamage
}
