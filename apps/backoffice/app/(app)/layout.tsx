import Sidebar from '@/ui/sidebar';
import type { ReactNode } from 'react';

export default async function AppLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>) {
	return <Sidebar>{children}</Sidebar>;
}
