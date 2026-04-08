'use client';

import { useMediaQuery } from '@repo/ui';
import {
	Briefcase,
	Clock,
	Home,
	LogOut,
	MapPin,
	Megaphone,
	Menu,
	PlaneTakeoff,
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
	| 'leave'
	| 'announcement';

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
	{
		id: 'leave' as Section,
		label: 'Absences',
		icon: PlaneTakeoff,
		path: '/leave',
	},
	{
		id: 'announcement' as Section,
		label: 'Annonce',
		icon: Megaphone,
		path: '/announcement',
	},
];

export default function Sidebar({ children }: { children: ReactNode }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const currentSection = usePathname();
	const router = useRouter();

	const onLogout = useCallback(async () => {
		try {
			const res = await fetch('/api/auth/logout', {
				method: 'POST',
				credentials: 'include',
			});
			if (!res.ok) {
				console.error('Logout failed with status', res.status);
			}
		} catch (err) {
			console.error('Logout request failed', err);
		} finally {
			router.push('/auth/login');
		}
	}, [router]);

	const isDesktop = useMediaQuery('(min-width: 1024px)');

	return (
		<div className='min-h-screen bg-[#f7f6f4]'>
			{/* Mobile header */}
			<div className='lg:hidden bg-white border-b border-border px-5 h-14 flex items-center justify-between sticky top-0 z-40'>
				<div className='flex items-center gap-3'>
					<button
						onClick={() => void setSidebarOpen((prev) => !prev)}
						className='p-1.5 hover:bg-muted transition-colors'
						aria-label={
							sidebarOpen ? 'Fermer le menu' : 'Ouvrir le menu'
						}
					>
						{sidebarOpen ? (
							<X className='w-5 h-5' />
						) : (
							<Menu className='w-5 h-5' />
						)}
					</button>
					<div className='flex items-center gap-2'>
						<span className='w-1.5 h-1.5 bg-primary' />
						<span className='text-[11px] tracking-[2px] uppercase font-black text-foreground'>
							Anna Nischwitz
						</span>
					</div>
				</div>
				<button
					onClick={onLogout}
					className='p-1.5 hover:bg-muted transition-colors text-muted-foreground hover:text-destructive'
					aria-label='Déconnexion'
				>
					<LogOut className='w-4 h-4' />
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
							className='fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-border z-50 lg:z-0'
						>
							<div className='flex flex-col h-full'>
								{/* Brand */}
								<div className='hidden lg:flex items-center gap-3 px-6 py-5 border-b border-border'>
									<span className='w-1.5 h-1.5 bg-primary shrink-0' />
									<div>
										<div className='text-[11px] tracking-[2px] uppercase font-black text-foreground'>
											Anna Nischwitz
										</div>
										<div className='text-[9px] tracking-[1.5px] uppercase text-muted-foreground mt-0.5'>
											Dashboard Admin
										</div>
									</div>
								</div>

								{/* Navigation */}
								<nav className='flex-1 py-4 overflow-y-auto'>
									<div className='px-3 mb-2'>
										<span className='text-[9px] tracking-[2px] uppercase text-muted-foreground/60 font-semibold px-3'>
											Navigation
										</span>
									</div>
									{navItems.map((item) => {
										const isActive =
											currentSection === item.path;
										return (
											<Link
												key={item.id}
												href={item.path}
												onClick={() =>
													setSidebarOpen(false)
												}
												className={`w-full flex items-center gap-3 px-6 py-2.5 transition-colors duration-150 border-l-2 ${
													isActive
														? 'border-primary bg-primary/6 text-primary'
														: 'border-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground'
												}`}
											>
												<item.icon className='w-4 h-4 shrink-0' />
												<span className='text-sm font-medium'>
													{item.label}
												</span>
											</Link>
										);
									})}
								</nav>

								{/* Logout */}
								<div className='border-t border-border p-3'>
									<button
										onClick={onLogout}
										className='w-full flex items-center gap-3 px-6 py-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors duration-150'
									>
										<LogOut className='w-4 h-4 shrink-0' />
										<span className='text-sm font-medium'>
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
					<div className='max-w-6xl mx-auto px-5 sm:px-8 py-8'>
						<motion.div
							key={currentSection}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.25 }}
						>
							{/* Page header */}
							{currentSection !== '/' && (
								<div className='mb-8'>
									<div className='flex items-center gap-3 mb-1'>
										<span className='w-4 h-px bg-primary/60' />
										<span className='text-[9px] tracking-[2px] uppercase text-primary/80 font-semibold'>
											{
												navItems.find(
													(item) =>
														item.path ===
														currentSection
												)?.label
											}
										</span>
									</div>
									<h1 className='text-2xl font-black text-foreground tracking-tight'>
										{
											navItems.find(
												(item) =>
													item.path === currentSection
											)?.label
										}
									</h1>
								</div>
							)}

							{/* Content */}
							<div className='bg-white border border-border p-8'>
								{children}
							</div>
						</motion.div>
					</div>
				</main>
			</div>
		</div>
	);
}
