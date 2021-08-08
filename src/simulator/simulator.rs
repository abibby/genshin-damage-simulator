use crate::character;
use crate::simulator;

pub struct Simulation {
    characters: [Box<character::Character>; 4],
    active_character_index: usize,
    damage_queue: simulator::DamageQueue,
    total_damage: f32,
    current_frame: simulator::Frame,
}

impl Simulation {
    pub fn new(characters: [Box<character::Character>; 4]) -> Simulation {
        Simulation {
            characters: characters,
            active_character_index: 0,
            damage_queue: simulator::DamageQueue::new(),
            total_damage: 0.0,
            current_frame: 0,
        }
    }

    pub fn run(&mut self, sequence: Vec<&str>) -> f32 {
        for input in sequence {
            match input {
                "1" => self.active_character_index = 0,
                "2" => self.active_character_index = 1,
                "3" => self.active_character_index = 2,
                "4" => self.active_character_index = 3,
                _ => {
                    let ability = self.characters[self.active_character_index]
                        .abilities
                        .get(input)
                        .unwrap();
                    self.damage_queue.push(self.current_frame, &ability.hits);
                    self.current_frame += ability.cast_time;
                }
            }
        }

        for (_frame, instance) in self.damage_queue.queue() {
            self.total_damage += instance.damage
        }

        self.total_damage
    }

    // fn active_character(&self) -> &Rc<character::Character> {
    //     if self.active_character_index < 0 || self.active_character_index >= 4 {
    //         panic!("bad character");
    //     }

    //     &self.characters[self.active_character_index]
    // }
}
