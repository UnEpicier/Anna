'use client';

import type { Service } from '@repo/app-types';
import { Input, Label, Switch, Textarea } from '@repo/ui';
import { AlignLeft, Clock, Euro, Smile, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ServiceCardProps {
	index: number;
	service: Service & { toUpdate?: boolean; toCreate?: boolean };
	updateService: (id: number, field: keyof Service, value: any) => void;
	deleteService: (id: number) => void;
}

export default function ServiceCard({
	index,
	service,
	updateService,
	deleteService,
}: ServiceCardProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			exit={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: service.toCreate ? 0 : index * 0.06 }}
			className={`border bg-white transition-colors ${
				service.toUpdate ? 'border-primary' : 'border-border'
			} ${!service.enabled ? 'opacity-60' : ''}`}
		>
			{service.toUpdate && <div className='h-0.5 w-full bg-primary' />}

			<div className='p-6 space-y-5'>
				{/* Header */}
				<div className='flex items-center gap-4'>
					<span className='text-[9px] tracking-[2px] uppercase text-muted-foreground font-semibold shrink-0 w-6'>
						{String(index + 1).padStart(2, '0')}
					</span>
					<Input
						value={service.title}
						onChange={(e) =>
							updateService(service.id, 'title', e.target.value)
						}
						autoComplete='off'
						required
						placeholder='Titre du service'
						className='text-base! font-semibold flex-1'
					/>
					<div className='flex items-center gap-3 shrink-0'>
						<Label
							htmlFor={`enabled-${service.id}`}
							className='text-xs text-muted-foreground cursor-pointer'
						>
							{service.enabled ? 'Actif' : 'Inactif'}
						</Label>
						<Switch
							id={`enabled-${service.id}`}
							checked={service.enabled}
							onCheckedChange={(checked) =>
								updateService(service.id, 'enabled', checked)
							}
						/>
						<button
							type='button'
							onClick={() => deleteService(service.id)}
							aria-label='Supprimer le service'
							className='p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors'
						>
							<Trash2 className='w-4 h-4' />
						</button>
					</div>
				</div>

				{/* Emoji */}
				<div className='space-y-1.5'>
					<Label
						htmlFor={`emoji-${service.id}`}
						className='flex items-center gap-2 text-xs text-muted-foreground'
					>
						<Smile className='w-3.5 h-3.5' />
						Emoji
					</Label>
					<Input
						id={`emoji-${service.id}`}
						value={service.emoji}
						onChange={(e) =>
							updateService(service.id, 'emoji', e.target.value)
						}
						placeholder='🐾'
						autoComplete='off'
						required
					/>
				</div>

				{/* Price + Duration */}
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
					<div className='space-y-1.5'>
						<Label
							htmlFor={`price-${service.id}`}
							className='flex items-center gap-2 text-xs text-muted-foreground'
						>
							<Euro className='w-3.5 h-3.5' />
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
							placeholder='60'
							autoComplete='off'
							required
						/>
					</div>

					<div className='space-y-1.5'>
						<Label
							htmlFor={`duration-${service.id}`}
							className='flex items-center gap-2 text-xs text-muted-foreground'
						>
							<Clock className='w-3.5 h-3.5' />
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
							required
						/>
					</div>
				</div>

				{/* Short Description */}
				<div className='space-y-1.5'>
					<Label
						htmlFor={`shortDescription-${service.id}`}
						className='flex items-center gap-2 text-xs text-muted-foreground'
					>
						<AlignLeft className='w-3.5 h-3.5' />
						Description courte (landing page)
					</Label>
					<Input
						id={`shortDescription-${service.id}`}
						value={service.shortDescription}
						onChange={(e) =>
							updateService(
								service.id,
								'shortDescription',
								e.target.value
							)
						}
						placeholder="Courte description affichée sur la page d'accueil"
						autoComplete='off'
						required
					/>
				</div>

				{/* Description */}
				<div className='space-y-1.5'>
					<Label
						htmlFor={`description-${service.id}`}
						className='flex items-center gap-2 text-xs text-muted-foreground'
					>
						<AlignLeft className='w-3.5 h-3.5' />
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
						className='resize-none'
						required
					/>
				</div>
			</div>
		</motion.div>
	);
}
