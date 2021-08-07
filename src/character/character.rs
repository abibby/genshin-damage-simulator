#[path = "../simulator/mod.rs"]
mod simulator;

use std::collections::HashMap;
use std::marker::Copy;

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
pub struct Character<'a> {
    pub name: &'a str,
    pub abilities: HashMap<&'a str, Ability<'a>>,
}

#[derive(Debug, Clone)]
pub struct Ability<'a> {
    pub name: &'a str,
    pub damage: Vec<DamageInstance>,
    pub cast_time: simulator::Frame,
    pub stop_on_switch: bool,
    pub icd: simulator::Frame,
}

#[derive(Debug, Copy, Clone)]
pub struct DamageInstance {
    pub frame: simulator::Frame,
    pub damage: f32,
    pub element: Element,
}
