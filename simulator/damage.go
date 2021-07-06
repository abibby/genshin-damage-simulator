package simulator

type DamageInstance struct {
	Frame   int
	Damage  float32
	Element Element
	Gauge   float32
}

type Damage []DamageInstance
