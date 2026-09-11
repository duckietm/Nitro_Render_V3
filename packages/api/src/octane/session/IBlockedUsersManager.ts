export interface IBlockedUsersManager
{
    init(): void;
    requestBlockedUsers(): void;
    blockUser(userId: number): void;
    unblockUser(userId: number): void;
    isBlocked(userId: number): boolean;

    /**
     * Returns the current block list as a frozen, referentially stable array.
     * The same reference is returned across reads until the list is mutated;
     * mutations dispatch `OctaneEventType.BLOCKED_USERS_UPDATED`.
     *
     * Pairs with `useSyncExternalStore` on the React client.
     */
    getBlockedUsersSnapshot(): ReadonlyArray<number>;
}
