'use client';

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

export default function Navbar() {
	const currentPage = usePathname();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	return (
		<nav
			data-landmark-index='0'
			className={`sticky top-0 z-50 transition-colors duration-300 ${
				scrolled
					? 'bg-white border-b border-[#e8e8e8]'
					: 'bg-transparent'
			}`}
		>
			<div className='flex items-stretch h-18'>
				{/* Brand */}
				<Link
					href='/'
					className='flex items-center gap-3 px-6 sm:px-8 lg:px-10 shrink-0 transition-colors duration-300'
				>
					<span className='w-1.5 h-1.5 rounded-full bg-primary shrink-0' />
					<div>
						<div
							className={`text-[12px] font-black tracking-[2.5px] uppercase transition-colors duration-300 ${
								scrolled || mobileMenuOpen ? 'text-[#111]' : 'text-white'
							}`}
						>
							Anna Nischwitz
						</div>
						<div
							className={`text-[10px] tracking-[2px] uppercase mt-0.5 transition-colors duration-300 ${
								scrolled || mobileMenuOpen ? 'text-black/50' : 'text-white/80'
							}`}
						>
							Ostéopathe Animalière
						</div>
					</div>
				</Link>

				{/* Spacer */}
				<div className='hidden md:block flex-1' />

				{/* Desktop links */}
				<div className='hidden md:flex items-center'>
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={`text-[10px] tracking-[2px] uppercase px-4 h-full flex items-center transition-colors duration-300 ${
								currentPage === item.href
									? scrolled
										? 'text-[#111] font-semibold'
										: 'text-white font-semibold'
									: scrolled
										? 'text-black/70 hover:text-[#111] font-medium'
										: 'text-white/85 hover:text-white font-medium'
							}`}
						>
							{item.name}
						</Link>
					))}
				</div>

				{/* CTA desktop */}
				<Link
					href='/contact'
					className='hidden md:flex items-center px-7 ml-auto bg-primary hover:bg-primary/85 text-[10px] tracking-[2px] uppercase text-white font-bold transition-colors duration-200 shrink-0'
				>
					Rendez-vous →
				</Link>

				{/* Hamburger mobile */}
				<button
					className={`md:hidden ml-auto px-5 transition-colors duration-300 ${
						scrolled || mobileMenuOpen ? 'text-[#111]' : 'text-white'
					}`}
					onClick={() => setMobileMenuOpen((prev) => !prev)}
					aria-label={
						mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'
					}
					aria-expanded={mobileMenuOpen}
				>
					{mobileMenuOpen ? (
						<X className='h-5 w-5' />
					) : (
						<Menu className='h-5 w-5' />
					)}
				</button>
			</div>

			{/* Menu mobile */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className='md:hidden bg-white border-t border-[#e8e8e8] overflow-hidden'
					>
						<div className='px-6 py-3'>
							{navItems.map((item) => (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setMobileMenuOpen(false)}
									className={`block py-3.5 text-[10px] tracking-[2px] uppercase transition-colors border-b border-[#f4f4f4] last:border-0 ${
										currentPage === item.href
											? 'text-[#111] font-bold'
											: 'text-black/55 hover:text-[#111]'
									}`}
								>
									{item.name}
								</Link>
							))}
							<Link
								href='/contact'
								onClick={() => setMobileMenuOpen(false)}
								className='block pt-4 pb-2 text-[10px] tracking-[2px] uppercase text-primary font-bold'
							>
								Rendez-vous →
							</Link>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
}
