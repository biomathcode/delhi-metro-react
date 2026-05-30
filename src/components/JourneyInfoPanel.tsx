import { useState } from 'react';

import { getLocalizedStationName, useI18n } from '../i18n';
import type { RouteSummary } from '../types/route';

function CollapseIcon({ open }: { open: boolean }) {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className={open ? 'rotate-180 transition-transform' : 'transition-transform'}
        >
            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function InterchangeStations({ route }: { route: RouteSummary | null }) {
    const { language, t } = useI18n();
    const [open, setOpen] = useState(false);
    const interchanges = route?.interchanges || [];
    const stations = route?.stationDetails || [];

    if (!route) {
        return (
            <div className="rounded-lg bg-neutral-100 p-2.5 text-sm text-neutral-500 dark:bg-zinc-800 dark:text-zinc-400">
                {t('selectInterchangePrompt')}
            </div>
        );
    }

    return (
        <div className="rounded-lg bg-neutral-100 p-2 dark:bg-zinc-800">
            <button
                type="button"
                className="flex h-10 w-full items-center justify-between rounded-lg bg-white px-3 text-left text-sm font-semibold shadow-sm dark:bg-zinc-900"
                onClick={() => setOpen((current) => !current)}
            >
                <span>{open ? t('allStations') : t('interchangeStations')}</span>
                <span className="flex items-center gap-2 text-xs text-neutral-500 dark:text-zinc-400">
                    {open ? stations.length : interchanges.length}
                    <CollapseIcon open={open} />
                </span>
            </button>

            <div className={open ? 'mt-2 grid gap-1.5' : 'hidden'}>
                {stations.map((station) => (
                    <div key={station.id} className="flex items-center justify-between rounded-lg bg-white/70 p-2 text-sm dark:bg-zinc-900">
                        <span className="truncate font-medium">{getLocalizedStationName(station.id, station.name, language)}</span>
                        <span className="flex shrink-0 items-center gap-1.5">
                            {station.lineColors.map((color) => (
                                <span key={color} className="h-3 w-3 rounded-full border border-white dark:border-zinc-950" style={{ backgroundColor: color }} />
                            ))}
                        </span>
                    </div>
                ))}
            </div>

            <div className={open ? 'hidden' : 'mt-2 grid gap-1.5'}>
                {interchanges.length ? interchanges.map((interchange) => (
                    <div key={interchange.id} className="grid grid-cols-[18px_minmax(0,1fr)] gap-2 rounded-lg bg-white/70 p-2 dark:bg-zinc-900">
                        <div className="flex flex-col items-center pt-0.5">
                            <span className="h-3 w-3 rounded-full border-2 border-white dark:border-zinc-950" style={{ backgroundColor: interchange.fromColor }} />
                            <span className="h-4 w-0.5 bg-neutral-300 dark:bg-zinc-600" />
                            <span className="h-3 w-3 rounded-full border-2 border-white dark:border-zinc-950" style={{ backgroundColor: interchange.toColor }} />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{getLocalizedStationName(interchange.id, interchange.name, language)}</p>
                            <p className="text-xs text-neutral-500 dark:text-zinc-400">{t('changeMetroLineHere')}</p>
                        </div>
                    </div>
                )) : (
                    <div className="rounded-lg bg-white/70 p-2 text-sm text-neutral-500 dark:bg-zinc-900 dark:text-zinc-400">
                        {t('noInterchangeNeeded')}
                    </div>
                )}
            </div>
        </div>
    );
}

function JourneyInfoPanel({ route }: { route: RouteSummary | null }) {
    return (
        <section className="grid rounded-lg bg-[#EDEDED] p-2 dark:bg-zinc-800">
            <InterchangeStations route={route} />
        </section>
    );
}

export default JourneyInfoPanel;
