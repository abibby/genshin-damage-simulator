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
    pub stats: CharacterStats,
}
#[derive(Debug, Clone)]
pub struct CharacterStats {
    pub base_hp: i32,
    pub extra_hp: i32,
    pub base_atk: i32,
    pub extra_atk: i32,
    pub base_def: i32,
    pub extra_def: i32,
    pub elemental_master: i32,
    pub max_stamina: i32,
    pub crit_rate: f32,
    pub crit_dmg: f32,
    pub energy_recharge: f32,
    pub cd_reduction: f32,
    pub physical_dmg_bonus: f32,
    pub pyro_dmg_bonus: f32,
    pub hydro_dmg_bonus: f32,
    pub anemo_dmg_bonus: f32,
    pub electro_dmg_bonus: f32,
    pub dendro_dmg_bonus: f32,
    pub cryo_dmg_bonus: f32,
    pub geo_dmg_bonus: f32,
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

pub fn zeroStats() -> CharacterStats {
    CharacterStats {
        base_hp: 0,
        extra_hp: 0,
        base_atk: 0,
        extra_atk: 0,
        base_def: 0,
        extra_def: 0,
        elemental_master: 0,
        max_stamina: 0,
        crit_rate: 0.0,
        crit_dmg: 0.0,
        energy_recharge: 0.0,
        cd_reduction: 0.0,
        physical_dmg_bonus: 0.0,
        pyro_dmg_bonus: 0.0,
        hydro_dmg_bonus: 0.0,
        anemo_dmg_bonus: 0.0,
        electro_dmg_bonus: 0.0,
        dendro_dmg_bonus: 0.0,
        cryo_dmg_bonus: 0.0,
        geo_dmg_bonus: 0.0,
    }
}
