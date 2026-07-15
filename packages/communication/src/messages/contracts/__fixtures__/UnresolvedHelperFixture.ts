class UnresolvedHelperFixture
{
    private readMissing: (wrapper: Wrapper) => void;

    public parse(wrapper: Wrapper): boolean
    {
        this.readMissing(wrapper);
        return true;
    }
}

interface Wrapper {}
