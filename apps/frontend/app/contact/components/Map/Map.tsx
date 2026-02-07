'use client';

import DeckGL from '@deck.gl/react';
import MapGL, { ScaleControl } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import useLayers from '@/app/contact/components/Map/hooks/useLayers';
import { Department } from '@/utils/types';

export interface MapProps {
	departments?: Department[];
	radius?: number;
	longitude?: number;
	latitude?: number;
}

export default function Map({
	departments = [],
	radius = 30,
	longitude = -0.56667,
	latitude = 44.833328,
}: MapProps) {
	const layer = useLayers(departments, radius , longitude, latitude);
	
	return (
		<DeckGL
			initialViewState={{
				longitude: -0.56667,
				latitude: 44.833328,
				zoom: 8,
			}}
			controller
			useDevicePixels={false}
			layers={[layer]}>
			<MapGL
				mapStyle='mapbox://styles/unepicier/cmixlaj7k000c01se5zrz6p2h'
				mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
				logoPosition='bottom-right'
				style={{ width: '100%', height: '100%' }}
				preserveDrawingBuffer
				doubleClickZoom={false}
				attributionControl={false}
				reuseMaps>
				<ScaleControl
					position='bottom-left'
					style={{
						marginLeft: '20px',
					}}
				/>
			</MapGL>
		</DeckGL>
	);
}
