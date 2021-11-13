export class OutOfStaminaError extends Error {
    constructor() {
        super('out of stamina')
    }
}