use crate::character::Character;
use crate::character::Element;
use crate::character::Hit;
use crate::simulator::Frame;
use std::collections::BTreeMap;

pub struct DamageInstance {
    pub damage: f32,
    pub element: Element,
    pub em: i32,
}

pub struct DamageQueue {
    map: BTreeMap<Frame, DamageInstance>,
}
impl DamageQueue {
    pub fn new() -> DamageQueue {
        DamageQueue {
            map: BTreeMap::new(),
        }
    }

    pub fn push(&mut self, current_frame: Frame, em: i32, hits: &Vec<Hit>) {
        for hit in hits {
            self.map.insert(
                current_frame + hit.frame,
                DamageInstance {
                    damage: hit.damage,
                    element: hit.element,
                    em: em,
                },
            );
        }
    }

    pub fn queue(&self) -> &BTreeMap<Frame, DamageInstance> {
        &self.map
    }
}
