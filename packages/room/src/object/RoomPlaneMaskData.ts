export class RoomPlaneMaskData
{
    private _leftSideLoc: number = 0;
    private _rightSideLoc: number = 0;
    private _leftSideLength: number = 0;
    private _rightSideLength: number = 0;

    constructor(leftSideLoc: number, rightSideLoc: number, leftSideLength: number, rightSideLength: number)
    {
        this._leftSideLoc = leftSideLoc;
        this._rightSideLoc = rightSideLoc;
        this._leftSideLength = leftSideLength;
        this._rightSideLength = rightSideLength;
    }

    public get leftSideLoc(): number
    {
        return this._leftSideLoc;
    }

    public get rightSideLoc(): number
    {
        return this._rightSideLoc;
    }

    public get leftSideLength(): number
    {
        return this._leftSideLength;
    }

    public get rightSideLength(): number
    {
        return this._rightSideLength;
    }
}
