import './globals.css';
import type { ReactNode } from 'react';
import Footer from '@/ui/Footer';
import Navbar from '@/ui/Navbar';

export default function RootLayout({
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
				<div className='min-h-screen flex flex-col'>
					<Navbar />
					<main
						data-landmark-index='1'
						className='flex-1'
					>
						{children}
					</main>
					<Footer />
				</div>
			</body>
		</html>
	);
}
