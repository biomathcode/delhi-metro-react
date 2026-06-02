import { Cross1Icon } from '@radix-ui/react-icons';
import { use } from 'react';
import { Drawer } from 'vaul';

import { useI18n } from '../i18n';
import { getStationPathname } from '../utils/routePlanner';
import { getStationInfoById } from '../utils/stationMetadata';
import StationDetails from './StationDetails';

function StationInfoDrawer({
    stationId,
    onClose,
}: {
    stationId: string | null;
    onClose: () => void;
}) {
    const { language } = useI18n();
    const station = use(getStationInfoById(stationId));

    return (
        <Drawer.NestedRoot open={Boolean(stationId)} onOpenChange={(open) => !open && onClose()}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 z-40 bg-black/30" />
                <Drawer.Content className="fixed inset-x-2 bottom-2 z-50 max-h-[calc(100svh-1rem)] overflow-hidden rounded-xl border border-neutral-200 bg-white text-neutral-950 shadow-2xl outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 sm:inset-x-auto sm:left-1/2 sm:w-[min(760px,calc(100vw-2rem))] sm:-translate-x-1/2">
                    <Drawer.Title className="sr-only">{station?.text || 'Station details'}</Drawer.Title>
                    {station ? (
                        <div className="grid max-h-[calc(100svh-1rem)] grid-rows-[auto_minmax(0,1fr)]">
                            <div className="flex items-center justify-between gap-3 border-b border-neutral-200 p-3 dark:border-zinc-700">
                                <a
                                    href={getStationPathname(station.id)}
                                    className="rounded-lg bg-neutral-100 px-3 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                                >
                                    Full page
                                </a>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 transition hover:bg-neutral-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
                                    aria-label="Close station details"
                                >
                                    <Cross1Icon />
                                </button>
                            </div>
                            <div className="bottom-sheet-scroll min-h-0 overflow-y-auto p-3 sm:p-4">
                                <StationDetails station={station} language={language} mode="drawer" />
                            </div>
                        </div>
                    ) : null}
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.NestedRoot>
    );
}

export default StationInfoDrawer;
