import { Button } from '@repo/ui';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
	return (
		<div className='-mt-18 min-h-screen bg-[#0d0d0d] flex items-center justify-center relative overflow-hidden px-6'>
			{/* Background number */}
			<span
				aria-hidden
				className='absolute select-none font-black text-white/[0.03] leading-none'
				style={{ fontSize: 'clamp(180px, 35vw, 480px)' }}
			>
				404
			</span>

			<div className='relative z-10 text-center max-w-lg'>
				<div className='flex items-center justify-center gap-3 mb-8'>
					<span className='w-5 h-px bg-primary/60' />
					<span className='text-[9px] tracking-[2px] uppercase text-primary/80 font-semibold'>
						Page introuvable
					</span>
					<span className='w-5 h-px bg-primary/60' />
				</div>

				<h1 className='text-6xl sm:text-7xl font-black text-white leading-none tracking-tight mb-6'>
					Oops,<br />
					<span className='font-light text-white/40'>cette page n&apos;existe pas</span>
				</h1>

				<p className='text-sm text-white/40 leading-relaxed mb-10'>
					La page que vous cherchez est introuvable ou n&apos;est plus accessible.
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

			{/* Decorative corner line */}
			<div className='absolute bottom-12 right-10 w-px h-12 bg-white/10' />
		</div>
	);
}
