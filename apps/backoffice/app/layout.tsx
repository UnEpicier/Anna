import Sidebar from '@/ui/sidebar';
import type { Metadata } from 'next';
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
	return (
		<html
			lang='fr'
			data-scroll-behavior='smooth'
		>
			<body>
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
				<Sidebar>{children}</Sidebar>
			</body>
		</html>
	);
}
