export class OrderedQueue<T> {
    private map: Map<number, T[]>
    constructor() {
        this.map = new Map()
    }
    public enqueue(time: number, value: T): void {
        let valueBucket: T[] = []
        if (this.map.has(time)) {
            // this get will always have a value since it is inside the has
            // check

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            valueBucket = this.map.get(time)!
        }
        this.map.set(time, valueBucket.concat([value]))
    }
    public dequeue(): T | undefined {
        for (const [time, valueBucket] of this.map) {
            if (valueBucket.length === 1) {
                this.map.delete(time)
            } else {
                this.map.set(time, valueBucket.slice(1))
            }
            return valueBucket[0]
        }
        return undefined
    }
    public dequeueBefore(time: number): T[] {
        const values = []
        for (const [t, valueBucket] of this.map) {
            if (time >= t) {
                return values
            }
            values.push(...valueBucket)
            this.map.delete(t)
        }
        return []
    }
}
