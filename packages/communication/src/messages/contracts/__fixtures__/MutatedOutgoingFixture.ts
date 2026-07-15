class MutatedOutgoingFixture
{
    private _data: unknown[];

    constructor()
    {
        this._data = [];
    }

    public add(value: number): void
    {
        this._data.push(value);
    }

    public getMessageArray()
    {
        return this._data;
    }
}
