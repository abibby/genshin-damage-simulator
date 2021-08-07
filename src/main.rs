mod character;
mod simulator;

fn main() {
    let k = character::klee();
    let d = simulator::simulate(vec!["n1", "n1", "e"], k, 60 * simulator::SECOND);

    println!("total damage: {}", d);
}
