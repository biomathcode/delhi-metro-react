import { create } from 'zustand';

import type { CinematicZoomLevel, RouteSortMode } from '../types/route';

type SnapPoint = number | string | null;
type PlaySetter = boolean | ((currentPlay: boolean) => boolean);

interface PlannerUiState {
    play: boolean;
    animationMode: 'smooth' | 'step';
    cinematicZoom: CinematicZoomLevel;
    activeSnapPoint: SnapPoint;
    activeRouteStationId: string | null;
    selectedStationInfoId: string | null;
    routeFitRequest: number;
    routePreviewMode: boolean;
    routeSortMode: RouteSortMode;
    setPlay: (play: PlaySetter) => void;
    setAnimationMode: (animationMode: 'smooth' | 'step') => void;
    setCinematicZoom: (cinematicZoom: CinematicZoomLevel) => void;
    setActiveSnapPoint: (activeSnapPoint: SnapPoint) => void;
    setActiveRouteStationId: (stationId: string | null) => void;
    setSelectedStationInfoId: (stationId: string | null) => void;
    setRoutePreviewMode: (routePreviewMode: boolean) => void;
    setRouteSortMode: (routeSortMode: RouteSortMode) => void;
    requestRouteFit: () => void;
    clearRouteFocus: () => void;
}

export const usePlannerUi = create<PlannerUiState>((set) => ({
    play: false,
    animationMode: 'smooth',
    cinematicZoom: 2,
    activeSnapPoint: '220px',
    activeRouteStationId: null,
    selectedStationInfoId: null,
    routeFitRequest: 0,
    routePreviewMode: false,
    routeSortMode: 'interchanges',
    setPlay: (play) => set((state) => ({
        play: typeof play === 'function' ? play(state.play) : play,
    })),
    setAnimationMode: (animationMode) => set({ animationMode }),
    setCinematicZoom: (cinematicZoom) => set({ cinematicZoom }),
    setActiveSnapPoint: (activeSnapPoint) => set({ activeSnapPoint }),
    setActiveRouteStationId: (activeRouteStationId) => set({ activeRouteStationId }),
    setSelectedStationInfoId: (selectedStationInfoId) => set({ selectedStationInfoId }),
    setRoutePreviewMode: (routePreviewMode) => set({ routePreviewMode }),
    setRouteSortMode: (routeSortMode) => set({ routeSortMode }),
    requestRouteFit: () => set((state) => ({ routeFitRequest: state.routeFitRequest + 1 })),
    clearRouteFocus: () => set({ activeRouteStationId: null, selectedStationInfoId: null }),
}));
