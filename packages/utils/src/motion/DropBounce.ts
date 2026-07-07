import { Interval } from './Interval';

export class DropBounce extends Interval
{
    private _height: number;
    private _offset: number;

    constructor(target: HTMLElement, duration: number, height: number)
    {
        super(target, duration);

        this._height = height;
    }

    public start(): void
    {
        super.start();

        this._offset = 0;

        this.target.style.top = ((this._offset - this._height) + 'px');
    }

    public update(time: number): void
    {
        super.update(time);

        this.target.style.top = (((this._offset - this._height) + (this.getBounceOffset(time) * this._height)) + 'px');
    }

    protected getBounceOffset(progress: number): number
    {
        if(progress < 0.364) return (7.5625 * progress) * progress;

        if(progress < 0.727)
        {
            progress = (progress - 0.545);

            return ((7.5625 * progress) * progress) + 0.75;
        }

        if(progress < 0.909)
        {
            progress = (progress - 0.9091);

            return ((7.5625 * progress) * progress) + 0.9375;
        }

        progress = (progress - 0.955);

        return ((7.5625 * progress) * progress) + 0.984375;
    }

    public stop(): void
    {
        this.target.style.top = (this._offset + 'px');

        super.stop();
    }
}