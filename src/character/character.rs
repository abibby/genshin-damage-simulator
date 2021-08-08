#[path = "../simulator/mod.rs"]
mod simulator;

use std::collections::HashMap;
use std::marker::Copy;
use std::rc::Rc;

#[derive(Debug, Copy, Clone)]
#[allow(dead_code)]
pub enum Element {
    Physical,
    Pyro,
    Hydro,
    Anemo,
    Electro,
    Dendro,
    Cryo,
    Geo,
}

#[derive(Debug, Clone)]
pub struct Character {
    pub name: &'static str,
    pub abilities: HashMap<&'static str, Rc<Ability>>,
}

#[derive(Debug, Clone)]
pub struct Ability {
    pub name: &'static str,
    pub hits: Vec<Hit>,
    pub cast_time: simulator::Frame,
    pub stop_on_switch: bool,
    pub icd: simulator::Frame,
}

#[derive(Debug, Copy, Clone)]
pub struct Hit {
    pub frame: simulator::Frame,
    pub damage: f32,
    pub element: Element,
}
