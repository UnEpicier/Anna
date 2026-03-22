import type { Metadata } from 'next';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
	title: {
		default: 'Anna - Backoffice',
		template: '%s | Anna - Backoffice',
	},
	description: "Backoffice de l'application Anna.",
	robots: 'noindex, nofollow',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const nonce = (await headers()).get('x-nonce') ?? undefined;

	return (
		<html
			lang='fr'
			data-scroll-behavior='smooth'
		>
			<body nonce={nonce} suppressHydrationWarning>
				<Toaster
					richColors
					expand
					position='bottom-right'
					theme='light'
					toastOptions={{
						style: {
							fontSize: '1rem',
						},
					}}
				/>
				{children}
			</body>
		</html>
	);
}
