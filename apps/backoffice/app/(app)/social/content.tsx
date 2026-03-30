'use client';

import { SiFacebook, SiInstagram } from '@icons-pack/react-simple-icons';
import { Button, Input, Label } from '@repo/ui';
import { Info, LoaderCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
import type React from 'react';
import { toast } from 'sonner';

export default function SocialContent({
	socials,
}: {
	socials: { facebook: string; instagram: string };
}) {
	const [isPending, setIsPending] = useState(false);

	const validateSocialUrl = useCallback(
		(url: string, domain: string): boolean => {
			if (!url) return true;
			try {
				const parsed = new URL(url);
				return (
					parsed.protocol === 'https:' &&
					(parsed.hostname === domain ||
						parsed.hostname === `www.${domain}`)
				);
			} catch {
				return false;
			}
		},
		[]
	);

	const onSubmit = useCallback(
		async (ev: React.FormEvent<HTMLFormElement>) => {
			ev.preventDefault();
			const formData = new FormData(ev.currentTarget);
			const body = {
				facebook: (formData.get('facebook') as string).toString(),
				instagram: (formData.get('instagram') as string).toString(),
			};

			if (!validateSocialUrl(body.facebook, 'facebook.com')) {
				toast.error(
					'URL Facebook invalide. Elle doit commencer par https://facebook.com ou https://www.facebook.com'
				);
				return;
			}
			if (!validateSocialUrl(body.instagram, 'instagram.com')) {
				toast.error(
					'URL Instagram invalide. Elle doit commencer par https://instagram.com ou https://www.instagram.com'
				);
				return;
			}

			setIsPending(true);

			const promise = fetch('/api/informations', {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			});

			await toast
				.promise(promise, {
					loading: 'Enregistrement en cours...',
					success: 'Informations mises à jour avec succès !',
					error: 'Une erreur est survenue lors de la mise à jour.',
				})
				.unwrap();

			setIsPending(false);
		},
		[validateSocialUrl]
	);

	return (
		<form
			onSubmit={onSubmit}
			className='space-y-6'
		>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
				{/* Facebook */}
				<div className='border border-border p-5'>
					<div className='h-1 w-full bg-sky-500 -mt-5 -mx-5 mb-5 w-[calc(100%+2.5rem)]' />
					<Label
						htmlFor='facebook'
						className='flex items-center gap-3 mb-4 cursor-pointer'
					>
						<div className='w-9 h-9 bg-sky-500 flex items-center justify-center shrink-0'>
							<SiFacebook className='w-4 h-4 text-white' />
						</div>
						<span className='text-sm font-semibold text-foreground'>
							Facebook
						</span>
					</Label>
					<Input
						id='facebook'
						name='facebook'
						type='url'
						defaultValue={socials.facebook}
						placeholder='https://www.facebook.com/votreprofil'
						disabled={isPending}
					/>
				</div>

				{/* Instagram */}
				<div className='border border-border p-5'>
					<div className='h-1 w-full bg-pink-500 -mt-5 -mx-5 mb-5 w-[calc(100%+2.5rem)]' />
					<Label
						htmlFor='instagram'
						className='flex items-center gap-3 mb-4 cursor-pointer'
					>
						<div className='w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shrink-0'>
							<SiInstagram className='w-4 h-4 text-white' />
						</div>
						<span className='text-sm font-semibold text-foreground'>
							Instagram
						</span>
					</Label>
					<Input
						id='instagram'
						name='instagram'
						type='url'
						defaultValue={socials.instagram}
						placeholder='https://www.instagram.com/votreprofil'
						disabled={isPending}
					/>
				</div>
			</div>

			{/* Info */}
			<div className='border border-sky-200 bg-sky-50 p-4 flex gap-3'>
				<Info className='w-4 h-4 text-sky-600 shrink-0 mt-0.5' />
				<p className='text-sm text-sky-900'>
					Entrez l&apos;URL complète de votre profil (commençant par
					https://). Laissez le champ vide si vous n&apos;avez pas de
					compte.
				</p>
			</div>

			{/* Submit */}
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
		</form>
	);
}
