import { IMessageDataWrapper } from '../../../../communication';
import { IRoomObjectModel } from '../../../../room';

export interface IObjectData
{
    state: number;
    isUnique: boolean;
    uniqueNumber: number;
    uniqueSeries: number;
    rarityLevel: number;
    contentsCount: number;
    chestName: string;
    flags: number;
    parseWrapper(wrapper: IMessageDataWrapper): void;
    initializeFromRoomObjectModel(model: IRoomObjectModel): void;
    writeRoomObjectModel(model: IRoomObjectModel): void;
    getLegacyString(): string;
    compare(data: IObjectData): boolean;
}
