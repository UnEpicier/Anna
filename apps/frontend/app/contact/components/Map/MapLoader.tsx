import { MapPin } from 'lucide-react';

export default function MapLoader() {
	return (
		<div className='bg-linear-to-br from-gray-100 to-gray-50 rounded-3xl shadow-xl h-96 flex items-center justify-center'>
			<div className='text-center'>
				<MapPin className='h-12 w-12 text-primary mx-auto mb-4' />

				<p className='text-gray-600 mb-2 text-lg'>
					Chargement de la carte
				</p>
			</div>
		</div>
	);
}
