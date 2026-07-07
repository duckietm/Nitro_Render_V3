import { Interval } from './Interval';

export class ResizeTo extends Interval
{
    protected _startW: number;
    protected _startH: number;
    protected _endW: number;
    protected _endH: number;
    protected _deltaW: number;
    protected _deltaH: number;

    constructor(target: HTMLElement, duration: number, endWidth: number, endHeight: number)
    {
        super(target, duration);

        this._endW = endWidth;
        this._endH = endHeight;
    }

    public start(): void
    {
        super.start();

        this._startW = this.target.offsetWidth;
        this._startH = this.target.offsetHeight;
        this._deltaW = (this._endW - this._startW);
        this._deltaH = (this._endH - this._startH);
    }

    public update(progress: number): void
    {
        this.target.style.width = ((this._startW + (this._deltaW * progress)) + 'px');
        this.target.style.height = ((this._startH + (this._deltaH * progress)) + 'px');
    }
}