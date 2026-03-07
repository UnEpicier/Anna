'use client';

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
import { useActionState } from 'react';

export default function Page() {
	const [_error, action, _pending] = useActionState(() => {}, null);

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
						action={action}
						className='space-y-4'
					>
						<div>
							<Label htmlFor='password'>Mot de passe</Label>
							<Input
								id='password'
								name='password'
								type='password'
								placeholder='Entrez le mot de passe'
								className='mt-1'
								required
							/>
						</div>
						<Button
							type='submit'
							className='w-full bg-primary hover:bg-primary/90'
						>
							Se connecter
						</Button>
						<p className='text-sm text-gray-500 text-center mt-4'>
							Mot de passe par défaut : admin123
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
