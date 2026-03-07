'use client';

import type { Informations } from '@repo/app-types';
import { Button, Input, Label } from '@repo/ui';
import { Mail, MapPin, Phone, Radius } from 'lucide-react';
import { useActionState } from 'react';

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
	const [_error, action, pending] = useActionState(() => {}, null);

	return (
		<form
			action={action}
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
								disabled={pending}
								autoComplete={field.autComplete ?? 'off'}
								className='pl-4 transition-all duration-200 border-gray-200 focus:border-[#7f5539] focus:ring-[#7f5539]/20'
							/>
						</div>
					</div>
				))}
			</div>

			<div className='pt-4 border-t border-gray-200'>
				<Button
					type='submit'
					className='bg-linear-to-r from-[#7f5539] to-[#5a3a26] hover:shadow-lg hover:shadow-[#7f5539]/20 transition-all duration-200'
				>
					Enregistrer les modifications
				</Button>
			</div>
		</form>
	);
}
