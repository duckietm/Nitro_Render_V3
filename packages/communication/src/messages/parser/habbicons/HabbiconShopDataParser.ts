import { IMessageDataWrapper, IMessageParser } from '@octane/api';
import { HabbiconCollectionData, parseHabbicon } from './HabbiconData';

export class HabbiconShopDataParser implements IMessageParser
{
    public collections: HabbiconCollectionData[] = [];

    public flush(): boolean
    {
        this.collections = [];

        return true;
    }

    public parse(wrapper: IMessageDataWrapper): boolean
    {
        if(!wrapper) return false;

        const count = wrapper.readInt();

        if(count < 0 || count > 10000) return false;

        for(let index = 0; index < count; index++)
        {
            const collection: HabbiconCollectionData = {
                collectionId: wrapper.readInt(),
                name: wrapper.readString(),
                completed: wrapper.readBoolean(),
                rewardHabbiconId: wrapper.readInt(),
                rewardState: wrapper.readInt(),
                priceCredits: wrapper.readInt(),
                priceActivityPoints: wrapper.readInt(),
                activityPointType: wrapper.readInt(),
                habbicons: []
            };
            const habbiconCount = wrapper.readInt();

            if(habbiconCount < 0 || habbiconCount > 10000) return false;

            for(let itemIndex = 0; itemIndex < habbiconCount; itemIndex++)
            {
                collection.habbicons.push(parseHabbicon(wrapper));
            }

            this.collections.push(collection);
        }

        return true;
    }
}
