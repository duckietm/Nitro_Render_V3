export class NumberBank
{
    private _reservedNumbers: number[];
    private _freeNumbers: number[];

    constructor(count: number)
    {
        if(count < 0) count = 0;

        this._reservedNumbers = [];
        this._freeNumbers = [];

        let i = 0;

        while(i < count)
        {
            this._freeNumbers.push(i);

            i++;
        }
    }

    public dispose(): void
    {
        this._reservedNumbers = null;
        this._freeNumbers = null;
    }

    public reserveNumber(): number
    {
        if(this._freeNumbers.length > 0)
        {
            const number = this._freeNumbers.pop();

            this._reservedNumbers.push(number);

            return number;
        }

        return -1;
    }

    public freeNumber(number: number): void
    {
        const index = this._reservedNumbers.indexOf(number);

        if(index >= 0)
        {
            this._reservedNumbers.splice(index, 1);

            this._freeNumbers.push(number);
        }
    }
}
