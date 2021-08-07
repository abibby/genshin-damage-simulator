package simulator

type DamageInstance struct {
	Frame   int
	Damage  float32
	Element Element
	Gauge   float32
}

type Damage []DamageInstance

func PhysicalDamage(damage float32) Damage {
	return Damage{DamageInstance{
		Frame:   0,
		Damage:  damage,
		Element: Physical,
		Gauge:   0,
	}}
}

func PyroDamage(damage, gauge float32) Damage {
	return Damage{DamageInstance{
		Frame:   0,
		Damage:  damage,
		Element: Pyro,
		Gauge:   gauge,
	}}
}

func HydroDamage(damage, gauge float32) Damage {
	return Damage{DamageInstance{
		Frame:   0,
		Damage:  damage,
		Element: Hydro,
		Gauge:   gauge,
	}}
}

func DendroDamage(damage, gauge float32) Damage {
	return Damage{DamageInstance{
		Frame:   0,
		Damage:  damage,
		Element: Dendro,
		Gauge:   gauge,
	}}
}

func ElectroDamage(damage, gauge float32) Damage {
	return Damage{DamageInstance{
		Frame:   0,
		Damage:  damage,
		Element: Electro,
		Gauge:   gauge,
	}}
}

func AnemoDamage(damage, gauge float32) Damage {
	return Damage{DamageInstance{
		Frame:   0,
		Damage:  damage,
		Element: Anemo,
		Gauge:   gauge,
	}}
}

func CryoDamage(damage, gauge float32) Damage {
	return Damage{DamageInstance{
		Frame:   0,
		Damage:  damage,
		Element: Cryo,
		Gauge:   gauge,
	}}
}

func GeoDamage(damage, gauge float32) Damage {
	return Damage{DamageInstance{
		Frame:   0,
		Damage:  damage,
		Element: Geo,
		Gauge:   gauge,
	}}
}
