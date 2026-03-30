'use client';

import type { Informations } from '@repo/app-types';
import { Button, Input, Label } from '@repo/ui';
import { LoaderCircle, Mail, MapPin, Phone, Radius } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Suspense, useCallback, useRef, useState } from 'react';
import type React from 'react';
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

	const onRadiusChange = useCallback(
		(ev: React.FormEvent<HTMLInputElement>) => {
			setActionRadius(Number(ev.currentTarget.value));
		},
		[]
	);

	const onSubmit = useCallback(
		async (ev: React.FormEvent<HTMLFormElement>) => {
			ev.preventDefault();
			const formData = new FormData(ev.currentTarget);
			setIsPending(true);

			const body: Record<string, unknown> = {};
			for (const [key, value] of formData.entries()) {
				body[key] = key === 'actionRadius' ? Number(value) : value;
			}

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
		},
		[]
	);

	return (
		<form
			onSubmit={onSubmit}
			className='space-y-6'
		>
			{/* Contact fields */}
			<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
				{fields.map((field) => (
					<div
						key={field.id}
						className='space-y-1.5'
					>
						<Label
							htmlFor={field.id}
							className='flex items-center gap-2 text-xs text-muted-foreground'
						>
							<field.icon className='w-3.5 h-3.5' />
							{field.label}
						</Label>
						<Input
							id={field.id}
							name={field.id}
							defaultValue={`${data[field.id as keyof Informations]}`}
							type={field.type ?? 'text'}
							placeholder={field.placeholder}
							disabled={isPending}
							required
							autoComplete={field.autComplete ?? 'off'}
						/>
					</div>
				))}
			</div>

			<div className='pt-2 border-t border-border'>
				<Button
					type='submit'
					disabled={isPending}
					className='bg-primary hover:bg-primary/85 text-white'
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

			{/* Action radius section */}
			<div className='pt-4'>
				<div className='flex items-center gap-3 mb-3'>
					<span className='w-4 h-px bg-primary/60' />
					<span className='text-[9px] tracking-[2px] uppercase text-primary/80 font-semibold'>
						Rayon d&apos;action
					</span>
				</div>

				<p className='text-sm text-muted-foreground mb-5 leading-relaxed'>
					Le rayon d&apos;action montre la zone théorique de
					déplacement. Si des{' '}
					<Link
						href='/departments'
						className='text-primary underline'
					>
						départements
					</Link>{' '}
					sont sélectionnés, la{' '}
					<Link
						href='https://anna-nischwitz.fr/contact'
						className='text-primary underline'
					>
						carte
					</Link>{' '}
					préférera les afficher plutôt que le rayon d&apos;action.
					<br />
					Le &ldquo;Lieu d&apos;action&rdquo; est utilisé pour
					afficher la phrase &ldquo;[rayon]km autour de [lieu
					d&apos;action]&rdquo;{' '}
					<Link
						href='https://anna-nischwitz.fr/contact'
						className='text-primary underline'
					>
						sur le formulaire de contact
					</Link>
					.
				</p>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-5 mb-5'>
					<div className='space-y-1.5'>
						<Label
							htmlFor='actionRadius'
							className='flex items-center gap-2 text-xs text-muted-foreground'
						>
							<Radius className='w-3.5 h-3.5' />
							Rayon d&apos;action (km)
						</Label>
						<Input
							id='actionRadius'
							name='actionRadius'
							value={actionRadius}
							onChange={onRadiusChange}
							type='number'
							placeholder='30'
							disabled={isPending}
							required
							autoComplete='off'
						/>
					</div>
					<div className='space-y-1.5'>
						<Label
							htmlFor='actionAddress'
							className='flex items-center gap-2 text-xs text-muted-foreground'
						>
							<MapPin className='w-3.5 h-3.5' />
							Lieu d&apos;action
						</Label>
						<Input
							id='actionAddress'
							name='actionAddress'
							defaultValue={`${data.actionAddress}`}
							type='text'
							placeholder='Bordeaux'
							disabled={isPending}
							required
							autoComplete='off'
						/>
					</div>
				</div>

				<div className='relative h-[500px] overflow-hidden border border-border mb-6'>
					<Suspense fallback={<MapLoader />}>
						<MapComponent
							ref={mapRef}
							latitude={data.actionLat}
							longitude={data.actionLong}
							radius={actionRadius}
						/>
					</Suspense>
				</div>

				<Button
					type='submit'
					disabled={isPending}
					className='bg-primary hover:bg-primary/85 text-white'
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
