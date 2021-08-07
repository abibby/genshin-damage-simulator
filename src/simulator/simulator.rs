use crate::character;
use crate::simulator;

struct Simulation {
    damage_instances: Vec<character::DamageInstance>,
    total_damage: f32,
    current_frame: simulator::Frame,
}

pub fn simulate(sequence: Vec<&str>, char: character::Character, length: simulator::Frame) -> f32 {
    let mut s = Simulation {
        damage_instances: Vec::with_capacity(30),
        total_damage: 0.0,
        current_frame: 0,
    };
    for input in sequence {
        let succ = match char.abilities.get(input) {
            Some(ability) => {
                for d in ability.damage {
                    s.damage_instances.push(character::DamageInstance {
                        frame: d.frame + s.current_frame,
                        element: d.element,
                        damage: d.damage,
                    })
                }
                true
            }
            _ => false,
        };
        if !succ {
            return -1.0;
        }
    }

    for d in s.damage_instances {
        s.total_damage += d.damage
    }

    s.total_damage
}
