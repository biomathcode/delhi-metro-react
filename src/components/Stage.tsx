/* eslint-disable @typescript-eslint/no-explicit-any */
import { PlayIcon, } from '@radix-ui/react-icons';
import { lazy, memo, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Drawer } from 'vaul';

import { getLocalizedStationName, useI18n } from '../i18n';
import { usePath } from '../store/pathStore';
import type { CinematicZoomLevel, RoutePlan, RouteSortMode } from '../types/route';
import { sortRoutePlans } from '../utils/routePlanner';
import CreatorLinks from './CreatorLinks';
import JourneyInfoPanel from './JourneyInfoPanel';
import { InterchangeIcon, StopsIcon } from '../icons';

const SvgComponent = lazy(() => import('./graphsvg'));
const SearchBox = lazy(() => import('./SearchBox'));
const RouteSharePanel = lazy(() => import('./RouteSharePanel'));
const JourneyTimeline = lazy(() => import('./JourneyTimeline'));

type NavigatorWithVirtualKeyboard = Navigator & {
    virtualKeyboard?: {
        overlaysContent: boolean;
    };
};

function useIsDesktop() {
    const [isDesktop, setIsDesktop] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia('(min-width: 1024px)').matches;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 1024px)');
        const updateIsDesktop = () => setIsDesktop(mediaQuery.matches);

        updateIsDesktop();
        mediaQuery.addEventListener('change', updateIsDesktop);

        return () => mediaQuery.removeEventListener('change', updateIsDesktop);
    }, []);

    return isDesktop;
}

function useDeferredInteractiveLoad() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        let timeoutId = 0;
        let frameId = 0;
        let idleId = 0;

        const markReady = () => setIsReady(true);
        frameId = window.requestAnimationFrame(() => {
            if (typeof window.requestIdleCallback === 'function') {
                idleId = window.requestIdleCallback(markReady, { timeout: 1200 });
            } else {
                timeoutId = globalThis.setTimeout(markReady, 350);
            }
        });

        return () => {
            window.cancelAnimationFrame(frameId);
            if (idleId) window.cancelIdleCallback(idleId);
            if (timeoutId) window.clearTimeout(timeoutId);
        };
    }, []);

    return isReady;
}

function MapFallback() {
    return (
        <div className="flex h-full min-h-[inherit] items-center justify-center bg-[#f4f0e8] text-sm font-semibold text-neutral-500 dark:bg-zinc-950 dark:text-zinc-400">
            Loading metro map...
        </div>
    );
}

function SearchFallback() {
    return (
        <div className="grid gap-3 [--station-select-height:48px] sm:gap-4 sm:[--station-select-height:58px]">
            <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-2 sm:gap-3">
                <div className="h-[var(--station-select-height)] rounded-full bg-neutral-100 dark:bg-zinc-800" />
                <div className="h-[var(--station-select-height)] rounded-full bg-neutral-100 dark:bg-zinc-800" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <div className="h-11 w-32 rounded-full bg-neutral-100 dark:bg-zinc-800" />
                <div className="h-11 w-28 rounded-full bg-neutral-100 dark:bg-zinc-800" />
                <div className="h-11 w-32 rounded-full bg-neutral-100 dark:bg-zinc-800" />
            </div>
        </div>
    );
}

interface RouteSummaryCardsProps {
    route: any;
}

const RouteSummaryCards = memo(function RouteSummaryCards({ route }: RouteSummaryCardsProps) {
    const { t } = useI18n();

    return (
        <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg bg-neutral-100 p-2 dark:bg-zinc-800">
                <p className="text-xs font-medium text-neutral-500 dark:text-zinc-400">{t('fare')}</p>
                <p className="mt-0.5 text-base font-semibold">{route ? `₹${route.fare}` : '—'}</p>
            </div>
            <div className="rounded-lg bg-neutral-100 p-2 dark:bg-zinc-800">
                <p className="text-xs font-medium text-neutral-500 dark:text-zinc-400">{t('stops')}</p>
                <p className="mt-0.5 text-base font-semibold">{route ? route.distance : '—'}</p>
            </div>
            <div className="rounded-lg bg-neutral-100 p-2 dark:bg-zinc-800">
                <p className="text-xs font-medium text-neutral-500 dark:text-zinc-400">{t('time')}</p>
                <p className="mt-0.5 text-base font-semibold">{route ? t('minutesShort', { count: route.estimatedMinutes }) : '—'}</p>
            </div>
        </div>
    );
});

function RouteOptions({
    activeRouteId,
    routeOptions,
    sortMode,
    onSortModeChange,
    onSelectRoute,
    onPlayRoute,
}: {
    activeRouteId?: string;
    routeOptions: RoutePlan[];
    sortMode: RouteSortMode;
    onSortModeChange: (sortMode: RouteSortMode) => void;
    onSelectRoute: (routeOption: RoutePlan) => void;
    onPlayRoute: (routeOption: RoutePlan) => void;
}) {
    const { t } = useI18n();

    if (routeOptions.length <= 1) return null;

    return (
        <section className="grid gap-2">
            <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-neutral-700 dark:text-zinc-300">{t('routeOptions')}</h3>
                <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-0.5 dark:border-zinc-700 dark:bg-zinc-900" role="radiogroup" aria-label={t('sortRoutes')}>
                    <button
                        type="button"
                        role="radio"
                        aria-checked={sortMode === 'interchanges'}
                        onClick={() => onSortModeChange('interchanges')}
                        className={`flex h-10 w-10 items-center justify-center rounded-md transition ${sortMode === 'interchanges' ? 'bg-neutral-200 text-neutral-950 dark:bg-zinc-700 dark:text-white' : 'text-neutral-600 hover:bg-neutral-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}
                        title={t('sortByInterchanges')}
                    >
                        <InterchangeIcon />
                    </button>
                    <button
                        type="button"
                        role="radio"
                        aria-checked={sortMode === 'stops'}
                        onClick={() => onSortModeChange('stops')}
                        className={`flex h-10 w-10 items-center justify-center rounded-md transition ${sortMode === 'stops' ? 'bg-neutral-200 text-neutral-950 dark:bg-zinc-700 dark:text-white' : 'text-neutral-600 hover:bg-neutral-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}
                        title={t('sortByStops')}
                    >
                        <StopsIcon />
                    </button>
                </div>
            </div>
            <div className="route-options-scroll -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
                {routeOptions.map((routeOption, index) => {
                    const isActive = routeOption.route.optionId === activeRouteId;
                    const firstInterchanges = routeOption.route.interchanges.slice(0, 2);
                    const remainingInterchanges = Math.max(0, routeOption.route.interchanges.length - firstInterchanges.length);

                    return (
                        <div
                            key={routeOption.route.optionId}
                            style={{ animationDelay: `${Math.min(index, 5) * 35}ms` }}
                            className={` shrink-0 rounded-lg border p-3 transition w-[240px] ${isActive
                                ? 'border-neutral-300 bg-neutral-100 text-neutral-950 shadow-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-white'
                                : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600 dark:hover:bg-zinc-800'
                                } route-option-card`}
                        >
                            <div className="grid gap-2">
                                <div className="flex items-start justify-between gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onSelectRoute(routeOption)}
                                        className=" flex-1 text-left"
                                    >
                                        <span className="flex min-w-0 items-center gap-2">
                                            <span className="truncate text-sm font-semibold">
                                                {t('routeOption', { count: index + 1 })}
                                            </span>
                                            {index === 0 ? (
                                                <span className="shrink-0 rounded-full bg-neutral-200 px-2 py-0.5 text-xs font-semibold text-neutral-700 dark:bg-zinc-700 dark:text-zinc-200">
                                                    {t('recommended')}
                                                </span>
                                            ) : null}
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onPlayRoute(routeOption)}
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${isActive ? 'bg-neutral-800 text-white hover:bg-neutral-700 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'}`}
                                        title={t('playRoute')}
                                        aria-label={t('playRoute')}
                                    >
                                        <PlayIcon className="h-3.5 w-3.5" />
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => onSelectRoute(routeOption)}
                                    className="grid w-full gap-2 text-left"
                                >
                                    <span className="flex items-center justify-between gap-2 text-xs font-semibold text-neutral-500 dark:text-zinc-400">
                                        <span className="shrink-0">{t('minutesShort', { count: routeOption.route.estimatedMinutes })}</span>
                                        <span className="inline-flex shrink-0 items-center gap-1">
                                            <StopsIcon />
                                            {routeOption.route.distance}
                                        </span>
                                        <span className="inline-flex shrink-0 items-center gap-1">
                                            <InterchangeIcon />
                                            {routeOption.route.interchanges.length}
                                        </span>
                                        <span className="shrink-0 text-right">₹{routeOption.route.fare}</span>
                                    </span>

                                    <span className="grid gap-1">
                                        {firstInterchanges.length ? firstInterchanges.map((interchange) => (
                                            <span key={interchange.id} className="grid grid-cols-[16px_minmax(0,1fr)] gap-1.5 rounded-lg bg-neutral-100 p-1.5 dark:bg-zinc-800">
                                                <span className="flex flex-col items-center pt-0.5" aria-hidden="true">
                                                    <span className="h-2.5 w-2.5 rounded-full border border-white dark:border-zinc-900" style={{ backgroundColor: interchange.fromColor }} />
                                                    <span className="h-3 w-px bg-neutral-300 dark:bg-zinc-600" />
                                                    <span className="h-2.5 w-2.5 rounded-full border border-white dark:border-zinc-900" style={{ backgroundColor: interchange.toColor }} />
                                                </span>
                                                <span className="min-w-0">
                                                    <span className="block truncate text-xs font-semibold text-neutral-800 dark:text-zinc-100">{interchange.name}</span>
                                                    <span className="block text-xs font-medium text-neutral-500 dark:text-zinc-400">{t('changeMetroLineHere')}</span>
                                                </span>
                                            </span>
                                        )) : (
                                            <span className="rounded-lg bg-neutral-100 px-2 py-1.5 text-xs font-semibold text-neutral-600 dark:bg-zinc-800 dark:text-zinc-300">
                                                {t('directRoute')}
                                            </span>
                                        )}
                                        {remainingInterchanges ? (
                                            <span className="rounded-lg bg-neutral-100 px-2 py-1 text-xs font-semibold text-neutral-500 dark:bg-zinc-800 dark:text-zinc-400">
                                                {t('moreInterchanges', { count: remainingInterchanges })}
                                            </span>
                                        ) : null}
                                    </span>


                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

function MetroMapStage() {
    const { language, t } = useI18n();
    const [play, setPlay] = useState(false);
    const [animationMode, setAnimationMode] = useState<'smooth' | 'step'>('smooth');
    const [cinematicZoom, setCinematicZoom] = useState<CinematicZoomLevel>(2);
    const [activeSnapPoint, setActiveSnapPoint] = useState<number | string | null>('220px');
    const [activeRouteStationId, setActiveRouteStationId] = useState<string | null>(null);
    const [routeFitRequest, setRouteFitRequest] = useState(0);
    const [routePreviewMode, setRoutePreviewMode] = useState(false);
    const [routeSortMode, setRouteSortMode] = useState<RouteSortMode>('interchanges');
    const isDesktop = useIsDesktop();
    const canLoadInteractiveMap = useDeferredInteractiveLoad();

    const path = usePath((state: any) => state.path);
    const route = usePath((state: any) => state.route);
    const routeOptions = usePath((state: any) => state.routeOptions);
    const setRoute = usePath((state: any) => state.setRoute);
    const selectedFrom = usePath((state: any) => state.selectedFrom);

    const routeStationIds = useMemo(
        () => route?.stationDetails.map((station: { id: string }) => station.id) || [],
        [route]
    );
    const sortedRouteOptions = useMemo(
        () => sortRoutePlans(routeOptions || [], routeSortMode),
        [routeOptions, routeSortMode]
    );
    const routeFromName = route ? getLocalizedStationName(route.from, route.fromName, language) : '';
    const routeToName = route ? getLocalizedStationName(route.to, route.toName, language) : '';

    const handleFromChange = useCallback(() => setPlay(false), []);
    const handleStationSearchFocus = useCallback(() => {
        if (isDesktop) return;

        setActiveSnapPoint(1);
    }, [isDesktop]);
    const handleRoutePlan = useCallback((plannedRoute?: RoutePlan) => {
        setActiveSnapPoint('100px');
        setRoutePreviewMode(false);
        setPlay((currentPlay) => {
            if (route && plannedRoute?.route.optionId === route.optionId) {
                return !currentPlay;
            }

            return true;
        });
    }, [route]);
    const handleRouteOptionSelect = useCallback((routeOption: RoutePlan) => {
        setRoute(routeOption.svgPath, routeOption.route, routeOptions);
        setActiveRouteStationId(null);
        setRoutePreviewMode(true);
        setPlay(false);
        setRouteFitRequest((request) => request + 1);
    }, [routeOptions, setRoute]);
    const handleRouteOptionPlay = useCallback((routeOption: RoutePlan) => {
        const isActiveRoute = routeOption.route.optionId === route?.optionId;
        if (!isActiveRoute) {
            setRoute(routeOption.svgPath, routeOption.route, routeOptions);
        }
        setActiveRouteStationId(null);
        setRoutePreviewMode(false);
        setPlay((currentPlay) => isActiveRoute ? !currentPlay : true);
    }, [route, routeOptions, setRoute]);

    useEffect(() => {
        const virtualKeyboard = (navigator as NavigatorWithVirtualKeyboard).virtualKeyboard;
        if (!virtualKeyboard) return;

        const previousOverlaysContent = virtualKeyboard.overlaysContent;
        virtualKeyboard.overlaysContent = true;

        return () => {
            virtualKeyboard.overlaysContent = previousOverlaysContent;
        };
    }, []);

    const cockpitBody = (
        <>
            <Suspense fallback={<SearchFallback />}>
                <SearchBox
                    animationMode={animationMode}
                    cinematicZoom={cinematicZoom}
                    disableSearch={!isDesktop}
                    onAnimationModeChange={setAnimationMode}
                    onCinematicZoomChange={setCinematicZoom}
                    onFromChange={handleFromChange}
                    onRoutePlan={handleRoutePlan}
                    onStationSearchFocus={handleStationSearchFocus}
                />
            </Suspense>
            <section className="grid gap-3 border-t border-neutral-200 pt-3 dark:border-zinc-700 sm:gap-4 sm:pt-5">
                <div>
                    <h2 className="text-lg font-semibold sm:mt-2 sm:text-xl">
                        {route ? t('routeTitle', { from: routeFromName, to: routeToName }) : t('chooseRoute')}
                    </h2>
                </div>
                <RouteOptions
                    activeRouteId={route?.optionId}
                    routeOptions={sortedRouteOptions}
                    sortMode={routeSortMode}
                    onSortModeChange={setRouteSortMode}
                    onSelectRoute={handleRouteOptionSelect}
                    onPlayRoute={handleRouteOptionPlay}
                />

                {route ? (
                    <Suspense fallback={<section className="rounded-lg bg-white p-3 text-sm text-neutral-500 dark:bg-zinc-900 dark:text-zinc-400">{t('journeyTimelinePrompt')}</section>}>
                        <JourneyTimeline route={route} activeStationId={activeRouteStationId} />
                    </Suspense>
                ) : (
                    <section className="rounded-lg bg-white p-3 text-sm text-neutral-500 dark:bg-zinc-900 dark:text-zinc-400">
                        {t('journeyTimelinePrompt')}
                    </section>
                )}

                <RouteSummaryCards route={route} />

                <JourneyInfoPanel route={route} />
                {route ? (
                    <Suspense fallback={null}>
                        <RouteSharePanel route={route} fromName={routeFromName} toName={routeToName} />
                    </Suspense>
                ) : null}
                <CreatorLinks />
            </section>
        </>
    );

    return (
        <div className="min-h-svh overflow-hidden bg-[#f4f0e8] p-2 text-neutral-950 dark:bg-zinc-950 dark:text-zinc-50 sm:p-4 lg:overflow-visible lg:p-6">
            <div className="grid min-h-[calc(100svh-1.5rem)] gap-4 sm:min-h-[calc(100svh-2rem)] lg:min-h-[calc(100svh-3rem)] lg:grid-cols-2">
                <main className="relative min-h-[calc(100svh-1.5rem)] overflow-hidden rounded-lg border border-neutral-200 bg-[#f4f0e8] shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:min-h-[calc(100svh-2rem)] lg:min-h-0">
                    {canLoadInteractiveMap ? (
                        <Suspense fallback={<MapFallback />}>
                            <SvgComponent
                                path={path}
                                route={route}
                                selectedStationId={selectedFrom}
                                routeStationIds={routeStationIds}
                                onActiveStationChange={setActiveRouteStationId}
                                animationMode={animationMode}
                                cinematicZoom={cinematicZoom}
                                routeFitRequest={routeFitRequest}
                                routePreviewMode={routePreviewMode}
                                setPlay={setPlay}
                                play={play}
                            />
                        </Suspense>
                    ) : (
                        <MapFallback />
                    )}
                </main>

                {!isDesktop ? (
                    <Drawer.Root
                        activeSnapPoint={activeSnapPoint}
                        setActiveSnapPoint={setActiveSnapPoint}
                        defaultOpen
                        dismissible={false}
                        modal={false}
                        snapPoints={['100px', '220px', 1]}
                        handleOnly
                    >
                        <Drawer.Portal>
                            <Drawer.Content
                                className="fixed inset-x-2 bottom-2 z-30 flex max-w-[calc(100vw-1rem)] flex-col gap-2 overflow-hidden rounded-xl border border-neutral-200 bg-white p-3 shadow-2xl outline-none dark:border-zinc-700 dark:bg-zinc-900 sm:inset-x-4 sm:bottom-4 sm:max-w-[calc(100vw-2rem)] sm:gap-4 sm:p-5"
                                style={{
                                    bottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
                                    height: 'calc(100svh - env(safe-area-inset-bottom, 0px) - 16px)',
                                    paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)'
                                }}
                            >
                                <Drawer.Title className="sr-only">{t('routePlanner')}</Drawer.Title>
                                <div className="-mx-3 -mt-3 flex shrink-0 justify-center px-3 pt-1 sm:-mx-5 sm:-mt-5 sm:px-5 sm:pt-2">
                                    <Drawer.Handle
                                        className="relative h-9 w-28 rounded-full before:absolute before:left-1/2 before:top-1/2 before:h-1 before:w-20 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:bg-neutral-200 before:transition-colors active:before:bg-neutral-300 dark:before:bg-zinc-700 dark:active:before:bg-zinc-600 sm:w-32 sm:before:w-24"
                                        aria-label={t('routePlanner')}
                                    />
                                </div>
                                <div className="bottom-sheet-scroll scrollbar-thin scrollbar-gutter-stable min-h-0 min-w-0 overflow-y-auto">
                                    <div className="grid min-w-0 gap-3 pe-2 sm:gap-5">
                                        {cockpitBody}
                                    </div>
                                </div>
                            </Drawer.Content>
                        </Drawer.Portal>
                    </Drawer.Root>
                ) : (
                    <aside className="min-h-0 flex-col gap-5 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 sm:p-5 lg:flex lg:max-h-[calc(100vh-3rem)]">
                        <div>
                            <h1 className="mt-2 text-sm font-semibold uppercase text-red-700">{t('delhiMetro')}</h1>
                        </div>

                        {cockpitBody}
                    </aside>
                )}
            </div>
        </div>
    );
}

export default MetroMapStage;
