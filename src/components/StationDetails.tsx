import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { getLocalizedStationName, type Language } from '../i18n';
import type {
    StationFacilityDetail,
    StationFacilityGroup,
    StationInfo,
    StationNearbyPlace,
    StationParking,
} from '../types/station';
import { getStationLineColors } from '../utils/routePlanner';

type StationDetailsMode = 'page' | 'drawer';
type StationTab = 'overview' | 'gates' | 'platforms' | 'facilities' | 'nearby' | 'access';

const tabs: Array<{ id: StationTab; label: string }> = [
    { id: 'overview', label: 'Overview' },
    { id: 'gates', label: 'Gates' },
    { id: 'platforms', label: 'Platforms' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'nearby', label: 'Nearby' },
    { id: 'access', label: 'Access' },
];

const hasText = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;
const countNumber = (value: number | '' | undefined) => typeof value === 'number' ? value : 0;
const lineLabel = (value: unknown) => hasText(value) ? value : 'Not listed';

function StatBadge({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex min-h-8 items-center rounded-full border border-neutral-200 bg-white px-3 text-xs font-semibold text-neutral-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
            {children}
        </span>
    );
}

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
    return (
        <div className="grid gap-1 rounded-lg bg-white p-3 dark:bg-zinc-900">
            <dt className="text-xs font-semibold uppercase text-neutral-500 dark:text-zinc-400">{label}</dt>
            <dd className="text-sm font-semibold text-neutral-950 dark:text-zinc-100">{value}</dd>
        </div>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="rounded-lg border border-dashed border-neutral-300 p-4 text-sm font-medium text-neutral-500 dark:border-zinc-700 dark:text-zinc-400">
            {label}
        </div>
    );
}

function OverviewTab({ station, language }: { station: StationInfo; language: Language }) {
    const lineColors = getStationLineColors(station.id);
    const facilities = station.stationFacilities || [];
    const contact = station.contact;

    return (
        <div className="grid gap-3">
            <div className="grid gap-3 rounded-lg bg-neutral-100 p-3 dark:bg-zinc-800">
                <div className="flex flex-wrap items-center gap-2">
                    {lineColors.map((color) => (
                        <span key={color} className="h-4 w-4 rounded-full border border-white dark:border-zinc-950" style={{ backgroundColor: color }} />
                    ))}
                    {station.layout ? <StatBadge>{station.layout}</StatBadge> : null}
                    {station.interchange ? <StatBadge>Interchange</StatBadge> : null}
                    {facilities.slice(0, 4).map((facility) => <StatBadge key={facility}>{facility}</StatBadge>)}
                </div>
                {station.description ? (
                    <p className="text-sm leading-6 text-neutral-700 dark:text-zinc-300">{station.description}</p>
                ) : null}
            </div>

            <dl className="grid gap-2 sm:grid-cols-2">
                <InfoRow label="Station code" value={station.id} />
                <InfoRow label="DMRC name" value={lineLabel(station.dmrcName)} />
                <InfoRow label="Gates" value={station.gates?.length || 0} />
                <InfoRow label="Platforms" value={station.platforms?.length || 0} />
                <InfoRow label="Mobile" value={lineLabel(contact?.mobile)} />
                <InfoRow label="Landline" value={lineLabel(contact?.landline)} />
                <InfoRow label="Coordinates" value={typeof station.Latitude === 'number' && typeof station.Longitude === 'number' ? `${station.Latitude}, ${station.Longitude}` : 'Not listed'} />
                <InfoRow label="Display name" value={getLocalizedStationName(station.id, station.text, language)} />
            </dl>
        </div>
    );
}

function GatesTab({ station }: { station: StationInfo }) {
    const gates = station.gates || [];

    if (!gates.length) return <EmptyState label="No gate information listed." />;

    return (
        <div className="grid gap-2">
            {gates.map((gate) => (
                <article key={`${gate.gate}-${gate.gateCode || gate.towards}`} className="grid gap-2 rounded-lg bg-neutral-100 p-3 dark:bg-zinc-800">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-neutral-950 dark:text-zinc-100">{gate.gate}</h3>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${gate.status === 'open' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-neutral-200 text-neutral-600 dark:bg-zinc-700 dark:text-zinc-300'}`}>
                            {lineLabel(gate.status)}
                        </span>
                    </div>
                    <p className="text-sm font-medium text-neutral-700 dark:text-zinc-300">{lineLabel(gate.towards)}</p>
                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-neutral-500 dark:text-zinc-400">
                        <span>{lineLabel(gate.access)}</span>
                        {gate.divyangFriendly ? <span>Divyang friendly</span> : null}
                        {gate.gateCode ? <span>{gate.gateCode}</span> : null}
                    </div>
                </article>
            ))}
        </div>
    );
}

function PlatformsTab({ station }: { station: StationInfo }) {
    const platforms = station.platforms || [];

    if (!platforms.length) return <EmptyState label="No platform information listed." />;

    return (
        <div className="grid gap-2">
            {platforms.map((platform) => (
                <article key={`${platform.name}-${platform.code || platform.towards}`} className="rounded-lg bg-neutral-100 p-3 dark:bg-zinc-800">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-neutral-950 dark:text-zinc-100">{platform.name}</h3>
                        {platform.code ? <span className="text-xs font-semibold text-neutral-500 dark:text-zinc-400">{platform.code}</span> : null}
                    </div>
                    <p className="mt-2 text-sm font-medium text-neutral-700 dark:text-zinc-300">Towards {lineLabel(platform.towards)}</p>
                    {platform.secondTowards ? (
                        <p className="mt-1 text-sm font-medium text-neutral-700 dark:text-zinc-300">Also towards {platform.secondTowards}</p>
                    ) : null}
                </article>
            ))}
        </div>
    );
}

function FacilityDetail({ detail }: { detail: StationFacilityDetail }) {
    return (
        <div className="rounded-lg bg-white p-3 dark:bg-zinc-900">
            <p className="text-sm font-semibold text-neutral-950 dark:text-zinc-100">{lineLabel(detail.name || detail.purpose)}</p>
            <p className="mt-1 text-sm text-neutral-600 dark:text-zinc-400">{lineLabel(detail.location)}</p>
            {detail.nearestGate || detail.nearestGateCode ? (
                <p className="mt-1 text-xs font-semibold text-neutral-500 dark:text-zinc-500">{detail.nearestGate || detail.nearestGateCode}</p>
            ) : null}
        </div>
    );
}

function FacilityGroup({ group }: { group: StationFacilityGroup }) {
    return (
        <section className="grid gap-2 rounded-lg bg-neutral-100 p-3 dark:bg-zinc-800">
            <h3 className="text-sm font-semibold text-neutral-950 dark:text-zinc-100">{group.kind}</h3>
            <div className="grid gap-2">
                {(group.details || []).map((detail, index) => <FacilityDetail key={`${group.kind}-${index}`} detail={detail} />)}
            </div>
        </section>
    );
}

function FacilitiesTab({ station }: { station: StationInfo }) {
    const facilities = station.facilities || [];
    const parking = station.parking || [];
    const lifts = station.lifts || [];

    if (!facilities.length && !parking.length && !lifts.length && !station.stationFacilities?.length) {
        return <EmptyState label="No facility information listed." />;
    }

    return (
        <div className="grid gap-3">
            {station.stationFacilities?.length ? (
                <div className="flex flex-wrap gap-2">
                    {station.stationFacilities.map((facility) => <StatBadge key={facility}>{facility}</StatBadge>)}
                </div>
            ) : null}

            {facilities.map((group) => <FacilityGroup key={group.kind} group={group} />)}

            {parking.length ? (
                <section className="grid gap-2 rounded-lg bg-neutral-100 p-3 dark:bg-zinc-800">
                    <h3 className="text-sm font-semibold text-neutral-950 dark:text-zinc-100">Parking</h3>
                    {parking.map((item: StationParking, index) => (
                        <div key={`${item.provider}-${index}`} className="rounded-lg bg-white p-3 dark:bg-zinc-900">
                            <p className="text-sm font-semibold">{lineLabel(item.provider)}</p>
                            <p className="mt-1 text-sm text-neutral-600 dark:text-zinc-400">{lineLabel(item.location)}</p>
                            <p className="mt-1 text-xs font-semibold text-neutral-500 dark:text-zinc-500">
                                Cars {countNumber(item.carCapacity)} · Bikes {countNumber(item.motorcycleCapacity)} · Cycles {countNumber(item.cycleCapacity)}
                            </p>
                        </div>
                    ))}
                </section>
            ) : null}

            {lifts.length ? (
                <section className="grid gap-2 rounded-lg bg-neutral-100 p-3 dark:bg-zinc-800">
                    <h3 className="text-sm font-semibold text-neutral-950 dark:text-zinc-100">Lifts / Escalators</h3>
                    {lifts.map((lift, index) => (
                        <div key={`${lift.name}-${index}`} className="rounded-lg bg-white p-3 dark:bg-zinc-900">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <p className="text-sm font-semibold">{lineLabel(lift.name || lift.type)}</p>
                                <span className="text-xs font-semibold text-neutral-500 dark:text-zinc-500">{lift.status ? 'Active' : 'Status unknown'}</span>
                            </div>
                            <p className="mt-1 text-sm text-neutral-600 dark:text-zinc-400">{lineLabel(lift.location)}</p>
                            <p className="mt-1 text-xs font-semibold text-neutral-500 dark:text-zinc-500">
                                {lineLabel(lift.insideOutside)}{lift.divyangFriendly ? ' · Divyang friendly' : ''}
                            </p>
                        </div>
                    ))}
                </section>
            ) : null}
        </div>
    );
}

const nearbyGroupKey = (place: StationNearbyPlace) => place.category || place.type || 'Nearby';

function NearbyTab({ station }: { station: StationInfo }) {
    const groups = useMemo(() => {
        const grouped = new Map<string, StationNearbyPlace[]>();
        (station.nearbyPlaces || []).forEach((place) => {
            const key = nearbyGroupKey(place);
            grouped.set(key, [...(grouped.get(key) || []), place]);
        });
        return [...grouped.entries()];
    }, [station.nearbyPlaces]);

    if (!groups.length) return <EmptyState label="No nearby places listed." />;

    return (
        <div className="grid gap-3">
            {groups.map(([category, places]) => (
                <section key={category} className="grid gap-2 rounded-lg bg-neutral-100 p-3 dark:bg-zinc-800">
                    <h3 className="text-sm font-semibold text-neutral-950 dark:text-zinc-100">{category}</h3>
                    <div className="grid gap-2">
                        {places.map((place, index) => (
                            <article key={`${place.name}-${index}`} className="rounded-lg bg-white p-3 dark:bg-zinc-900">
                                <p className="text-sm font-semibold text-neutral-950 dark:text-zinc-100">{place.name}</p>
                                <p className="mt-1 text-sm text-neutral-600 dark:text-zinc-400">{lineLabel(place.type)}</p>
                                <p className="mt-1 text-xs font-semibold text-neutral-500 dark:text-zinc-500">
                                    {typeof place.distanceKm === 'number' ? `${place.distanceKm} km` : 'Distance not listed'}
                                    {typeof place.estimatedWalkingMinutes === 'number' ? ` · ${place.estimatedWalkingMinutes} min walk` : ''}
                                    {typeof place.estimatedPublicTransportMinutes === 'number' ? ` · ${place.estimatedPublicTransportMinutes} min transit` : ''}
                                </p>
                            </article>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
}

function AccessTab({ station }: { station: StationInfo }) {
    return (
        <div className="grid gap-3">
            <dl className="grid gap-2 sm:grid-cols-2">
                <InfoRow label="Layout" value={lineLabel(station.layout)} />
                <InfoRow label="Interchange" value={station.interchange ? 'Yes' : 'No'} />
                <InfoRow label="Divyang friendly" value={station.stationFacilities?.some((item) => item.toLowerCase().includes('divyang')) ? 'Yes' : 'Not listed'} />
                <InfoRow label="Parking" value={station.parking?.length ? 'Available' : 'Not listed'} />
            </dl>
            <GatesTab station={station} />
        </div>
    );
}

function StationDetails({ station, language, mode = 'page' }: { station: StationInfo; language: Language; mode?: StationDetailsMode }) {
    const [activeTab, setActiveTab] = useState<StationTab>('overview');
    const stationName = getLocalizedStationName(station.id, station.text, language);
    const content = {
        overview: <OverviewTab station={station} language={language} />,
        gates: <GatesTab station={station} />,
        platforms: <PlatformsTab station={station} />,
        facilities: <FacilitiesTab station={station} />,
        nearby: <NearbyTab station={station} />,
        access: <AccessTab station={station} />,
    }[activeTab];

    return (
        <section className={`grid gap-4 ${mode === 'page' ? 'mx-auto w-full max-w-5xl' : ''}`}>
            <header className="grid gap-2">
                <p className="text-xs font-semibold uppercase text-[#009b50] dark:text-emerald-400">Metro station</p>
                <h1 className={`${mode === 'page' ? 'text-3xl sm:text-4xl' : 'text-2xl'} font-semibold leading-tight text-neutral-950 dark:text-zinc-50`}>
                    {stationName}
                </h1>
            </header>

            <div className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="inline-flex min-w-max rounded-lg border border-neutral-200 bg-white p-1 dark:border-zinc-700 dark:bg-zinc-900" role="tablist" aria-label={`${stationName} station details`}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`h-10 rounded-md px-3 text-sm font-semibold transition ${activeTab === tab.id ? 'bg-neutral-200 text-neutral-950 dark:bg-zinc-700 dark:text-white' : 'text-neutral-600 hover:bg-neutral-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div role="tabpanel">
                {content}
            </div>
        </section>
    );
}

export default StationDetails;
