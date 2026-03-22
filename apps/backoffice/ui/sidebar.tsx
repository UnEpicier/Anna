'use client';

import { useMediaQuery } from '@repo/ui';
import {
	Briefcase,
	Clock,
	Home,
	LogOut,
	MapPin,
	Menu,
	Settings,
	Share2,
	X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { type ReactNode, useCallback, useState } from 'react';

type Section =
	| 'overview'
	| 'informations'
	| 'departments'
	| 'schedule'
	| 'social'
	| 'services'
	| 'categories'
	| 'blog';

const navItems = [
	{
		id: 'overview' as Section,
		label: "Vue d'ensemble",
		icon: Home,
		path: '/',
	},
	{
		id: 'informations' as Section,
		label: 'Informations',
		icon: Settings,
		path: '/informations',
	},
	{
		id: 'departments' as Section,
		label: 'Départements',
		icon: MapPin,
		path: '/departments',
	},
	{
		id: 'schedule' as Section,
		label: 'Horaires',
		icon: Clock,
		path: '/schedule',
	},
	{
		id: 'social' as Section,
		label: 'Réseaux sociaux',
		icon: Share2,
		path: '/social',
	},
	{
		id: 'services' as Section,
		label: 'Services',
		icon: Briefcase,
		path: '/services',
	},
];

export default function Sidebar({ children }: { children: ReactNode }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const currentSection = usePathname();
	const router = useRouter();

	const onLogout = useCallback(async () => {
		await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
		router.push('/auth/login');
	}, [router]);

	const isDesktop = useMediaQuery('(min-width: 1024px)');

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Mobile header */}
			<div className='lg:hidden bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-40'>
				<div className='flex items-center gap-3'>
					<button
						onClick={() => void setSidebarOpen((prev) => !prev)}
						className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
					>
						{sidebarOpen ? (
							<X className='w-6 h-6' />
						) : (
							<Menu className='w-6 h-6' />
						)}
					</button>
					<h1 className='text-xl font-bold text-gray-900'>
						Dashboard
					</h1>
				</div>
				<button
					onClick={onLogout}
					className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
				>
					<LogOut className='w-5 h-5 text-gray-600' />
				</button>
			</div>

			<div className='flex'>
				{/* Sidebar */}
				<AnimatePresence>
					{(sidebarOpen || isDesktop) && (
						<motion.aside
							initial={{ x: -280 }}
							animate={{ x: 0 }}
							exit={{ x: -280 }}
							transition={{
								type: 'spring',
								damping: 25,
								stiffness: 200,
							}}
							className='fixed lg:sticky top-0 left-0 h-screen w-70 bg-white border-r border-gray-200 z-50 lg:z-0'
						>
							<div className='flex flex-col h-full'>
								{/* Logo */}
								<div className='hidden lg:flex items-center gap-3 px-6 py-6 border-b border-gray-200'>
									<div className='w-10 h-10 rounded-xl bg-linear-to-br from-[#7f5539] to-[#5a3a26] flex items-center justify-center text-white font-bold'>
										AN
									</div>
									<div>
										<h2 className='font-bold text-gray-900'>
											Anna Nischwitz
										</h2>
										<p className='text-sm text-gray-600'>
											Dashboard Admin
										</p>
									</div>
								</div>

								{/* Navigation */}
								<nav className='flex-1 px-3 py-6 space-y-1 overflow-y-auto'>
									{navItems.map((item) => (
										<Link
											key={item.id}
											href={item.path}
											onClick={() => {
												setSidebarOpen(false);
											}}
											className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
												currentSection === item.path
													? 'bg-linear-to-r from-[#7f5539] to-[#5a3a26] text-white shadow-lg shadow-[#7f5539]/20'
													: 'text-gray-700 hover:bg-gray-100'
											}`}
										>
											<item.icon className='w-5 h-5 shrink-0' />
											<span className='font-medium'>
												{item.label}
											</span>
										</Link>
									))}
								</nav>

								{/* Logout */}
								<div className='p-4 border-t border-gray-200'>
									<button
										onClick={onLogout}
										className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200'
									>
										<LogOut className='w-5 h-5' />
										<span className='font-medium'>
											Déconnexion
										</span>
									</button>
								</div>
							</div>
						</motion.aside>
					)}
				</AnimatePresence>

				{/* Overlay for mobile */}
				{sidebarOpen && (
					<div
						className='fixed inset-0 bg-black/20 z-40 lg:hidden'
						onClick={() => void setSidebarOpen(false)}
					/>
				)}

				{/* Main content */}
				<main className='flex-1 min-w-0'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
						<motion.div
							key={currentSection}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							{/* Page header (except for overview) */}
							{currentSection !== 'overview' && (
								<div className='mb-8'>
									<h1 className='text-3xl font-bold text-gray-900 mb-2'>
										{
											navItems.find(
												(item) =>
													item.path === currentSection
											)?.label
										}
									</h1>
									<p className='text-gray-600'>
										Gérez les paramètres de cette section
									</p>
								</div>
							)}

							{/* Content */}
							<div className='bg-white rounded-2xl p-8 shadow-lg'>
								{children}
							</div>
						</motion.div>
					</div>
				</main>
			</div>
		</div>
	);
}
