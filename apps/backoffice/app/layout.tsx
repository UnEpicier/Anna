import { cookies, headers } from 'next/headers';
import './globals.css';
import { ReactNode } from 'react';

export default async function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	const cookieStore = await cookies();
	const token = await cookieStore.get('token');


	const headerList = headers();
	console.log(headerList);

	return (
		<html
			lang='fr'
			data-scroll-behavior='smooth'>
			<body>
				<div className='min-h-screen flex flex-col'>
					<main
						data-landmark-index='1'
						className='flex-1'>
						{children}
					</main>
				</div>
			</body>
		</html>
	);
}
