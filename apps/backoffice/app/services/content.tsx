'use client';

import type { Service } from '@repo/app-types';
import { Button, Input, Label, Switch, Textarea } from '@repo/ui';
import {
	AlignLeft,
	Cat,
	Clock,
	Dog,
	DollarSign,
	Rabbit,
	Sparkles,
} from 'lucide-react';
import { motion } from 'motion/react';
import { type FormEvent, useCallback, useState } from 'react';

const animalIcons: Record<string, any> = {
	Chiens: Dog,
	Chats: Cat,
	NAC: Rabbit,
	Chevaux: Sparkles,
};

export default function ServicesContent({
	services: dbServices,
}: {
	services: Service[];
}) {
	const [services, setServices] = useState<Service[]>(dbServices);

	const onSubmit = useCallback((e: FormEvent) => {
		e.preventDefault();

		// Call API
	}, []);

	const updateService = useCallback(
		(index: number, field: keyof Service, value: any) => {
			const newServices = structuredClone(services);
			newServices[index] = {
				...newServices[index],
				[field]: value,
			} as Service;
			setServices(newServices);
		},
		[services]
	);

	return (
		<form
			onSubmit={onSubmit}
			className='space-y-6'
		>
			<div className='grid gap-6'>
				{services.map((service, index) => {
					const Icon = animalIcons[service.icon] || Dog;
					return (
						<motion.div
							key={service.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className={`relative overflow-hidden bg-linear-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ${
								!service.enabled ? 'opacity-60' : ''
							}`}
						>
							<div className='p-6 space-y-6'>
								{/* Header */}
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-3'>
										<div className='p-3 rounded-xl bg-linear-to-br from-[#7f5539] to-[#5a3a26] text-white'>
											<Icon className='w-5 h-5' />
										</div>
										<h3 className='text-xl font-bold text-gray-900'>
											{service.title}
										</h3>
									</div>
									<div className='flex items-center gap-3'>
										<Label
											htmlFor={`enabled-${service.id}`}
											className='text-sm text-gray-600 cursor-pointer'
										>
											{service.enabled
												? 'Activé'
												: 'Désactivé'}
										</Label>
										<Switch
											id={`enabled-${service.id}`}
											checked={service.enabled}
											onCheckedChange={(checked) =>
												updateService(
													index,
													'enabled',
													checked
												)
											}
											className='data-[state=checked]:bg-[#7f5539]'
										/>
									</div>
								</div>

								{/* Form fields */}
								<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
									<div>
										<Label
											htmlFor={`price-${index}`}
											className='flex items-center gap-2 mb-2'
										>
											<DollarSign className='w-4 h-4 text-gray-500' />
											Prix
										</Label>
										<Input
											id={`price-${index}`}
											value={service.price}
											onChange={(e) =>
												updateService(
													index,
													'price',
													e.target.value
												)
											}
											placeholder='60€'
											className='border-gray-200 focus:border-[#7f5539] focus:ring-[#7f5539]/20'
										/>
									</div>

									<div>
										<Label
											htmlFor={`duration-${index}`}
											className='flex items-center gap-2 mb-2'
										>
											<Clock className='w-4 h-4 text-gray-500' />
											Durée
										</Label>
										<Input
											id={`duration-${index}`}
											value={service.duration}
											onChange={(e) =>
												updateService(
													index,
													'duration',
													e.target.value
												)
											}
											placeholder='45-60 min'
											className='border-gray-200 focus:border-[#7f5539] focus:ring-[#7f5539]/20'
										/>
									</div>
								</div>

								<div>
									<Label
										htmlFor={`description-${index}`}
										className='flex items-center gap-2 mb-2'
									>
										<AlignLeft className='w-4 h-4 text-gray-500' />
										Description
									</Label>
									<Textarea
										id={`description-${index}`}
										value={service.description}
										onChange={(e) =>
											updateService(
												index,
												'description',
												e.target.value
											)
										}
										rows={3}
										placeholder='Description du service...'
										className='border-gray-200 focus:border-[#7f5539] focus:ring-[#7f5539]/20 resize-none'
									/>
								</div>
							</div>
						</motion.div>
					);
				})}
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
