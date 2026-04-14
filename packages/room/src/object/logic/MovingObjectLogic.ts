import { IRoomObjectController, IRoomObjectUpdateMessage, IVector3D, RoomObjectVariable } from '@nitrots/api';
import { Vector3d } from '@nitrots/utils';
import { ObjectMoveUpdateMessage } from '../../messages';
import { RoomObjectLogicBase } from './RoomObjectLogicBase';

export class MovingObjectLogic extends RoomObjectLogicBase
{
    public static DEFAULT_UPDATE_INTERVAL: number = 500;
    private static LOCATION_EPSILON: number = 0.01;
    private static TEMP_VECTOR: Vector3d = new Vector3d();

    private _liftAmount: number;

    private _location: Vector3d;
    private _locationDelta: Vector3d;
    private _followObject: IRoomObjectController;
    private _followOffset: Vector3d;
    private _lastUpdateTime: number;
    private _changeTime: number;
    private _updateInterval: number;
    private _queuedMoveMessages: ObjectMoveUpdateMessage[];

    constructor()
    {
        super();

        this._liftAmount = 0;

        this._location = new Vector3d();
        this._locationDelta = new Vector3d();
        this._followObject = null;
        this._followOffset = new Vector3d();
        this._lastUpdateTime = 0;
        this._changeTime = 0;
        this._updateInterval = MovingObjectLogic.DEFAULT_UPDATE_INTERVAL;
        this._queuedMoveMessages = [];
    }

    public dispose(): void
    {
        this._liftAmount = 0;
        this._queuedMoveMessages = [];

        super.dispose();
    }

    public update(time: number): void
    {
        super.update(time);

        const locationOffset = this.getLocationOffset();
        const model = this.object && this.object.model;
        let completedInterpolation = false;

        if(model)
        {
            if(locationOffset)
            {
                if(this._liftAmount !== locationOffset.z)
                {
                    this._liftAmount = locationOffset.z;

                    model.setValue(RoomObjectVariable.FURNITURE_LIFT_AMOUNT, this._liftAmount);
                }
            }
            else
            {
                if(this._liftAmount !== 0)
                {
                    this._liftAmount = 0;

                    model.setValue(RoomObjectVariable.FURNITURE_LIFT_AMOUNT, this._liftAmount);
                }
            }
        }

        if((this._locationDelta.length > 0) || locationOffset)
        {
            const vector = MovingObjectLogic.TEMP_VECTOR;

            let difference = (this.time - this._changeTime);

            if(difference === (this._updateInterval >> 1)) difference++;

            if(difference > this._updateInterval) difference = this._updateInterval;

            if(this._followObject)
            {
                vector.assign(this._followObject.getLocation());
                vector.add(this._followOffset);
            }
            else if(this._locationDelta.length > 0)
            {
                vector.assign(this._locationDelta);
                vector.multiply((difference / this._updateInterval));
                vector.add(this._location);
            }
            else
            {
                vector.assign(this._location);
            }

            if(locationOffset) vector.add(locationOffset);

            this.object.setLocation(vector);

            if(difference === this._updateInterval)
            {
                if(this._followObject)
                {
                    this._location.assign(this.object.getLocation());
                    this._followObject = null;
                    this._followOffset.assign(new Vector3d());
                }

                this._locationDelta.x = 0;
                this._locationDelta.y = 0;
                this._locationDelta.z = 0;
                completedInterpolation = true;
            }
        }

        this._lastUpdateTime = this.time;

        if(completedInterpolation) this.processQueuedMoveMessage();
    }

    public setObject(object: IRoomObjectController): void
    {
        super.setObject(object);

        if(object) this._location.assign(object.getLocation());
    }

    public processUpdateMessage(message: IRoomObjectUpdateMessage): void
    {
        if(!message) return;

        if(message instanceof ObjectMoveUpdateMessage)
        {
            if(this.shouldApplyInstantMoveMessage(message))
            {
                super.processUpdateMessage(message);

                if(message.location) this._location.assign(message.location);

                this.resetInterpolationState();

                return;
            }

            const requiresCustomMoveHandling = !!message.anchorObject || (message.elapsed > 0);

            if(requiresCustomMoveHandling)
            {
                if(this.object && message.direction) this.object.setDirection(message.direction);

                return this.processMoveMessage(message);
            }
        }

        super.processUpdateMessage(message);

        if(message.location) this._location.assign(message.location);

        if(message instanceof ObjectMoveUpdateMessage) return this.processMoveMessage(message);
    }

    private shouldApplyInstantMoveMessage(message: ObjectMoveUpdateMessage): boolean
    {
        if(!message || !message.location || message.isSlide || !!message.anchorObject || (message.elapsed > 0)) return false;

        return this.matchesLocation(message.location, message.targetLocation);
    }

    private processMoveMessage(message: ObjectMoveUpdateMessage): void
    {
        if(!message || !this.object || !message.location) return;

        if(this.shouldQueueMoveMessage(message))
        {
            this.queueMoveMessage(message);

            return;
        }

        const hadActiveInterpolation = this.isInterpolating();
        const duration = ((message.duration > 0) ? message.duration : ObjectMoveUpdateMessage.DEFAULT_DURATION);
        const startLocation = hadActiveInterpolation
            ? this.object.getLocation()
            : message.location;
        const elapsed = Math.max(0, Math.min(duration, message.elapsed));

        this._location.assign(startLocation);
        this.object.setLocation(this._location);
        this._followObject = message.anchorObject;

        if(message.anchorOffset) this._followOffset.assign(message.anchorOffset);
        else this._followOffset.assign(new Vector3d());

        this._changeTime = (this._lastUpdateTime - elapsed);
        this.updateInterval = duration;

        this._locationDelta.assign(message.targetLocation);
        this._locationDelta.subtract(this._location);

        if(this._followObject)
        {
            const vector = MovingObjectLogic.TEMP_VECTOR;

            vector.assign(this._followObject.getLocation());
            vector.add(this._followOffset);

            const locationOffset = this.getLocationOffset();

            if(locationOffset) vector.add(locationOffset);

            this.object.setLocation(vector);
        }
        else if(elapsed > 0)
        {
            const vector = MovingObjectLogic.TEMP_VECTOR;

            vector.assign(this._locationDelta);
            vector.multiply((elapsed / this._updateInterval));
            vector.add(this._location);

            const locationOffset = this.getLocationOffset();

            if(locationOffset) vector.add(locationOffset);

            this.object.setLocation(vector);
        }
        else if(hadActiveInterpolation && message.isSlide)
        {
            this.object.setLocation(this._location);
        }
    }

    private resetInterpolationState(): void
    {
        this._locationDelta.x = 0;
        this._locationDelta.y = 0;
        this._locationDelta.z = 0;
        this._followObject = null;
        this._followOffset.assign(new Vector3d());
        this._queuedMoveMessages = [];
        this._changeTime = this._lastUpdateTime;
    }

    private isInterpolating(): boolean
    {
        return (this._locationDelta.length > 0) && ((this.time - this._changeTime) < this._updateInterval);
    }

    private shouldQueueMoveMessage(message: ObjectMoveUpdateMessage): boolean
    {
        if(!message.isSlide || !!message.anchorObject || !this.isInterpolating() || !message.location || !message.targetLocation) return false;

        const expectedStartLocation = this.getQueuedMovementTailLocation();

        if(!expectedStartLocation) return false;

        return this.matchesLocation(message.location, expectedStartLocation)
            && !this.matchesLocation(message.targetLocation, expectedStartLocation);
    }

    private queueMoveMessage(message: ObjectMoveUpdateMessage): void
    {
        this._queuedMoveMessages.push(new ObjectMoveUpdateMessage(
            message.location,
            message.targetLocation,
            message.direction,
            message.isSlide,
            message.duration,
            message.elapsed,
            message.anchorObject,
            message.anchorOffset));
    }

    private processQueuedMoveMessage(): void
    {
        if(!this._queuedMoveMessages.length) return;

        const nextMoveMessage = this._queuedMoveMessages.shift();

        if(!nextMoveMessage) return;

        this.processMoveMessage(nextMoveMessage);
    }

    private getQueuedMovementTailLocation(): IVector3D
    {
        if(this._queuedMoveMessages.length)
        {
            const queuedMoveMessage = this._queuedMoveMessages[this._queuedMoveMessages.length - 1];

            if(queuedMoveMessage?.targetLocation) return queuedMoveMessage.targetLocation;
        }

        if(this._locationDelta.length <= 0) return null;

        const targetLocation = new Vector3d();

        targetLocation.assign(this._location);
        targetLocation.add(this._locationDelta);

        return targetLocation;
    }

    private matchesLocation(first: IVector3D, second: IVector3D): boolean
    {
        if(!first || !second) return false;

        return (Math.abs(first.x - second.x) <= MovingObjectLogic.LOCATION_EPSILON)
            && (Math.abs(first.y - second.y) <= MovingObjectLogic.LOCATION_EPSILON)
            && (Math.abs(first.z - second.z) <= MovingObjectLogic.LOCATION_EPSILON);
    }

    protected getLocationOffset(): IVector3D
    {
        return null;
    }

    protected get lastUpdateTime(): number
    {
        return this._lastUpdateTime;
    }

    protected set updateInterval(interval: number)
    {
        if(interval <= 0) interval = 1;

        this._updateInterval = interval;
    }
}
