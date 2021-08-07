use std::collections::HashMap;

#[derive(Debug)]
enum Element {
    Physical,
    Pyro,
    Hydro,
    Anemo,
    Electro,
    Dendro,
    Cryo,
    Geo,
}

type Frame = i32;

const Second: Frame = 2;

#[derive(Debug)]
struct Character<'a> {
    name: &'a str,
    abilities: &'a mut HashMap<&'a str, Ability<'a>>,
}

#[derive(Debug)]
struct Ability<'a> {
    name: &'a str,
    damage: Vec<DamageInstance>,
    cast_time: Frame,
    stop_on_switch: bool,
    icd: Frame,
}

#[derive(Debug)]
struct DamageInstance {
    frame: Frame,
    damage: f32,
    element: Element,
}

fn main() {
    // klee frame counts https://docs.google.com/spreadsheets/d/1tXwNi_TPojdocCIci3v6nhd87kNwsmFpOjxJS3NKMKs/edit#gid=1945968461
    let klee = Character {
        name: "Klee",
        abilities: &mut HashMap::new(),
    };
    klee.abilities.insert(
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
            icd: 2 * Second,
        },
    );
    klee.abilities.insert(
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
            icd: 2 * Second,
        },
    );
    klee.abilities.insert(
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
            icd: 2 * Second,
        },
    );

    // burst waves https://library.keqingmains.com/evidence/characters/pyro/klee#klee-burst-waves-mechanics
    klee.abilities.insert(
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
            icd: 2 * Second,
        },
    );
    println!("Hello, world!");
}
