import { IMessageComposer } from '@octane/api';

/**
 * Official AIR 13 `WiredVariablesSynchronizer.getAllVariables`: asks for the hash of
 * the room's whole wired variable set before deciding whether a diff is needed.
 */
export class WiredAllVariablesRequestComposer implements IMessageComposer<[]>
{
    public getMessageArray(): []
    {
        return [];
    }

    public dispose(): void
    {
        return;
    }
}
