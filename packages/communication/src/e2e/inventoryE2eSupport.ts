export interface InventoryItemIdentity
{
    itemId: number;
    ref: number;
    spriteId: number;
    furniType: string;
    category: number;
    extra: number;
}

export interface InventoryFragmentInput
{
    totalFragments: number;
    fragmentNumber: number;
    items: InventoryItemIdentity[];
}

export class InventorySnapshotCollector
{
    private expectedFragments = 0;
    private fragments = new Map<number, InventoryItemIdentity[]>();

    public record(input: InventoryFragmentInput): InventoryItemIdentity[] | null
    {
        if(!Number.isInteger(input.totalFragments) || input.totalFragments < 1) throw new Error('Inventory totalFragments must be positive');
        if(!Number.isInteger(input.fragmentNumber) || input.fragmentNumber < 0 || input.fragmentNumber >= input.totalFragments) throw new Error(`Invalid inventory fragment ${ input.fragmentNumber }/${ input.totalFragments }`);

        if(input.fragmentNumber === 0)
        {
            this.expectedFragments = input.totalFragments;
            this.fragments.clear();
        }
        else if(this.expectedFragments !== input.totalFragments)
        {
            throw new Error(`Inventory fragment count changed from ${ this.expectedFragments } to ${ input.totalFragments }`);
        }

        if(this.fragments.has(input.fragmentNumber)) throw new Error(`Duplicate inventory fragment ${ input.fragmentNumber }`);
        this.fragments.set(input.fragmentNumber, input.items);
        if(this.fragments.size !== this.expectedFragments) return null;

        const snapshot: InventoryItemIdentity[] = [];
        const ids = new Set<number>();
        for(let index = 0; index < this.expectedFragments; index++)
        {
            const fragment = this.fragments.get(index);
            if(!fragment) throw new Error(`Missing inventory fragment ${ index }`);
            for(const current of fragment)
            {
                if(ids.has(current.itemId)) throw new Error(`Duplicate inventory item id ${ current.itemId }`);
                ids.add(current.itemId);
                snapshot.push(current);
            }
        }

        return snapshot;
    }
}

export const formatInventoryDiagnostics = (itemId: number, timeline: string[]): string =>
    `item=${ itemId } timeline=${ JSON.stringify(timeline) }`;
