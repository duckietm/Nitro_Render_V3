export class ObjectMouseData
{
    private _objectId: string;
    private _spriteTag: string;

    constructor()
    {
        this._objectId = '';
        this._spriteTag = '';
    }

    public get objectId(): string
    {
        return this._objectId;
    }

    public set objectId(objectId: string)
    {
        this._objectId = objectId;
    }

    public get spriteTag(): string
    {
        return this._spriteTag;
    }

    public set spriteTag(spriteTag: string)
    {
        this._spriteTag = spriteTag;
    }
}