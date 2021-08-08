mod character;
mod simulator;

fn main() {
    let k1 = character::klee();
    let k2 = character::klee();
    let k3 = character::klee();
    let k4 = character::klee();

    let mut s =
        simulator::Simulation::new([Box::new(k1), Box::new(k2), Box::new(k3), Box::new(k4)]);
    let d = s.run(vec!["n1", "n1", "e"]);

    println!("total damage: {}", d);
}
