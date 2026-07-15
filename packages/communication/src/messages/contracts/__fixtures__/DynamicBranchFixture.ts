class DynamicBranchFixture
{
    public parse(wrapper: Wrapper): boolean
    {
        if(wrapper.readBoolean()) wrapper.readInt();
        return true;
    }
}

interface Wrapper { readBoolean(): boolean; readInt(): number; }
