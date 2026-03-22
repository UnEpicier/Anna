'use client';

import type { ResponseObject } from '@repo/app-types';
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Input,
	Label,
} from '@repo/ui';
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type SubmitEvent, useCallback } from 'react';
import { toast } from 'sonner';

export default function Page() {
	const router = useRouter();

	const onSubmit = useCallback(
		async (ev: SubmitEvent<HTMLFormElement>) => {
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
					body: JSON.stringify({
						email,
					}),
				});

				const data: ResponseObject<null> = await request.json();

				if (data.success) {
					router.push('/auth/verify-code');
					return;
				}

				if (data.statusCode === 500) {
					throw new Error(data.message);
				}

				toast.error('Adresse e-mail invalide');
				return;
			} catch (error) {
				console.error(error);
				toast.error('Impossible de se connecter pour le moment');
			}
		},
		[router]
	);

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 px-4'>
			<Card className='w-full max-w-md'>
				<CardHeader className='space-y-2 text-center'>
					<div className='mx-auto w-12 h-12 bg-primary rounded-full flex items-center justify-center mb-4'>
						<Lock className='h-6 w-6 text-white' />
					</div>
					<CardTitle className='text-2xl'>Accès Admin</CardTitle>
					<p className='text-gray-600'>
						Connectez-vous pour accéder au dashboard
					</p>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={onSubmit}
						className='space-y-4'
					>
						<div>
							<Label htmlFor='email'>Adresse e-mail</Label>
							<Input
								id='email'
								name='email'
								type='email'
								placeholder="Entrez l'adresse email"
								className='mt-1'
								autoComplete='email'
								required
							/>
						</div>
						<Button
							type='submit'
							className='w-full bg-primary hover:bg-primary/90'
						>
							Se connecter
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
