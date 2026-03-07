import type { ReactNode } from 'react';
import './globals.css';
import Sidebar from '@/ui/sidebar';

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
				<Sidebar>{children}</Sidebar>
			</body>
		</html>
	);
}
