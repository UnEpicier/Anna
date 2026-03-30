import { IconLayer, ScatterplotLayer } from '@deck.gl/layers';
import { type LucideProps, MapPin } from 'lucide-react';
import { useMemo } from 'react';
import { renderToString } from 'react-dom/server';

export default function useLayers(
	radius?: number,
	longitude?: number,
	latitude?: number
) {
	return useMemo(() => {
		if (!radius || !longitude || !latitude) {
			return null;
		}

		const radiusLayer = new ScatterplotLayer({
			id: 'radius-layer',
			data: [
				{
					position: [longitude, latitude],
				},
			],
			getPosition: (d: any) => d.position,
			getRadius: radius * 1000, // Convert km to meters
			radiusUnits: 'meters',
			getFillColor: [196, 149, 106, 100],
			stroked: true,
			lineWidthUnits: 'pixels',
			getLineWidth: 2,
			getLineColor: [196, 149, 106, 200],
			filled: true,
			pickable: false,
		});

		const ICON_SIZE = 128;
		const icon = renderToString(
			(
				MapPin as unknown as {
					render: (
						props: LucideProps,
						ref: null
					) => React.ReactElement;
				}
			).render(
				{
					stroke: '#c4956a',
					strokeWidth: 1.5,
					fill: '#f5ebe0',
					width: ICON_SIZE,
					height: ICON_SIZE,
				},
				null
			)
		);

		const iconLayer = new IconLayer({
			id: 'icon-layer',
			data: [{ position: [longitude, latitude] }],
			getPosition: (d: { position: [number, number] }) => d.position,
			getIcon: () => ({
				url: svgToDataURL(icon),
				width: ICON_SIZE,
				height: ICON_SIZE,
				anchorY: ICON_SIZE,
			}),
			getSize: 40,
			sizeUnits: 'pixels',
			pickable: false,
		});

		return [iconLayer, radiusLayer];
	}, [radius, longitude, latitude]);
}

function svgToDataURL(svg: string) {
	return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
