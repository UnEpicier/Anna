'use client';

import type { PopupMessage } from '@repo/app-types';
import { X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import type React from 'react';

const STORAGE_KEY = 'announcement_shown';

export default function AnnouncementModal({
	data,
}: {
	data: PopupMessage | null;
}) {
	const dialogRef = useRef<HTMLDialogElement>(null);

	useEffect(() => {
		if (!data || !data.enabled) return;
		if (sessionStorage.getItem(STORAGE_KEY)) return;

		sessionStorage.setItem(STORAGE_KEY, '1');
		dialogRef.current?.showModal();
	}, [data]);

	if (!data || !data.enabled) return null;

	const close = () => dialogRef.current?.close();

	const handleBackdropClick = (ev: React.MouseEvent<HTMLDialogElement>) => {
		if (ev.target === dialogRef.current) close();
	};

	return (
		<dialog
			ref={dialogRef}
			aria-labelledby='announcement-title'
			aria-modal='true'
			onClick={handleBackdropClick}
			className='fixed inset-0 m-auto w-full max-w-md rounded-none border border-border bg-white p-0 shadow-lg backdrop:bg-black/40 backdrop:backdrop-blur-sm open:flex open:flex-col'
		>
			{/* Header */}
			<div className='flex items-center justify-between border-b border-border px-6 py-4'>
				<h2
					id='announcement-title'
					className='text-base font-bold tracking-tight text-foreground'
				>
					{data.title ?? 'Annonce'}
				</h2>
				<button
					type='button'
					onClick={close}
					aria-label='Fermer'
					className='flex h-7 w-7 items-center justify-center text-muted-foreground transition-colors hover:text-foreground'
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
						onClick={close}
						target='_blank'
						rel='noopener noreferrer'
						className='inline-flex items-center justify-center bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/85'
					>
						{data.ctaLabel}
					</a>
				</div>
			)}
		</dialog>
	);
}
