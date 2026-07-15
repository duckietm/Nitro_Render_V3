class RecursiveHelperFixture
{
    public parse(wrapper: Wrapper): boolean
    {
        this.readLoop(wrapper);
        return true;
    }

    private readLoop(wrapper: Wrapper): void
    {
        wrapper.readInt();
        this.readLoop(wrapper);
    }
}

interface Wrapper { readInt(): number; }
