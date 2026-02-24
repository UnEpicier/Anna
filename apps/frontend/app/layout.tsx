import './globals.css';
import { ReactNode } from 'react';
import Navbar from '@/ui/Navbar';
import Footer from '@/ui/Footer';

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return (
		<html
			lang='fr'
			data-scroll-behavior='smooth'>
			<body>
				<div className='min-h-screen flex flex-col'>
					<Navbar />
					<main
						data-landmark-index='1'
						className='flex-1'>
						{children}
					</main>
					<Footer />
				</div>
			</body>
		</html>
	);
}
