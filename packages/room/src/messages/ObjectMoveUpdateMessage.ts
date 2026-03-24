import { IVector3D } from '@nitrots/api';
import { RoomObjectUpdateMessage } from './RoomObjectUpdateMessage';

export class ObjectMoveUpdateMessage extends RoomObjectUpdateMessage
{
    public static DEFAULT_DURATION: number = 500;

    private _targetLocation: IVector3D;
    private _isSlide: boolean;
    private _duration: number;

    constructor(location: IVector3D, targetLocation: IVector3D, direction: IVector3D, isSlide: boolean = false, duration: number = ObjectMoveUpdateMessage.DEFAULT_DURATION)
    {
        super(location, direction);

        this._targetLocation = targetLocation;
        this._isSlide = isSlide;
        this._duration = duration;
    }

    public get targetLocation(): IVector3D
    {
        if(!this._targetLocation) return this.location;

        return this._targetLocation;
    }

    public get isSlide(): boolean
    {
        return this._isSlide;
    }

    public get duration(): number
    {
        return this._duration;
    }
}
