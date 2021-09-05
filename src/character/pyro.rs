use crate::character::character::zeroStats;
use crate::character::*;
use crate::simulator::SECOND;
use std::collections::HashMap;
use std::rc::Rc;

pub fn pyro<'a>() -> Character {
    let abilities = &mut HashMap::new();
    abilities.insert(
        "n1",
        Rc::new(Ability {
            name: "n1",
            hits: vec![Hit {
                frame: 0,
                damage: 10.0,
                element: Element::Pyro,
            }],
            cast_time: 36,
            stop_on_switch: false,
            icd: 2 * SECOND,
        }),
    );
    abilities.insert(
        "n3",
        Rc::new(Ability {
            name: "n3",
            hits: vec![
                Hit {
                    frame: 0,
                    damage: 10.0,
                    element: Element::Pyro,
                },
                Hit {
                    frame: 30,
                    damage: 20.0,
                    element: Element::Pyro,
                },
                Hit {
                    frame: 60,
                    damage: 40.0,
                    element: Element::Pyro,
                },
            ],
            cast_time: 90,
            stop_on_switch: false,
            icd: 2 * SECOND,
        }),
    );
    abilities.insert(
        "e",
        Rc::new(Ability {
            name: "e",
            hits: vec![Hit {
                frame: 0,
                damage: 80.0,
                element: Element::Pyro,
            }],
            cast_time: 30,
            stop_on_switch: false,
            icd: 2 * SECOND,
        }),
    );

    abilities.insert(
        "q",
        Rc::new(Ability {
            name: "q",
            hits: vec![
                Hit {
                    frame: 0,
                    damage: 60.0,
                    element: Element::Pyro,
                },
                Hit {
                    frame: 1,
                    damage: 60.0,
                    element: Element::Pyro,
                },
                Hit {
                    frame: 2,
                    damage: 60.0,
                    element: Element::Pyro,
                },
            ],
            cast_time: 60,
            stop_on_switch: false,
            icd: 2 * SECOND,
        }),
    );

    let stats = zeroStats();

    stats.base_atk = 100;
    stats.extra_atk = 100;
    stats.elemental_master = 100;
    stats.crit_rate = 50.0;
    stats.crit_dmg = 100.0;

    Character {
        name: "pyro",
        abilities: abilities.clone(),
        stats: stats,
    }
}
