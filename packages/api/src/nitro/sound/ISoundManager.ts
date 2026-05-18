import { IMusicController } from './IMusicController';
import { ISoundVolumesSnapshot } from './ISoundVolumesSnapshot';

export interface ISoundManager
{
    init(): Promise<void>;
    musicController: IMusicController;
    traxVolume: number;
    systemVolume: number;
    furniVolume: number;

    /**
     * Returns a referentially-stable snapshot of the three volume
     * levels (system / furni / trax). The same reference is returned
     * across reads until a volume changes; mutations dispatch
     * `NitroEventType.SOUND_VOLUMES_UPDATED` to signal invalidation.
     *
     * Pairs with `useSyncExternalStore` on the React client for
     * volume-slider widgets.
     */
    getVolumesSnapshot(): Readonly<ISoundVolumesSnapshot>;
}
