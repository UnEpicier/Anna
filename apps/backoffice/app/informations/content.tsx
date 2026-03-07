'use client';

import type { Informations } from '@repo/app-types';
import { Button, Input, Label } from '@repo/ui';
import { LoaderCircle, Mail, MapPin, Phone, Radius } from 'lucide-react';
import { type FormEvent, useCallback, useState } from 'react';

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
		label: 'Ville',
		icon: MapPin,
		type: 'text',
		autComplete: 'street-address',
		placeholder: 'Paris',
	},
	{
		id: 'actionRadius',
		label: "Rayon d'intervention",
		icon: Radius,
		type: 'number',
		autComplete: 'off',
		placeholder: '30km',
	},
];

export default function ContactContent({
	data,
}: {
	data: Informations | null;
}) {
	const [isPending, setIsPending] = useState<boolean>(false);
	const [message, setMessage] = useState<{
		type: 'success' | 'error';
		text: string;
	} | null>(null);

	const onSubmit = useCallback(async (ev: FormEvent<HTMLFormElement>) => {
		ev.preventDefault();
		const formData = new FormData(ev.currentTarget);

		setIsPending(true);
		setMessage(null);

		try {
			const body: Record<string, any> = {};

			for (const [key, value] of formData.entries()) {
				if (key === 'actionRadius') {
					body[key] = Number(value);
					continue;
				}

				body[key] = value;
			}

			const res = await fetch('/api/informations', {
				method: 'PUT',
				body: JSON.stringify(body),
			});

			if (res.ok) {
				setMessage({
					type: 'success',
					text: 'Informations mises à jour avec succès',
				});
				return;
			}

			setMessage({
				type: 'error',
				text: 'Impossible de sauvegarder les modifications',
			});
		} catch (error) {
			console.error(error);
			setMessage({
				type: 'error',
				text: 'Impossible de sauvegarder les modifications',
			});
		} finally {
			setIsPending(false);
		}
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
									data
										? data[field.id as keyof Informations]
										: ''
								}`}
								type={field.type ?? 'text'}
								placeholder={field.placeholder}
								disabled={isPending}
								autoComplete={field.autComplete ?? 'off'}
								className='pl-4 transition-all duration-200 border-gray-200 focus:border-[#7f5539] focus:ring-[#7f5539]/20'
							/>
						</div>
					</div>
				))}
			</div>

			<div className='pt-4 border-t border-gray-200'>
				{message && (
					<p
						className={`text-sm mb-4 ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}
					>
						{message.text}
					</p>
				)}

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
	// TODO: Add /leave management here
}
