import { Motion } from './Motion';

export class Dispose extends Motion
{
    constructor(target: HTMLElement)
    {
        super(target);
    }

    public tick(time: number): void
    {
        super.tick(time);

        if(this.target)
        {
            this.target.remove();

            this.target = null;
        }
    }
}