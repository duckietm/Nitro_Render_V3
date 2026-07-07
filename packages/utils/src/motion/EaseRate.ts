import { Ease } from './Ease';
import { Interval } from './Interval';

export class EaseRate extends Ease
{
    protected _rate: number;

    constructor(interval: Interval, rate: number)
    {
        super(interval);

        this._rate = rate;
    }
}
