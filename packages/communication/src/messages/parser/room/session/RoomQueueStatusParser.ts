import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { RoomQueueSetData } from './RoomQueueSetData';

/**
 * Official `class_2993` (`RoomQueueStatus`): `int flatId`, then a list of queue
 * sets `str name, int target, int queueCount, [ str queueType, int size ]`.
 * The active target is the target of the first set, exactly as the official
 * parser records it.
 */
export class RoomQueueStatusParser implements IMessageParser
{
    private _flatId: number;
    private _activeTarget: number;
    private _queueSets: RoomQueueSetData[];

    public flush(): boolean
    {
        this._flatId = 0;
        this._activeTarget = 0;
        this._queueSets = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        this._queueSets = [];
        this._flatId = wrapper.readInt();

        let totalSets = wrapper.readInt();
        let setIndex = 0;

        while(setIndex < totalSets)
        {
            const name = wrapper.readString();
            const target = wrapper.readInt();

            if(setIndex === 0) this._activeTarget = target;

            const queueSet = new RoomQueueSetData(name, target);

            let totalQueues = wrapper.readInt();

            while(totalQueues > 0)
            {
                queueSet.addQueue(wrapper.readString(), wrapper.readInt());

                totalQueues--;
            }

            this._queueSets.push(queueSet);

            setIndex++;
        }

        return true;
    }

    public get flatId(): number
    {
        return this._flatId;
    }

    public get activeTarget(): number
    {
        return this._activeTarget;
    }

    public get queueSets(): RoomQueueSetData[]
    {
        return this._queueSets;
    }

    public getQueueSet(target: number): RoomQueueSetData
    {
        return this._queueSets.find(queueSet => queueSet.target === target) ?? null;
    }
}
