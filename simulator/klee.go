package simulator

type Klee struct {
	BaseCharacter

	explosiveSpark int8
}

var _ Character = &Klee{}

func (k *Klee) Name() string {
	return "Klee"
}

func (k *Klee) Initialize(s *Simulation) {
	s.AddEventListeners(
		[]EventType{EventAfterNormalAttack, EventAfterElementalSkill},
		func(e *Event) {
			k.explosiveSpark++
		},
	)
	s.AddEventListener(EventBeforeChargeAttack, func(e *Event) {
		if k.explosiveSpark >= 2 {
			k.explosiveSpark = 0
			k.AddBuff("pounding-supprise", Stats{
				DamagePercent: 50,
			})
		}
	})
	s.AddEventListener(EventAfterChargeAttack, func(e *Event) {
		k.ClearBuff("pounding-supprise")
	})
}

func (k *Klee) Abilities() []Ability {
	return []Ability{
		NewNormalAttack(1, 10, PyroDamage(130, 1)),
		NewNormalAttack(2, 10, PyroDamage(112, 1)),
		NewNormalAttack(3, 10, PyroDamage(162, 1)),

		NewChargeAttack(20, 50, PyroDamage(283, 1)),

		NewElementalSkill(10, 15*FPS, 2, Damage{
			DamageInstance{
				Frame:   0,
				Damage:  95.2,
				Element: Pyro,
				Gauge:   0.5,
			},
			DamageInstance{
				Frame:   10,
				Damage:  95.2,
				Element: Pyro,
				Gauge:   0.5,
			},
			DamageInstance{
				Frame:   20,
				Damage:  95.2,
				Element: Pyro,
				Gauge:   0.5,
			},
		}),
	}
}
