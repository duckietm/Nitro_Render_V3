export class RoomPlaneRectangleMask
{
    private _leftSideLoc: number;
    private _rightSideLoc: number;
    private _leftSideLength: number;
    private _rightSideLength: number;

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
