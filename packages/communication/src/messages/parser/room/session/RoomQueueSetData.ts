/**
 * Official `class_2893`: one queue set of `RoomQueueStatus` (383 / our 2208).
 * A set is a queue target (1 = spectator, 2 = visitor) with a name and the
 * sizes of its queue types (`c` = club queue, `d` = normal queue).
 */
export class RoomQueueSetData
{
    public static readonly TARGET_SPECTATOR = 1;
    public static readonly TARGET_VISITOR = 2;

    public static readonly QUEUE_TYPE_CLUB = 'c';
    public static readonly QUEUE_TYPE_NORMAL = 'd';

    private _name: string;
    private _target: number;
    private _queues: Map<string, number> = new Map();

    constructor(name: string, target: number)
    {
        this._name = name;
        this._target = target;
    }

    public addQueue(queueType: string, size: number): void
    {
        this._queues.set(queueType, size);
    }

    public getQueueSize(queueType: string): number
    {
        const size = this._queues.get(queueType);

        return (size === undefined) ? 0 : size;
    }

    public get name(): string
    {
        return this._name;
    }

    public get target(): number
    {
        return this._target;
    }

    public get queueTypes(): string[]
    {
        return Array.from(this._queues.keys());
    }
}
