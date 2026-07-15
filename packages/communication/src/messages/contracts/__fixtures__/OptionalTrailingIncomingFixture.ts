class OptionalTrailingIncomingFixture
{
    private id: number;
    private figure: string;

    parse(wrapper: any): boolean
    {
        this.id = wrapper.readInt();

        if(!wrapper.bytesAvailable) return true;

        this.figure = wrapper.readString();
        return true;
    }
}
