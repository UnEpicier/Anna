'use client';

import type { PopupMessage } from '@repo/app-types';
import { Button, Input, Label, Switch, Textarea } from '@repo/ui';
import { LoaderCircle, Megaphone } from 'lucide-react';
import { useCallback, useState } from 'react';
import type React from 'react';
import { toast } from 'sonner';

export default function AnnouncementContent({
	data,
}: {
	data: PopupMessage;
}) {
	const [isPending, setIsPending] = useState(false);
	const [enabled, setEnabled] = useState(data.enabled);

	const onSubmit = useCallback(
		async (ev: React.FormEvent<HTMLFormElement>) => {
			ev.preventDefault();
			const formData = new FormData(ev.currentTarget);

			const ctaLabel = (formData.get('ctaLabel') as string) || null;
			const ctaUrl = (formData.get('ctaUrl') as string) || null;

			if ((ctaLabel && !ctaUrl) || (!ctaLabel && ctaUrl)) {
				toast.error(
					'Le libellé et l\u2019URL du bouton doivent être renseignés ensemble.'
				);
				return;
			}

			const body = {
				enabled,
				title: (formData.get('title') as string) || null,
				message: formData.get('message') as string,
				ctaLabel,
				ctaUrl,
			};

			setIsPending(true);

			const promise = fetch('/api/popup-message', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			});

			await toast
				.promise(promise, {
					loading: 'Enregistrement en cours...',
					success: 'Annonce mise à jour avec succès',
					error: 'Impossible de sauvegarder les modifications',
				})
				.unwrap();

			setIsPending(false);
		},
		[enabled]
	);

	return (
		<form onSubmit={onSubmit} className='space-y-6'>
			{/* Header */}
			<div>
				<div className='flex items-center gap-3 mb-1'>
					<span className='w-4 h-px bg-primary/60' />
					<span className='text-[9px] tracking-[2px] uppercase text-primary/80 font-semibold'>
						Message d&apos;annonce
					</span>
				</div>
				<h1 className='text-2xl font-black text-foreground tracking-tight'>
					Annonce
				</h1>
			</div>

			{/* Enabled toggle */}
			<div className='flex items-center gap-3'>
				<Switch
					id='enabled'
					checked={enabled}
					onCheckedChange={setEnabled}
					disabled={isPending}
				/>
				<Label
					htmlFor='enabled'
					className='text-sm text-muted-foreground cursor-pointer'
				>
					{enabled ? 'Annonce active' : 'Annonce désactivée'}
				</Label>
			</div>

			{/* Title */}
			<div className='space-y-1.5'>
				<Label
					htmlFor='title'
					className='flex items-center gap-2 text-xs text-muted-foreground'
				>
					<Megaphone className='w-3.5 h-3.5' />
					Titre{' '}
					<span className='text-muted-foreground/50'>
						(optionnel — défaut : &ldquo;Annonce&rdquo;)
					</span>
				</Label>
				<Input
					id='title'
					name='title'
					defaultValue={data.title ?? ''}
					type='text'
					placeholder='Annonce'
					disabled={isPending}
					autoComplete='off'
				/>
			</div>

			{/* Message */}
			<div className='space-y-1.5'>
				<Label
					htmlFor='message'
					className='flex items-center gap-2 text-xs text-muted-foreground'
				>
					Message
				</Label>
				<Textarea
					id='message'
					name='message'
					defaultValue={data.message}
					placeholder='Votre message...'
					disabled={isPending}
					required
					rows={4}
				/>
			</div>

			{/* CTA */}
			<div className='pt-2 border-t border-border'>
				<div className='flex items-center gap-3 mb-3'>
					<span className='w-4 h-px bg-primary/60' />
					<span className='text-[9px] tracking-[2px] uppercase text-primary/80 font-semibold'>
						Bouton d&apos;action{' '}
						<span className='normal-case tracking-normal font-normal text-muted-foreground/50'>
							(optionnel)
						</span>
					</span>
				</div>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
					<div className='space-y-1.5'>
						<Label
							htmlFor='ctaLabel'
							className='text-xs text-muted-foreground'
						>
							Libellé du bouton
						</Label>
						<Input
							id='ctaLabel'
							name='ctaLabel'
							defaultValue={data.ctaLabel ?? ''}
							type='text'
							placeholder='En savoir plus'
							disabled={isPending}
							autoComplete='off'
						/>
					</div>
					<div className='space-y-1.5'>
						<Label
							htmlFor='ctaUrl'
							className='text-xs text-muted-foreground'
						>
							URL du bouton
						</Label>
						<Input
							id='ctaUrl'
							name='ctaUrl'
							defaultValue={data.ctaUrl ?? ''}
							type='url'
							placeholder='https://...'
							disabled={isPending}
							autoComplete='off'
						/>
					</div>
				</div>
			</div>

			{/* Submit */}
			<div className='pt-2'>
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
