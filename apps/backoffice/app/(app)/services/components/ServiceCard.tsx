'use client';

import type { Service } from '@repo/app-types';
import {
	Button,
	Input,
	Label,
	Switch,
	Textarea,
	useOutsideClick,
} from '@repo/ui';
import {
	AlignLeft,
	Bird,
	Bone,
	Cat,
	Clock,
	Dog,
	DollarSign,
	Egg,
	Fish,
	PawPrint,
	Rabbit,
	Rat,
	Squirrel,
	Trash2,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useRef, useState } from 'react';

const availableIcons = Object.entries({
	Bird,
	Bone,
	Cat,
	Dog,
	Egg,
	Fish,
	PawPrint,
	Rabbit,
	Rat,
	Squirrel,
}).map(([key, icon]) => ({ name: key, Icon: icon }));

interface ServiceCardProps {
	index: number;
	service: Service & { toUpdate?: boolean; toCreate?: boolean };
	updateService: (index: number, field: keyof Service, value: any) => void;
	deleteService: (index: number) => void;
}

export default function ServiceCard({
	index,
	service,
	updateService,
	deleteService,
}: ServiceCardProps) {
	const [menuOpen, setMenuOpen] = useState(false);

	const Icon = useMemo(() => {
		return (
			availableIcons.find((x) => x.name === service.icon)?.Icon ||
			PawPrint
		);
	}, [service.icon]);

	const iconMenuRef = useRef<HTMLDivElement>(null);

	useOutsideClick(iconMenuRef, () => {
		setMenuOpen(false);
	});

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			exit={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: service.toCreate ? 0 : index * 0.1 }}
			className={`relative bg-linear-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 ${
				!service.enabled ? 'opacity-60' : ''
			} ${service.toUpdate ? 'ring ring-primary' : ''}`}
		>
			<div className='p-6 space-y-6'>
				{/* Header */}
				<div className='flex items-center justify-between'>
					<div className='relative flex items-center gap-3'>
						<div ref={iconMenuRef}>
							<Button
								type='button'
								size='icon'
								className='p-6 rounded-xl bg-linear-to-br from-[#7f5539] to-[#5a3a26] text-white cursor-pointer'
								onClick={() => setMenuOpen((prev) => !prev)}
							>
								<Icon className='size-6' />
							</Button>

							<AnimatePresence>
								{menuOpen && (
									<motion.div
										key='menu-icon'
										initial={{
											opacity: 0,
											scale: 0.95,
											y: 8,
										}}
										animate={{ opacity: 1, scale: 1, y: 0 }}
										exit={{ opacity: 0, scale: 0.95, y: 8 }}
										transition={{
											duration: 0.2,
											ease: [0.25, 0.1, 0.25, 1],
										}}
										className='z-10 absolute top-6 left-6 grid grid-cols-4 gap-2 w-max p-4 border-gray-200 bg-white border rounded-lg shadow-lg'
									>
										{availableIcons.map(
											({ name, Icon: AvailableIcon }) => (
												<Button
													key={name}
													type='button'
													className='p-2 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer flex items-center justify-center size-auto'
													onClick={() => {
														updateService(
															service.id,
															'icon',
															name
														);
														setMenuOpen(false);
													}}
													size='icon'
												>
													<AvailableIcon className='size-8' />
												</Button>
											)
										)}
									</motion.div>
								)}
							</AnimatePresence>
						</div>

						<Input
							value={service.title}
							onChange={(e) =>
								updateService(
									service.id,
									'title',
									e.target.value
								)
							}
							autoComplete='off'
							required
							placeholder='Titre du service'
							className='text-xl! font-bold text-gray-900'
						/>
					</div>
					<div className='flex items-center gap-3'>
						<Label
							htmlFor={`enabled-${service.id}`}
							className='text-sm text-gray-600 cursor-pointer'
						>
							{service.enabled ? 'Activé' : 'Désactivé'}
						</Label>
						<Switch
							id={`enabled-${service.id}`}
							checked={service.enabled}
							onCheckedChange={(checked) =>
								updateService(service.id, 'enabled', checked)
							}
							className='data-[state=checked]:bg-[#7f5539]'
						/>

						<button
							type='button'
							className='flex items-center justify-center ml-2 p-2 rounded-lg hover:bg-red-400 text-red-500 hover:text-white transition-colors cursor-pointer'
							onClick={() => deleteService(service.id)}
							title='Supprimer le service'
							aria-label='Supprimer le service'
						>
							<Trash2 className='size-5' />
						</button>
					</div>
				</div>

				{/* Form fields */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<Label
							htmlFor={`price-${service.id}`}
							className='flex items-center gap-2 mb-2'
						>
							<DollarSign className='w-4 h-4 text-gray-500' />
							Prix
						</Label>
						<Input
							id={`price-${service.id}`}
							value={service.price}
							type='number'
							min={0}
							onChange={(e) =>
								updateService(
									service.id,
									'price',
									e.target.valueAsNumber
								)
							}
							placeholder='60€'
							autoComplete='off'
							className='border-gray-200 focus:border-[#7f5539] focus:ring-[#7f5539]/20'
							required
						/>
					</div>

					<div>
						<Label
							htmlFor={`duration-${service.id}`}
							className='flex items-center gap-2 mb-2'
						>
							<Clock className='w-4 h-4 text-gray-500' />
							Durée
						</Label>
						<Input
							id={`duration-${service.id}`}
							value={service.duration}
							onChange={(e) =>
								updateService(
									service.id,
									'duration',
									e.target.value
								)
							}
							placeholder='45-60 min'
							autoComplete='off'
							className='border-gray-200 focus:border-[#7f5539] focus:ring-[#7f5539]/20'
							required
						/>
					</div>
				</div>

				<div>
					<Label
						htmlFor={`description-${service.id}`}
						className='flex items-center gap-2 mb-2'
					>
						<AlignLeft className='w-4 h-4 text-gray-500' />
						Description
					</Label>
					<Textarea
						id={`description-${service.id}`}
						value={service.description}
						onChange={(e) =>
							updateService(
								service.id,
								'description',
								e.target.value
							)
						}
						rows={3}
						placeholder='Description du service...'
						className='border-gray-200 focus:border-[#7f5539] focus:ring-[#7f5539]/20 resize-none'
						required
					/>
				</div>
			</div>
		</motion.div>
	);
}
