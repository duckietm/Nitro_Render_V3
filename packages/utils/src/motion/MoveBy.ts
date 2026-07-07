import { MoveTo } from './MoveTo';

export class MoveBy extends MoveTo
{
    constructor(target: HTMLElement, duration: number, endX: number, endY: number)
    {
        super(target, duration, endX, endY);
    }

    public start(): void
    {
        this._endX = (this.target.offsetLeft + this._endX);
        this._endY = (this.target.offsetTop + this._endY);

        super.start();
    }
}