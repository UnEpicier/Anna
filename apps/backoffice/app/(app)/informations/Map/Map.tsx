'use client';

import type { DeckProps } from '@deck.gl/core';
import { MapboxOverlay } from '@deck.gl/mapbox';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { bbox, circle } from '@turf/turf';
import {
	type Ref,
	useCallback,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import MapLibre, {
	FullscreenControl,
	GeolocateControl,
	type MapRef as MapLibreRef,
	NavigationControl,
	ScaleControl,
	useControl,
	type ViewStateChangeEvent,
} from 'react-map-gl/maplibre';
import useLayers from './hooks/useLayers';

function DeckGLOverlay(props: DeckProps) {
	const overlay = useControl<MapboxOverlay>(
		() => new MapboxOverlay({ interleaved: false, ...props })
	);
	overlay.setProps(props);
	return null;
}

export type MapRef = {
	getCoordinates: () => {
		longitude: number;
		latitude: number;
	};
};

export interface MapProps {
	radius?: number;
	longitude?: number;
	latitude?: number;
	ref: Ref<MapRef>;
}

export default function MapComponent({
	radius = 30,
	longitude = -0.56667,
	latitude = 44.833328,
	ref,
}: MapProps) {
	const mapRef = useRef<MapLibreRef>(null);

	const [isLoading, setIsLoading] = useState(true);
	const [longitudeInput, setLongitudeInput] = useState(longitude);
	const [latitudeInput, setLatitudeInput] = useState(latitude);

	const onMapLoad = useCallback(() => {
		const map = mapRef.current;
		if (!map) return;

		const circleBbox = circle([longitude, latitude], radius, {
			units: 'kilometers',
		});

		const bboxResult = bbox(circleBbox) as [number, number, number, number];

		map.fitBounds(bboxResult, { padding: 40, duration: 800 });

		setTimeout(() => {
			setIsLoading(false);
		}, 800);
	}, [longitude, latitude, radius]);

	const onViewportChange = useCallback(
		(ev: ViewStateChangeEvent) => {
			if (isLoading) return;

			setLongitudeInput(ev.viewState.longitude);
			setLatitudeInput(ev.viewState.latitude);
		},
		[isLoading]
	);

	useImperativeHandle(ref, () => ({
		getCoordinates: () => ({
			longitude: longitudeInput,
			latitude: latitudeInput,
		}),
	}));

	const layer = useLayers(radius, longitudeInput, latitudeInput);

	return (
		<MapLibre
			ref={mapRef}
			cooperativeGestures
			onLoad={onMapLoad}
			initialViewState={{
				longitude: 1.7191036,
				latitude: 46.71109,
				zoom: 5,
			}}
			onMove={onViewportChange}
			maxBounds={[
				-20.2696443271, 35.691171142, 25.8949064542, 58.5957166429,
			]}
			mapStyle={`https://api.maptiler.com/maps/019c900c-33c6-7117-9201-72b30eef182b/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}&language=fr`}
		>
			<DeckGLOverlay
				controller={false}
				layers={[layer]}
			/>

			<NavigationControl />
			<GeolocateControl />
			<FullscreenControl />

			<ScaleControl position='bottom-right' />
		</MapLibre>
	);
}
