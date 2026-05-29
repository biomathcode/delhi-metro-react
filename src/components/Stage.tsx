/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, memo, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { Drawer } from 'vaul';

import { getLocalizedStationName, useI18n } from '../i18n';
import { usePath } from '../store/pathStore';
import type { CinematicZoomLevel } from '../types/route';
import CreatorLinks from './CreatorLinks';
import JourneyInfoPanel from './JourneyInfoPanel';

const SvgComponent = lazy(() => import('./graphsvg'));
const SearchBox = lazy(() => import('./SearchBox'));
const RouteSharePanel = lazy(() => import('./RouteSharePanel'));
const JourneyTimeline = lazy(() => import('./JourneyTimeline'));

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
        <div className="flex h-full min-h-[inherit] items-center justify-center bg-[#f4f0e8] text-sm font-semibold text-neutral-500">
            Loading metro map...
        </div>
    );
}

function SearchFallback() {
    return (
        <div className="grid gap-3 [--station-select-height:48px] sm:gap-4 sm:[--station-select-height:58px]">
            <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-2 sm:gap-3">
                <div className="h-[var(--station-select-height)] rounded-full bg-neutral-100" />
                <div className="h-[var(--station-select-height)] rounded-full bg-neutral-100" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
                <div className="h-11 w-32 rounded-full bg-neutral-100" />
                <div className="h-11 w-28 rounded-full bg-neutral-100" />
                <div className="h-11 w-32 rounded-full bg-neutral-100" />
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
            <div className="rounded-md bg-neutral-100 p-2 sm:p-3">
                <p className="text-xs text-neutral-500">{t('fare')}</p>
                <p className="mt-1 text-base font-semibold sm:text-lg">{route ? `₹${route.fare}` : '—'}</p>
            </div>
            <div className="rounded-md bg-neutral-100 p-2 sm:p-3">
                <p className="text-xs text-neutral-500">{t('stops')}</p>
                <p className="mt-1 text-base font-semibold sm:text-lg">{route ? route.distance : '—'}</p>
            </div>
            <div className="rounded-md bg-neutral-100 p-2 sm:p-3">
                <p className="text-xs text-neutral-500">{t('time')}</p>
                <p className="mt-1 text-base font-semibold sm:text-lg">{route ? t('minutesShort', { count: route.estimatedMinutes }) : '—'}</p>
            </div>
        </div>
    );
});

function MetroMapStage() {
    const { language, t } = useI18n();
    const [play, setPlay] = useState(false);
    const [animationMode, setAnimationMode] = useState<'smooth' | 'step'>('smooth');
    const [cinematicZoom, setCinematicZoom] = useState<CinematicZoomLevel>(2);
    const [activeSnapPoint, setActiveSnapPoint] = useState<number | string | null>('220px');
    const [activeRouteStationId, setActiveRouteStationId] = useState<string | null>(null);
    const isDesktop = useIsDesktop();
    const canLoadInteractiveMap = useDeferredInteractiveLoad();

    const path = usePath((state: any) => state.path);
    const route = usePath((state: any) => state.route);
    const selectedFrom = usePath((state: any) => state.selectedFrom);

    const routeStationIds = useMemo(
        () => route?.stationDetails.map((station: { id: string }) => station.id) || [],
        [route]
    );
    const routeFromName = route ? getLocalizedStationName(route.from, route.fromName, language) : '';
    const routeToName = route ? getLocalizedStationName(route.to, route.toName, language) : '';

    const handleFromChange = useCallback(() => setPlay(false), []);
    const handleRoutePlan = useCallback(() => {
        setActiveSnapPoint('100px');
        setPlay(true);
    }, []);

    const cockpitBody = (
        <>
            <Suspense fallback={<SearchFallback />}>
                <SearchBox
                    animationMode={animationMode}
                    cinematicZoom={cinematicZoom}
                    onAnimationModeChange={setAnimationMode}
                    onCinematicZoomChange={setCinematicZoom}
                    onFromChange={handleFromChange}
                    onRoutePlan={handleRoutePlan}
                />
            </Suspense>
            <section className="grid gap-3 border-t border-neutral-200 pt-3 sm:gap-4 sm:pt-5">
                <div>
                    <h2 className="text-lg font-semibold sm:mt-2 sm:text-xl">
                        {route ? t('routeTitle', { from: routeFromName, to: routeToName }) : t('chooseRoute')}
                    </h2>
                </div>
                {route ? (
                    <Suspense fallback={<section className="rounded-lg bg-white p-3 text-sm text-neutral-500">{t('journeyTimelinePrompt')}</section>}>
                        <JourneyTimeline route={route} activeStationId={activeRouteStationId} />
                    </Suspense>
                ) : (
                    <section className="rounded-lg bg-white p-3 text-sm text-neutral-500">
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
        <div className="min-h-svh overflow-hidden bg-[#f4f0e8] p-2 text-neutral-950 sm:p-4 lg:overflow-visible lg:p-6">
            <div className="grid min-h-[calc(100svh-1.5rem)] gap-4 sm:min-h-[calc(100svh-2rem)] lg:min-h-[calc(100svh-3rem)] lg:grid-cols-2">
                <main className="relative min-h-[calc(100svh-1.5rem)] overflow-hidden rounded-lg border border-neutral-200 shadow-sm sm:min-h-[calc(100svh-2rem)] lg:min-h-0">
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
                                className="fixed inset-x-2 bottom-2 z-30 flex flex-col gap-2 overflow-hidden rounded-3xl border border-neutral-200 bg-white p-3 shadow-2xl outline-none sm:inset-x-4 sm:bottom-4 sm:gap-4 sm:rounded-[28px] sm:p-5"
                                style={{
                                    bottom: 'calc(env(safe-area-inset-bottom, 0px) + 8px)',
                                    height: 'calc(100svh - env(safe-area-inset-bottom, 0px) - 16px)',
                                    paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)'
                                }}
                            >
                                <Drawer.Title className="sr-only">{t('routePlanner')}</Drawer.Title>
                                <div className="-mx-3 -mt-3 flex shrink-0 justify-center px-3 pb-2 pt-3 sm:-mx-5 sm:-mt-5 sm:px-5 sm:pb-3 sm:pt-5">
                                    <Drawer.Handle className="h-1 w-20 rounded-full bg-neutral-200 sm:w-24" />
                                </div>
                                <div className="min-h-0 overflow-y-auto pr-1">
                                    <div className="grid gap-3 sm:gap-5">
                                        {cockpitBody}
                                    </div>
                                </div>
                            </Drawer.Content>
                        </Drawer.Portal>
                    </Drawer.Root>
                ) : (
                    <aside className="min-h-0 flex-col gap-5 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:p-5 lg:flex lg:max-h-[calc(100vh-3rem)]">
                        <div>
                            <h1 className="mt-2 text-md font-semibold uppercase text-red-700">{t('delhiMetro')}</h1>
                        </div>

                        {cockpitBody}
                    </aside>
                )}
            </div>
        </div>
    );
}

export default MetroMapStage;
