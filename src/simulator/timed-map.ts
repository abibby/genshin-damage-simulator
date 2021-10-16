export interface TimedMapItem {
    name: string
    startFrame: number
    endFrame: number
}

export class TimedMap<T extends TimedMapItem> {
    private m: T[] = []

    public atTime(frame: number): T[] {
        const items = this.m.filter(
            v => v.startFrame <= frame && frame < v.endFrame,
        )

        const m = new Map<string, T>()

        for (const item of items) {
            m.set(item.name, item)
        }

        return Array.from(m.values())
    }

    public set(v: T): void {
        this.m.push(v)
    }
}
