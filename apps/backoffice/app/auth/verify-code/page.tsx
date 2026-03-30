'use client';

import type { ResponseObject } from '@repo/app-types';
import { Button } from '@repo/ui';
import { Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';
import { toast } from 'sonner';

const CODE_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function Page() {
	const router = useRouter();
	const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(''));
	const [resendCountdown, setResendCountdown] = useState(RESEND_COOLDOWN);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	useEffect(() => {
		if (resendCountdown <= 0) return;
		const timer = setTimeout(() => setResendCountdown((c) => c - 1), 1000);
		return () => clearTimeout(timer);
	}, [resendCountdown]);

	const onCancel = useCallback(async () => {
		try {
			await fetch('/api/auth/cancel-login', {
				method: 'POST',
				credentials: 'include',
			});
		} catch {
			// best-effort cleanup, redirect regardless
		}
		router.push('/auth/login');
	}, [router]);

	const onResend = useCallback(async () => {
		try {
			const request = await fetch('/api/auth/resend-code', {
				method: 'POST',
				credentials: 'include',
			});
			const data: ResponseObject<null> = await request.json();
			if (data.success) {
				toast.success('Code renvoyé');
				setResendCountdown(RESEND_COOLDOWN);
				return;
			}
			if (data.statusCode === 429) {
				toast.error('Veuillez patienter avant de renvoyer le code');
				return;
			}
			if (data.statusCode === 401) {
				toast.error('Session expirée, veuillez recommencer');
				router.push('/auth/login');
				return;
			}
			throw new Error(data.message);
		} catch (error) {
			console.error(error);
			toast.error('Impossible de renvoyer le code pour le moment');
		}
	}, [router]);

	const focusAt = useCallback((index: number) => {
		inputRefs.current[
			Math.max(0, Math.min(CODE_LENGTH - 1, index))
		]?.focus();
	}, []);

	const handleChange = useCallback(
		(index: number, value: string) => {
			const digit = value.replace(/\D/g, '').slice(-1);
			setDigits((prev) => {
				const next = [...prev];
				next[index] = digit;
				return next;
			});
			if (digit && index < CODE_LENGTH - 1) focusAt(index + 1);
		},
		[focusAt]
	);

	const handleKeyDown = useCallback(
		(index: number, ev: React.KeyboardEvent<HTMLInputElement>) => {
			if (ev.key === 'Backspace' || ev.key === 'Delete') {
				ev.preventDefault();
				if (digits[index]) {
					setDigits((prev) => {
						const next = [...prev];
						next[index] = '';
						return next;
					});
				} else if (index > 0) {
					setDigits((prev) => {
						const next = [...prev];
						next[index - 1] = '';
						return next;
					});
					focusAt(index - 1);
				}
			} else if (ev.key === 'ArrowLeft') {
				focusAt(index - 1);
			} else if (ev.key === 'ArrowRight') {
				focusAt(index + 1);
			}
		},
		[digits, focusAt]
	);

	const handlePaste = useCallback(
		(ev: React.ClipboardEvent<HTMLInputElement>) => {
			ev.preventDefault();
			const pasted = ev.clipboardData
				.getData('text')
				.replace(/\D/g, '')
				.slice(0, CODE_LENGTH);
			if (!pasted) return;
			const next = Array(CODE_LENGTH).fill('');
			for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
			setDigits(next);
			focusAt(Math.min(pasted.length, CODE_LENGTH - 1));
		},
		[focusAt]
	);

	const onSubmit = useCallback(
		async (ev: React.FormEvent<HTMLFormElement>) => {
			ev.preventDefault();
			const code = digits.join('');
			if (code.length < CODE_LENGTH) {
				toast.error('Veuillez entrer le code complet');
				return;
			}
			try {
				const request = await fetch('/api/auth/verify-code', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					credentials: 'include',
					body: JSON.stringify({ code }),
				});
				const data: ResponseObject<null> = await request.json();
				if (data.success) {
					router.push('/');
					return;
				}
				if (data.statusCode === 401) {
					toast.error('Code invalide ou expiré');
					return;
				}
				throw new Error(data.message);
			} catch (error) {
				console.error(error);
				toast.error('Impossible de vérifier le code pour le moment');
			}
		},
		[digits, router]
	);

	return (
		<div className='min-h-screen flex items-center justify-center bg-[#f7f6f4] px-4'>
			<div className='w-full max-w-sm border border-border bg-white p-8'>
				<div className='text-center mb-8'>
					<div className='w-10 h-10 bg-primary flex items-center justify-center mx-auto mb-5'>
						<Mail className='h-4 w-4 text-white' />
					</div>
					<div className='flex items-center justify-center gap-3 mb-1'>
						<span className='w-4 h-px bg-primary/60' />
						<span className='text-[9px] tracking-[2px] uppercase text-primary/80 font-semibold'>
							Vérification
						</span>
						<span className='w-4 h-px bg-primary/60' />
					</div>
					<h1 className='text-xl font-black text-foreground tracking-tight'>
						Code de connexion
					</h1>
					<p className='text-sm text-muted-foreground mt-1'>
						Entrez le code reçu par e-mail
					</p>
					<button
						type='button'
						onClick={onCancel}
						className='mt-3 text-xs text-muted-foreground hover:text-primary transition-colors'
					>
						← Retour
					</button>
				</div>

				<form
					onSubmit={onSubmit}
					className='space-y-6'
				>
					<div className='flex justify-center gap-2'>
						{digits.map((digit, index) => (
							<input
								key={index}
								ref={(el) => {
									inputRefs.current[index] = el;
								}}
								type='text'
								inputMode='numeric'
								maxLength={1}
								value={digit}
								onChange={(ev) =>
									handleChange(index, ev.target.value)
								}
								onKeyDown={(ev) => handleKeyDown(index, ev)}
								onPaste={handlePaste}
								onFocus={(ev) => ev.target.select()}
								className='w-11 h-14 text-center text-xl font-semibold border border-border bg-background focus:border-primary focus:outline-none transition-colors'
								autoComplete='off'
								autoFocus={index === 0}
							/>
						))}
					</div>
					<Button
						type='submit'
						className='w-full bg-primary hover:bg-primary/85 text-white'
						disabled={digits.join('').length < CODE_LENGTH}
					>
						Vérifier
					</Button>
				</form>

				<div className='mt-4 text-center'>
					<button
						type='button'
						onClick={onResend}
						disabled={resendCountdown > 0}
						className='text-xs text-muted-foreground hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors'
					>
						{resendCountdown > 0
							? `Renvoyer le code (${resendCountdown}s)`
							: 'Renvoyer le code'}
					</button>
				</div>
			</div>
		</div>
	);
}
