import { describe, expect, it } from 'vitest';
import { AddFriendCategoryComposer } from '../AddFriendCategoryComposer';
import { RenameFriendCategoryComposer } from '../RenameFriendCategoryComposer';
import { RemoveFriendCategoryComposer } from '../RemoveFriendCategoryComposer';
import { MoveFriendToCategoryComposer } from '../MoveFriendToCategoryComposer';

describe('friend category composers', () =>
{
    it('AddFriendCategoryComposer carries the name', () =>
    {
        expect(new AddFriendCategoryComposer('Best friends').getMessageArray()).toEqual([ 'Best friends' ]);
    });

    it('RenameFriendCategoryComposer carries id + name', () =>
    {
        expect(new RenameFriendCategoryComposer(5, 'Staff').getMessageArray()).toEqual([ 5, 'Staff' ]);
    });

    it('RemoveFriendCategoryComposer carries the id', () =>
    {
        expect(new RemoveFriendCategoryComposer(7).getMessageArray()).toEqual([ 7 ]);
    });

    it('MoveFriendToCategoryComposer carries friendId + categoryId', () =>
    {
        expect(new MoveFriendToCategoryComposer(42, 3).getMessageArray()).toEqual([ 42, 3 ]);
    });
});
