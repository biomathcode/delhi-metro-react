/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';


import stations from '../data/labels.json';
import JourneyInfoPanel from './JourneyInfoPanel';
import RouteDirectionCard from './RouteDirectionCard';
import SvgComponent from './graphsvg';
import { SearchBox, usePath } from './SearchBox';


function MetroMapStage() {
    const [play, setPlay] = useState(false);


    const path = usePath((state: any) => state.path);
    const route = usePath((state: any) => state.route);
    const selectedFrom = usePath((state: any) => state.selectedFrom);
    const selectedFromName = stations.find((station) => station.id === selectedFrom)?.text || selectedFrom;

    return (
        <div className="min-h-screen bg-[#f4f0e8] p-3 text-neutral-950 sm:p-4 lg:p-6">
            <div className="grid min-h-[calc(100vh-1.5rem)] gap-4 sm:min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-3rem)] lg:grid-cols-2">
                <main className="relative min-h-[60svh] overflow-hidden rounded-lg border border-neutral-200 shadow-sm sm:min-h-[68svh] lg:min-h-0">
                    <SvgComponent
                        path={path}
                        selectedStationId={selectedFrom}
                        setPlay={setPlay}
                        play={play}
                    />
                </main>

                <aside className="flex min-h-0 flex-col gap-5 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:p-5 lg:max-h-[calc(100vh-3rem)]">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-700">Delhi Metro</p>
                        <h1 className="mt-2 text-2xl font-semibold">Route cockpit</h1>
                    </div>
                    <RouteDirectionCard
                        fromName={route?.fromName || selectedFromName}
                        toName={route?.toName}
                    />
                    <SearchBox
                        onFromChange={() => setPlay(false)}
                        onRoutePlan={() => setPlay(true)}
                    />
                    <section className="grid gap-4 border-t border-neutral-200 pt-5">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500">Next journey</p>
                            <h2 className="mt-2 text-xl font-semibold">
                                {route ? `${route.fromName} to ${route.toName}` : 'Choose a route'}
                            </h2>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="rounded-md bg-neutral-100 p-3">
                                <p className="text-xs text-neutral-500">Fare</p>
                                <p className="mt-1 text-lg font-semibold">{route ? `₹${route.fare}` : '—'}</p>
                            </div>
                            <div className="rounded-md bg-neutral-100 p-3">
                                <p className="text-xs text-neutral-500">Stops</p>
                                <p className="mt-1 text-lg font-semibold">{route ? route.distance : '—'}</p>
                            </div>
                            <div className="rounded-md bg-neutral-100 p-3">
                                <p className="text-xs text-neutral-500">Time</p>
                                <p className="mt-1 text-lg font-semibold">{route ? `${route.estimatedMinutes}m` : '—'}</p>
                            </div>
                        </div>
                        <JourneyInfoPanel route={route} />
                    </section>
                </aside>
            </div>
        </div>

    )
}

export default MetroMapStage;
