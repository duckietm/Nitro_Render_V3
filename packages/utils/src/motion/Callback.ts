import { Motion } from './Motion';

export class Callback extends Motion
{
    protected _callback: Function;

    constructor(callback: Function)
    {
        super(null);

        this._callback = callback;
    }

    public get running(): boolean
    {
        return (this._running && !!this._callback);
    }

    public tick(time: number): void
    {
        super.tick(time);

        if(this._callback)
        {
            this._callback();

            this._callback = null;
        }
    }
}