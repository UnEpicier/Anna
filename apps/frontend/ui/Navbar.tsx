'use client';

import { Button } from '@repo/ui';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
	{ name: 'Accueil', href: '/' },
	{ name: 'Services', href: '/services' },
	{ name: 'Séance Type', href: '/seance' },
	{ name: 'Contact', href: '/contact' },
];

const MotionLink = motion.create(Link);

export default function Navbar() {
	const currentPage = usePathname();

	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<nav
			data-landmark-index='0'
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				scrolled
					? 'glass-effect shadow-lg border-b border-border'
					: 'bg-transparent'
			}`}
		>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-20'>
					<MotionLink
						href='/'
						className='flex items-center gap-3 group'
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
					>
						<div className='relative'>
							<div className='absolute inset-0 bg-primary/20 rounded-2xl blur-lg group-hover:blur-xl transition-all'></div>
							<div className='relative w-12 h-12 bg-linear-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-white shadow-lg'>
								AN
							</div>
						</div>
						<div>
							<div className='text-lg text-primary transition-colors'>
								Anna Nischwitz
							</div>
							<div className='text-sm text-muted-foreground'>
								Ostéopathe Animalier
							</div>
						</div>
					</MotionLink>

					{/* Desktop Navigation */}
					<div className='hidden md:flex items-center gap-8'>
						{navItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`relative py-2 transition-all ${
									currentPage === item.href
										? 'text-primary'
										: 'text-gray-600 hover:text-primary'
								}`}
							>
								{item.name}
								{currentPage === item.href && (
									<motion.div
										layoutId='activeTab'
										className='absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full'
										transition={{
											type: 'spring',
											stiffness: 380,
											damping: 30,
										}}
									/>
								)}
							</Link>
						))}
					</div>

					{/* Mobile menu button */}
					<div className='md:hidden'>
						<Button
							variant='ghost'
							size='sm'
							onClick={() => setMobileMenuOpen((prev) => !prev)}
							className='hover:bg-primary/10'
						>
							{mobileMenuOpen ? (
								<X className='h-6 w-6' />
							) : (
								<Menu className='h-6 w-6' />
							)}
						</Button>
					</div>
				</div>
			</div>

			{/* Mobile Navigation */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className='md:hidden glass-effect border-t border-border overflow-hidden'
					>
						<div className='px-4 py-4 space-y-1'>
							{navItems.map((item) => (
								<MotionLink
									key={item.href}
									href={item.href}
									className={`block w-full text-left px-4 py-3 rounded-xl transition-all ${
										currentPage === item.href
											? 'bg-primary text-white shadow-md'
											: 'text-gray-600 hover:bg-primary/10'
									}`}
									whileTap={{ scale: 0.98 }}
								>
									{item.name}
								</MotionLink>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
}
