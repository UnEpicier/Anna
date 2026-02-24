'use client';

import Map, {
	FullscreenControl,
	GeolocateControl,
	MapRef,
	NavigationControl,
	ScaleControl,
	useControl,
} from 'react-map-gl/maplibre';
import useLayers from '@/app/contact/components/Map/hooks/useLayers';
import type { Department } from '@repo/app-types';
import type { DeckProps } from '@deck.gl/core';
import { MapboxOverlay } from '@deck.gl/mapbox';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { useCallback, useRef } from 'react';
import { circle, bbox, feature, featureCollection } from '@turf/turf';

function DeckGLOverlay(props: DeckProps) {
	const overlay = useControl<MapboxOverlay>(
		() => new MapboxOverlay({ interleaved: false, ...props }),
	);
	overlay.setProps(props);
	return null;
}

export interface MapProps {
	departments?: Department[];
	radius?: number;
	longitude?: number;
	latitude?: number;
}

export default function MapComponent({
	departments = [],
	radius = 30,
	longitude = -0.56667,
	latitude = 44.833328,
}: MapProps) {
	const mapRef = useRef<MapRef>(null);

	const onMapLoad = useCallback(() => {
		const map = mapRef.current;
		if (!map) return;

		let bboxResult: [number, number, number, number];

		if (departments.length > 0) {
			// bbox englobant tous les départements
			const collection = featureCollection(
				departments.map((d) => feature(d.geojson.geometry as never)), // adapte selon ta structure
			);
			bboxResult = bbox(collection) as [number, number, number, number];
		} else {
			// cercle autour du point (radius en km)
			const circleBbox = circle([longitude, latitude], radius, {
				units: 'kilometers',
			});
			bboxResult = bbox(circleBbox) as [number, number, number, number];
		}

		map.fitBounds(bboxResult, { padding: 40, duration: 800 });
	}, [departments, longitude, latitude, radius]);

	const layer = useLayers(departments, radius, longitude, latitude);

	return (
		<Map
			ref={mapRef}
			reuseMaps
			onLoad={onMapLoad}
			initialViewState={{
				longitude: 1.7191036,
				latitude: 46.71109,
				zoom: 5,
			}}
			maxBounds={[
				-20.2696443271, 35.691171142, 25.8949064542, 58.5957166429,
			]}
			mapStyle={`https://api.maptiler.com/maps/019c900c-33c6-7117-9201-72b30eef182b/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_API_KEY}&language=fr`}>
			<DeckGLOverlay
				controller={false}
				layers={[layer]}
			/>

			<NavigationControl />
			<GeolocateControl />
			<FullscreenControl />

			<ScaleControl position='bottom-right' />
		</Map>
	);
}
