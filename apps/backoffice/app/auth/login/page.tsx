'use client';

import type { ResponseObject } from '@repo/app-types';
import { Button, Input, Label } from '@repo/ui';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import type React from 'react';
import { toast } from 'sonner';

export default function Page() {
	const router = useRouter();

	const onSubmit = useCallback(
		async (ev: React.FormEvent<HTMLFormElement>) => {
			ev.preventDefault();

			const formData = new FormData(ev.currentTarget);
			const email = formData.get('email');

			if (!email || !email.toString().trim()) {
				toast.error('Adresse e-mail invalide');
				return;
			}

			try {
				const request = await fetch('/api/auth/login', {
					method: 'POST',
					body: JSON.stringify({ email }),
				});

				const data: ResponseObject<null> = await request.json();

				if (data.success) {
					router.push('/auth/verify-code');
					return;
				}

				if (data.statusCode === 500) throw new Error(data.message);

				toast.error('Adresse e-mail invalide');
			} catch (error) {
				console.error(error);
				toast.error('Impossible de se connecter pour le moment');
			}
		},
		[router]
	);

	return (
		<div className='min-h-screen flex items-center justify-center bg-[#f7f6f4] px-4'>
			<div className='w-full max-w-sm border border-border bg-white p-8'>
				<div className='text-center mb-8'>
					<div className='w-10 h-10 bg-primary flex items-center justify-center mx-auto mb-5'>
						<Lock className='h-4 w-4 text-white' />
					</div>
					<div className='flex items-center justify-center gap-3 mb-1'>
						<span className='w-4 h-px bg-primary/60' />
						<span className='text-[9px] tracking-[2px] uppercase text-primary/80 font-semibold'>
							Accès Admin
						</span>
						<span className='w-4 h-px bg-primary/60' />
					</div>
					<h1 className='text-xl font-black text-foreground tracking-tight'>
						Connexion
					</h1>
					<p className='text-sm text-muted-foreground mt-1'>
						Connectez-vous pour accéder au dashboard
					</p>
				</div>

				<form onSubmit={onSubmit} className='space-y-4'>
					<div className='space-y-1.5'>
						<Label htmlFor='email' className='text-xs text-muted-foreground'>
							Adresse e-mail
						</Label>
						<Input
							id='email'
							name='email'
							type='email'
							placeholder="Entrez l'adresse email"
							autoComplete='email'
							required
						/>
					</div>
					<Button type='submit' className='w-full bg-primary hover:bg-primary/85 text-white'>
						Se connecter
					</Button>
				</form>
			</div>
		</div>
	);
}
