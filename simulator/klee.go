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
		[]EventType{EventNormalAttack, EventElementalSkill},
		func(e *Event) {
			k.explosiveSpark++
		},
	)
	s.AddEventListener(EventChargeAttack, func(e *Event) {
		k.ClearBuff("pounding-supprise")
	})
}

type KaboomChargeAttack struct{}

var _ Ability = &KaboomChargeAttack{}

func (k *KaboomChargeAttack) Name() string                              { return "c" }
func (k *KaboomChargeAttack) CanUse(s *Simulation, c Character) bool    { return c.Stamina() >= 50 }
func (k *KaboomChargeAttack) FrameCount(s *Simulation, c Character) int { return 10 }
func (k *KaboomChargeAttack) Damage(s *Simulation, c Character) Damage {
	c.UseStamina(50)
	if c.(*Klee).explosiveSpark >= 2 {
		c.AddBuff("pounding-supprise", Stats{
			DamagePercent: 50,
		})
	}
	return Damage{DamageInstance{
		Frame:   0,
		Damage:  283,
		Element: Pyro,
		Gauge:   1,
	}}
}

func (k *Klee) Abilities() []Ability {
	abilities := []Ability{}
	abilities = append(abilities, NewNormalAttacks(
		10, 130,
		10, 112,
		10, 162,
	)...)
	return abilities
}
