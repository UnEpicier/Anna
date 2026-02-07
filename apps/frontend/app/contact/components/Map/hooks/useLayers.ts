import { useMemo } from 'react';
import { GeoJsonLayer, ScatterplotLayer } from '@deck.gl/layers';
import { Department } from '@/utils/types';

export default function useLayers(
	departments: Department[] = [],
	radius?: number,
	longitude?: number,
	latitude?: number,
) {
	return useMemo(() => {
		if (departments.length === 0) {
			const formattedDepartments = departments.map(
				(dept) => dept.geojson,
			);

			return new GeoJsonLayer({
				id: 'departments-layer',
				data: {
					type: 'FeatureCollection',
					features: formattedDepartments as never[],
				},
				getFillColor: [127, 85, 57, 100],
				getLineWidth: 2,
				getLineColor: [127, 85, 57, 200],
				lineWidthUnits: 'pixels',
				filled: true,
				stroked: true,
				pickable: false,
			});
		}

		if (!radius || !longitude || !latitude) {
			return null;
		}

		return new ScatterplotLayer({
			id: 'radius-layer',
			data: [
				{
					position: [longitude, latitude],
				},
			],
			getPosition: (d: any) => d.position,
			getRadius: radius * 1000, // Convert km to meters
			radiusUnits: 'meters',
			getFillColor: [127, 85, 57, 100],
			stroked: true,
			lineWidthUnits: 'pixels',
			getLineWidth: 2,
			getLineColor: [127, 85, 57, 200],
			filled: true,
			pickable: false,
		});
	}, [radius, longitude, latitude, departments]);
}
