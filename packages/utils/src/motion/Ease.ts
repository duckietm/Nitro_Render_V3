import { Interval } from './Interval';

export class Ease extends Interval
{
    protected _interval: Interval;

    constructor(interval: Interval)
    {
        super(interval.target, interval.duration);

        this._interval = interval;
    }

    public start(): void
    {
        super.start();

        this._interval.start();
    }

    public update(progress: number): void
    {
        super.update(progress);

        this._interval.update(progress);
    }

    public stop(): void
    {
        super.stop();

        this._interval.stop();
    }
}