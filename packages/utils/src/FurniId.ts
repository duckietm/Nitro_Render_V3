export class FurniId
{
    private static BUILDER_CLUB_FURNI_ID_BASE: number = 0x7FFF0000;

    public static isBuilderClubId(id: number): boolean
    {
        return (id >= FurniId.BUILDER_CLUB_FURNI_ID_BASE);
    }
}