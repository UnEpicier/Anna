import Link from 'next/link';
import { Button } from '../../../packages/ui/src/components';

export default function NotFound() {
	return (
		<div className='flex min-h-screen flex-col items-center justify-center bg-white px-6 py-24 sm:py-32 lg:px-8'>
			<div className='text-center'>
				<h1 className='text-4xl tracking-tight text-primary sm:text-9xl'>
					404
				</h1>
				<p className='mt-8 text-base text-gray-600'>
					La page demandée n&apos;existe pas ou n&apos;est pas accéssible pour le moment.
				</p>

				<Button
					size='lg'
					className='mt-5 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all group'
					asChild>
					<Link href='/'>Retour à l&apos;accueil</Link>
				</Button>
			</div>
		</div>
	);
}