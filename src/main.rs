mod character;
mod simulator;

fn main() {
    let c1 = character::pyro();
    let c2 = character::hydro();
    let c3 = character::klee();
    let c4 = character::klee();

    let mut s =
        simulator::Simulation::new([Box::new(c1), Box::new(c2), Box::new(c3), Box::new(c4)]);
    let d = s.run(vec!["n1", "n1", "e", "2", "n1"]);

    println!("total damage: {}", d);
}
