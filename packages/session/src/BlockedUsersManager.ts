import { IBlockedUsersManager } from '@octane/api';
import { BlockedUsersEvent, BlockResultEvent, BlockResultParser, BlockUserComposer, GetBlockedUsersComposer, GetCommunication, UnblockUserComposer } from '@octane/communication';
import { GetEventDispatcher, OctaneEvent, OctaneEventType } from '@octane/events';

/**
 * Official `com.sulake.habbo.session.BlockedUsersManager`: the block list is a session cache of
 * user ids, separate from the ignore list (which is keyed by name). The server owns the list;
 * `initBlockList` asks for it (485), `blockUser` / `unblockUser` change it (697 / 1886), and the
 * server answers with the full list (2649) or a per-user result (366).
 */
export class BlockedUsersManager implements IBlockedUsersManager
{
    private _blockedUserIds: number[] = [];
    private _blockedUserIdsSnapshot: ReadonlyArray<number> | null = null;

    private invalidateBlockedUsersSnapshot(): void
    {
        this._blockedUserIdsSnapshot = null;

        GetEventDispatcher().dispatchEvent(new OctaneEvent(OctaneEventType.BLOCKED_USERS_UPDATED));
    }

    public getBlockedUsersSnapshot(): ReadonlyArray<number>
    {
        if(this._blockedUserIdsSnapshot) return this._blockedUserIdsSnapshot;

        this._blockedUserIdsSnapshot = Object.freeze<number[]>([ ...this._blockedUserIds ]);

        return this._blockedUserIdsSnapshot;
    }

    public init(): void
    {
        GetCommunication().registerMessageEvent(new BlockedUsersEvent(this.onBlockedUsersEvent.bind(this)));
        GetCommunication().registerMessageEvent(new BlockResultEvent(this.onBlockResultEvent.bind(this)));
    }

    public requestBlockedUsers(): void
    {
        GetCommunication().connection.send(new GetBlockedUsersComposer());
    }

    private onBlockedUsersEvent(event: BlockedUsersEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        this._blockedUserIds = [ ...parser.blockedUserIds ];
        this.invalidateBlockedUsersSnapshot();
    }

    private onBlockResultEvent(event: BlockResultEvent): void
    {
        if(!event) return;

        const parser = event.getParser();

        if(!parser) return;

        switch(parser.result)
        {
            case BlockResultParser.UNBLOCKED:
                this.removeUserFromBlockList(parser.userId);
                return;
            case BlockResultParser.BLOCKED:
                this.addUserToBlockList(parser.userId);
                return;
        }
    }

    private addUserToBlockList(userId: number): void
    {
        if(this._blockedUserIds.indexOf(userId) >= 0) return;

        this._blockedUserIds.push(userId);
        this.invalidateBlockedUsersSnapshot();
    }

    private removeUserFromBlockList(userId: number): void
    {
        const index = this._blockedUserIds.indexOf(userId);

        if(index < 0) return;

        this._blockedUserIds.splice(index, 1);
        this.invalidateBlockedUsersSnapshot();
    }

    public blockUser(userId: number): void
    {
        GetCommunication().connection.send(new BlockUserComposer(userId));
    }

    public unblockUser(userId: number): void
    {
        GetCommunication().connection.send(new UnblockUserComposer(userId));
    }

    public isBlocked(userId: number): boolean
    {
        return (this._blockedUserIds.indexOf(userId) >= 0);
    }
}
