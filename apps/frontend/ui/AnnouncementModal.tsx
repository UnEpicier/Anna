'use client';

import type { Announcement } from '@repo/app-types';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'announcement_shown';

export default function AnnouncementModal({
	data,
}: {
	data: Announcement | null;
}) {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (!data?.enabled) return;
		if (sessionStorage.getItem(STORAGE_KEY)) return;
		sessionStorage.setItem(STORAGE_KEY, '1');
		setIsOpen(true);
	}, [data]);

	useEffect(() => {
		if (!isOpen) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setIsOpen(false);
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	}, [isOpen]);

	if (!data?.enabled) return null;

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						key='backdrop'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						onClick={() => setIsOpen(false)}
						className='fixed inset-0 z-60 bg-black/40 backdrop-blur-sm'
					/>

					{/* Panel */}
					<motion.div
						key='panel'
						role='dialog'
						aria-modal='true'
						aria-labelledby='announcement-title'
						initial={{ opacity: 0, scale: 0.95, y: 8 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 8 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
						className='fixed inset-0 z-60 m-auto flex h-fit w-full max-w-md flex-col rounded-sm border border-border bg-secondary shadow-xl'
					>
						{/* Header */}
						<div className='flex items-center justify-between border-b border-border px-6 py-4'>
							<h2
								id='announcement-title'
								className='text-base font-semibold tracking-tight text-foreground'
							>
								{data.title ?? 'Annonce'}
							</h2>
							<button
								type='button'
								onClick={() => setIsOpen(false)}
								aria-label='Fermer'
								className='flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground'
							>
								<X className='h-4 w-4' />
							</button>
						</div>

						{/* Body */}
						<div className='px-6 py-5 text-sm text-muted-foreground leading-relaxed'>
							{data.message}
						</div>

						{/* Footer CTA */}
						{data.ctaLabel && data.ctaUrl && (
							<div className='px-6 pb-5'>
								<a
									href={data.ctaUrl}
									onClick={() => setIsOpen(false)}
									{...(data.ctaOpenInNewTab
										? { target: '_blank', rel: 'noopener noreferrer' }
										: {})}
									className='inline-flex items-center justify-center rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/85'
								>
									{data.ctaLabel}
								</a>
							</div>
						)}
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
