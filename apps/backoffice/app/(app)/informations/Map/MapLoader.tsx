import { MapPin } from 'lucide-react';

export default function MapLoader() {
	return (
		<div className='bg-muted/30 border border-border h-full flex items-center justify-center'>
			<div className='text-center'>
				<MapPin className='h-8 w-8 text-primary mx-auto mb-3' />
				<p className='text-sm text-muted-foreground'>
					Chargement de la carte
				</p>
			</div>
		</div>
	);
}
