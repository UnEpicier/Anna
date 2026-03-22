'use client';

import type { Informations } from '@repo/app-types';
import { Button, Input, Label } from '@repo/ui';
import { LoaderCircle, Mail, MapPin, Phone, Radius } from 'lucide-react';
import { motion } from 'motion/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { type FormEvent, Suspense, useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { MapRef } from './Map/Map';
import MapLoader from './Map/MapLoader';

const MapComponent = dynamic(() => import('./Map/Map'));

const fields = [
	{
		id: 'phone',
		label: 'Téléphone',
		icon: Phone,
		type: 'tel',
		autComplete: 'tel',
		placeholder: '06 XX XX XX XX',
	},
	{
		id: 'email',
		label: 'Email',
		icon: Mail,
		type: 'email',
		autComplete: 'email',
		placeholder: 'contact@exemple.fr',
	},
	{
		id: 'address',
		label: 'Adresse',
		icon: MapPin,
		type: 'text',
		autComplete: 'street-address',
		placeholder: 'Paris',
	},
];

export default function ContactContent({ data }: { data: Informations }) {
	const mapRef = useRef<MapRef>(null);

	const [isPending, setIsPending] = useState<boolean>(false);
	const [actionRadius, setActionRadius] = useState<number>(data.actionRadius);

	const onRadiusChange = useCallback((ev: FormEvent<HTMLInputElement>) => {
		const value = Number(ev.currentTarget.value);
		setActionRadius(value);
	}, []);

	const onSubmit = useCallback(async (ev: FormEvent<HTMLFormElement>) => {
		ev.preventDefault();
		const formData = new FormData(ev.currentTarget);

		setIsPending(true);

		const body: Record<string, any> = {};

		for (const [key, value] of formData.entries()) {
			if (key === 'actionRadius') {
				body[key] = Number(value);
				continue;
			}

			body[key] = value;
		}

		// Add longitude and latitude from the map component
		if (mapRef.current && formData.has('actionAddress')) {
			const coordinates = mapRef.current.getCoordinates();
			body.actionLong = coordinates.longitude;
			body.actionLat = coordinates.latitude;
		}

		const promise = fetch('/api/informations', {
			method: 'PUT',
			body: JSON.stringify(body),
		});

		await toast
			.promise(promise, {
				loading: 'Enregistrement en cours...',
				success: 'Informations mises à jour avec succès',
				error: 'Impossible de sauvegarder les modifications',
			})
			.unwrap();

		setIsPending(false);
	}, []);

	return (
		<form
			onSubmit={onSubmit}
			className='space-y-6'
		>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				{fields.map((field) => (
					<div
						key={field.id}
						className='group'
					>
						<Label
							htmlFor={field.id}
							className='flex items-center gap-2 text-gray-700 mb-2'
						>
							<field.icon className='w-4 h-4 text-gray-500' />
							{field.label}
						</Label>
						<div className='relative'>
							<Input
								id={field.id}
								name={field.id}
								defaultValue={`${
									data[field.id as keyof Informations]
								}`}
								type={field.type ?? 'text'}
								placeholder={field.placeholder}
								disabled={isPending}
								required
								autoComplete={field.autComplete ?? 'off'}
								className='pl-4 transition-all duration-200 border-gray-200 focus:border-[#7f5539] focus:ring-[#7f5539]/20'
							/>
						</div>
					</div>
				))}
			</div>

			<div>
				<Button
					type='submit'
					disabled={isPending}
					className='bg-linear-to-r from-[#7f5539] to-[#5a3a26] hover:shadow-lg hover:shadow-[#7f5539]/20 transition-all duration-200'
				>
					{isPending ? (
						<>
							<LoaderCircle className='animate-spin' />
							Enregistrement...
						</>
					) : (
						'Enregistrer les modifications'
					)}
				</Button>
			</div>

			<hr className='my-8 border-t border-gray-200' />

			<h2 className='text-xl font-semibold mb-4'>Rayon d&apos;action</h2>

			<p className='mb-4 text-gray-600'>
				Le rayon d&apos;action montre la zone théorique de déplacement.
				Si des{' '}
				<Link
					href='/departments'
					className='text-blue-600 underline'
				>
					départements
				</Link>{' '}
				sont sélectionnés, la{' '}
				<Link
					href='https://anna-nischwitz.fr/contact'
					className='text-blue-600 underline'
				>
					carte
				</Link>{' '}
				préféreras les afficher plutôt que le rayon d&apos;action.
				<br />
				<br />
				Le "Lieu d&apos;action" est utilisé pour afficher à côté du{' '}
				<Link
					href='https://anna-nischwitz.fr/contact'
					className='text-blue-600 underline'
				>
					formulaire de contact
				</Link>{' '}
				la phrase "[rayon]km autour de [lieu d'action]".
			</p>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-6'>
				<div className='group'>
					<Label
						htmlFor='actionRadius'
						className='flex items-center gap-2 text-gray-700 mb-2'
					>
						<Radius className='w-4 h-4 text-gray-500' />
						Rayon d&apos;action
					</Label>
					<div className='relative'>
						<Input
							id='actionRadius'
							name='actionRadius'
							value={actionRadius}
							onChange={onRadiusChange}
							type='number'
							placeholder='30km'
							disabled={isPending}
							required
							autoComplete='off'
							className='pl-4 transition-all duration-200 border-gray-200 focus:border-[#7f5539] focus:ring-[#7f5539]/20'
						/>
					</div>
				</div>

				<div className='group'>
					<Label
						htmlFor='actionAddress'
						className='flex items-center gap-2 text-gray-700 mb-2'
					>
						<MapPin className='w-4 h-4 text-gray-500' />
						Lieu d&apos;action
					</Label>
					<div className='relative'>
						<Input
							id='actionAddress'
							name='actionAddress'
							defaultValue={`${data.actionAddress}`}
							type='text'
							placeholder='Bordeaux'
							disabled={isPending}
							required
							autoComplete='off'
							className='pl-4 transition-all duration-200 border-gray-200 focus:border-[#7f5539] focus:ring-[#7f5539]/20'
						/>
					</div>
				</div>
			</div>

			<motion.div
				initial={{ opacity: 0, scale: 0.95 }}
				whileInView={{ opacity: 1, scale: 1 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
				className='relative h-150 rounded-xl shadow-lg overflow-hidden mb-8'
			>
				<Suspense fallback={<MapLoader />}>
					<MapComponent
						ref={mapRef}
						latitude={data.actionLat}
						longitude={data.actionLong}
						radius={actionRadius}
					/>
				</Suspense>
			</motion.div>

			<div>
				<Button
					type='submit'
					disabled={isPending}
					className='bg-linear-to-r from-[#7f5539] to-[#5a3a26] hover:shadow-lg hover:shadow-[#7f5539]/20 transition-all duration-200'
				>
					{isPending ? (
						<>
							<LoaderCircle className='animate-spin' />
							Enregistrement...
						</>
					) : (
						'Enregistrer les modifications'
					)}
				</Button>
			</div>
		</form>
	);
}
