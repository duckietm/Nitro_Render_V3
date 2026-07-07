import { EaseRate } from './EaseRate';
import { Interval } from './Interval';

export class EaseOut extends EaseRate
{
    constructor(interval: Interval, rate: number)
    {
        super(interval, rate);
    }

    public update(progress: number): void
    {
        this._interval.update(Math.pow(progress, (1 / this._rate)));
    }
}
