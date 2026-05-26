import type React from 'react';
import { useState } from 'react';

import type { RouteSummary } from './SearchBox';

function ClockIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g clipPath="url(#clock-icon)">
                <path d="M6.5 11.5C9.26142 11.5 11.5 9.26142 11.5 6.5C11.5 3.73858 9.26142 1.5 6.5 1.5C3.73858 1.5 1.5 3.73858 1.5 6.5C1.5 9.26142 3.73858 11.5 6.5 11.5Z" stroke="#8A8888" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6.5 3.5V6.5L8.5 7.5" stroke="#8A8888" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
                <clipPath id="clock-icon">
                    <rect width="12" height="12" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}

function StopsIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g clipPath="url(#stops-icon)">
                <path d="M10.5 5C10.5 8.5 6 11.5 6 11.5C6 11.5 1.5 8.5 1.5 5C1.5 3.80653 1.97411 2.66193 2.81802 1.81802C3.66193 0.974106 4.80653 0.5 6 0.5C7.19347 0.5 8.33807 0.974106 9.18198 1.81802C10.0259 2.66193 10.5 3.80653 10.5 5Z" stroke="#8A8888" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 6.5C6.82843 6.5 7.5 5.82843 7.5 5C7.5 4.17157 6.82843 3.5 6 3.5C5.17157 3.5 4.5 4.17157 4.5 5C4.5 5.82843 5.17157 6.5 6 6.5Z" stroke="#8A8888" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
                <clipPath id="stops-icon">
                    <rect width="12" height="12" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}

function InterchangeIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M4.92606 4.47116C4.84495 10.1021 8.70849 9.3203 8.97079 9.3203" stroke="#8A8888" strokeWidth="0.8" />
            <circle cx="2" cy="4.5" r="1" stroke="#8A8888" strokeWidth="0.8" />
            <circle cx="9.86841" cy="4.5" r="1" stroke="#8A8888" strokeWidth="0.8" />
            <circle cx="9.86841" cy="9.08231" r="1" stroke="#8A8888" strokeWidth="0.8" />
            <line x1="3.00039" y1="4.30325" x2="9.07754" y2="4.30923" stroke="#8A8888" strokeWidth="0.8" />
        </svg>
    );
}

function MetricItem({
    icon,
    label,
}: {
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <div className="flex items-center gap-2 text-[15px] font-medium text-neutral-950">
            {icon}
            <span>{label}</span>
        </div>
    );
}

function JourneyMetrics({ route }: { route: RouteSummary | null }) {
    return (
        <div className="grid grid-cols-3 gap-3 border-b border-neutral-300 pb-5">
            <MetricItem icon={<ClockIcon />} label={route ? `${route.estimatedMinutes} mins` : '-- mins'} />
            <MetricItem icon={<StopsIcon />} label={route ? `${route.distance} stops` : '-- stops'} />
            <MetricItem icon={<InterchangeIcon />} label={route ? `${route.interchanges.length} change` : '-- change'} />
        </div>
    );
}

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
            <path d="M4 6L8 10L12 6" stroke="black" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function InterchangeStations({ route }: { route: RouteSummary | null }) {
    const [open, setOpen] = useState(false);
    const interchanges = route?.interchanges || [];
    const stations = route?.stationDetails || [];

    if (!route) {
        return (
            <div className="rounded-[18px] bg-white/70 p-5 text-sm text-neutral-500">
                Select source and destination to see interchange stations.
            </div>
        );
    }

    return (
        <div className="rounded-[22px] bg-white/70 p-3">
            <button
                type="button"
                className="flex w-full items-center justify-between rounded-full bg-white px-4 py-3 text-left text-sm font-semibold shadow-sm"
                onClick={() => setOpen((current) => !current)}
            >
                <span>{open ? 'All stations' : 'Interchange stations'}</span>
                <span className="flex items-center gap-2 text-xs text-neutral-500">
                    {open ? stations.length : interchanges.length}
                    <CollapseIcon open={open} />
                </span>
            </button>

            <div className={open ? 'mt-3 grid gap-2' : 'hidden'}>
                {stations.map((station) => (
                    <div key={station.id} className="flex items-center justify-between rounded-[16px] bg-[#EDEDED] p-3 text-sm">
                        <span className="truncate font-medium">{station.name}</span>
                        <span className="flex shrink-0 items-center gap-1.5">
                            {station.lineColors.map((color) => (
                                <span key={color} className="h-3.5 w-3.5 rounded-full border border-white" style={{ backgroundColor: color }} />
                            ))}
                        </span>
                    </div>
                ))}
            </div>

            <div className={open ? 'hidden' : 'mt-3 grid gap-2'}>
                {interchanges.length ? interchanges.map((interchange) => (
                    <div key={interchange.id} className="grid grid-cols-[18px_minmax(0,1fr)] gap-3 rounded-[16px] bg-[#EDEDED] p-3">
                        <div className="flex flex-col items-center pt-1">
                            <span className="h-3.5 w-3.5 rounded-full border-2 border-white" style={{ backgroundColor: interchange.fromColor }} />
                            <span className="h-5 w-0.5 bg-neutral-300" />
                            <span className="h-3.5 w-3.5 rounded-full border-2 border-white" style={{ backgroundColor: interchange.toColor }} />
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-base font-semibold">{interchange.name}</p>
                            <p className="mt-1 text-xs text-neutral-500">Change metro line here</p>
                        </div>
                    </div>
                )) : (
                    <div className="rounded-[16px] bg-[#EDEDED] p-3 text-sm text-neutral-500">
                        No interchange needed for this route.
                    </div>
                )}
            </div>
        </div>
    );
}

function JourneyInfoPanel({ route }: { route: RouteSummary | null }) {
    return (
        <section className="grid gap-6 rounded-[28px] bg-[#EDEDED] p-5">
            <JourneyMetrics route={route} />
            <InterchangeStations route={route} />
        </section>
    );
}

export default JourneyInfoPanel;
