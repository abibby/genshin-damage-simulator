#[path = "../simulator/mod.rs"]
mod simulator;

use crate::character::*;
use simulator::SECOND;
use std::collections::HashMap;

pub fn klee<'a>() -> Character<'a> {
    let abilities = &mut HashMap::new();
    abilities.insert(
        "n1",
        Ability {
            name: "n1",
            damage: vec![DamageInstance {
                frame: 0,
                damage: 130.0,
                element: Element::Pyro,
            }],
            cast_time: 36,
            stop_on_switch: false,
            icd: 2 * SECOND,
        },
    );
    abilities.insert(
        "n3",
        Ability {
            name: "n3",
            damage: vec![
                DamageInstance {
                    frame: 0,
                    damage: 130.0,
                    element: Element::Pyro,
                },
                DamageInstance {
                    frame: 36,
                    damage: 112.0,
                    element: Element::Pyro,
                },
                DamageInstance {
                    frame: 70,
                    damage: 162.0,
                    element: Element::Pyro,
                },
            ],
            cast_time: 148,
            stop_on_switch: false,
            icd: 2 * SECOND,
        },
    );
    abilities.insert(
        "e",
        Ability {
            name: "e",
            damage: vec![
                DamageInstance {
                    frame: 0,
                    damage: 171.0,
                    element: Element::Pyro,
                },
                DamageInstance {
                    frame: 30,
                    damage: 171.0,
                    element: Element::Pyro,
                },
                DamageInstance {
                    frame: 60,
                    damage: 171.0,
                    element: Element::Pyro,
                },
            ],
            cast_time: 20,
            stop_on_switch: false,
            icd: 2 * SECOND,
        },
    );

    // burst waves https://library.keqingmains.com/evidence/characters/pyro/klee#klee-burst-waves-mechanics
    abilities.insert(
        "q",
        Ability {
            name: "q",
            damage: vec![
                DamageInstance {
                    frame: 0,
                    damage: 76.8,
                    element: Element::Pyro,
                },
                DamageInstance {
                    frame: 0,
                    damage: 76.8,
                    element: Element::Pyro,
                },
                DamageInstance {
                    frame: 0,
                    damage: 76.8,
                    element: Element::Pyro,
                },
            ],
            cast_time: 20,
            stop_on_switch: false,
            icd: 2 * SECOND,
        },
    );

    // klee frame counts https://docs.google.com/spreadsheets/d/1tXwNi_TPojdocCIci3v6nhd87kNwsmFpOjxJS3NKMKs/edit#gid=1945968461
    let klee = Character {
        name: "Klee",
        abilities: abilities.clone(),
    };

    klee
}
