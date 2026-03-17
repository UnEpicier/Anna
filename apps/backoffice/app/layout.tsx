import Sidebar from '@/ui/sidebar';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';
import './globals.css';

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
