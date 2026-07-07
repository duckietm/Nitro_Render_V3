export class Motion
{
    protected _target: HTMLElement;
    protected _running: boolean;
    protected _complete: boolean = true;
    protected _tag: string;

    constructor(target: HTMLElement)
    {
        this._target = target;
    }

    public get running(): boolean
    {
        return ((this._running) && (!!this._target));
    }

    public get complete(): boolean
    {
        return this._complete;
    }

    public set target(value: HTMLElement)
    {
        this._target = value;
    }

    public get target(): HTMLElement
    {
        return this._target;
    }

    public set tag(value: string)
    {
        this._tag = value;
    }

    public get tag(): string
    {
        return this._tag;
    }

    public start(): void
    {
        this._running = true;
    }

    public update(progress: number): void
    {
    }

    public stop(): void
    {
        this._target = null;
        this._running = false;
    }

    public tick(time: number): void
    {
    }
}