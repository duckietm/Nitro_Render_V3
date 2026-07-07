import { Interval } from './Interval';

export class MoveTo extends Interval
{
    protected _startX: number;
    protected _startY: number;
    protected _endX: number;
    protected _endY: number;
    protected _deltaX: number;
    protected _deltaY: number;

    constructor(target: HTMLElement, duration: number, endX: number, endY: number)
    {
        super(target, duration);

        this._endX = endX;
        this._endY = endY;
    }

    public start(): void
    {
        super.start();

        this._startX = this.target.offsetLeft;
        this._startY = this.target.offsetTop;
        this._deltaX = (this._endX - this._startX);
        this._deltaY = (this._endY - this._startY);
    }

    public update(progress: number): void
    {
        this.target.style.left = ((this._startX + (this._deltaX * progress)) + 'px');
        this.target.style.top = ((this._startY + (this._deltaY * progress)) + 'px');
    }
}