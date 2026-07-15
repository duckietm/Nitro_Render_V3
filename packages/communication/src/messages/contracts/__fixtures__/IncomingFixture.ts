class IncomingFixture
{
    public parse(wrapper: Wrapper): boolean
    {
        const id = wrapper.readInt();
        const name = wrapper.readString();
        const rank = wrapper.readShort();
        this.readEnabled(wrapper);
        return id > 0 && name.length > 0 && rank > 0;
    }

    private readEnabled(wrapper: Wrapper): void
    {
        wrapper.readBoolean();
    }
}

interface Wrapper
{
    readInt(): number;
    readString(): string;
    readShort(): number;
    readBoolean(): boolean;
}
