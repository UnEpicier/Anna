import { Button } from '@repo/ui';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
	return (
		<div className='min-h-screen bg-[#f7f6f4] flex items-center justify-center relative overflow-hidden px-6'>
			<span
				aria-hidden
				className='absolute select-none font-black text-foreground/[0.03] leading-none'
				style={{ fontSize: 'clamp(180px, 35vw, 480px)' }}
			>
				404
			</span>

			<div className='relative z-10 text-center max-w-sm'>
				<div className='flex items-center justify-center gap-3 mb-6'>
					<span className='w-5 h-px bg-primary/60' />
					<span className='text-[9px] tracking-[2px] uppercase text-primary/80 font-semibold'>
						Page introuvable
					</span>
					<span className='w-5 h-px bg-primary/60' />
				</div>

				<h1 className='text-5xl font-black text-foreground tracking-tight mb-4'>
					Oops,
					<br />
					<span className='font-light text-foreground/40'>
						cette page n&apos;existe pas
					</span>
				</h1>

				<p className='text-sm text-muted-foreground mb-8'>
					La page que vous cherchez est introuvable ou n&apos;est plus
					accessible.
				</p>

				<Button
					size='lg'
					className='bg-primary hover:bg-primary/85 text-white group'
					asChild
				>
					<Link href='/'>
						<ArrowLeft className='h-4 w-4 group-hover:-translate-x-0.5 transition-transform' />
						Retour à l&apos;accueil
					</Link>
				</Button>
			</div>
		</div>
	);
}
