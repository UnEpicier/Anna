import { SiFacebook, SiInstagram } from '@icons-pack/react-simple-icons';
import type { Informations, ResponseObject } from '@repo/app-types';
import { formatPhoneNumber } from '@repo/utils';
import { Mail, Phone } from 'lucide-react';
import Link from 'next/link';

async function getData() {
	const infoRes = await fetch(`${process.env.API_URL}/informations`, {
		cache: 'no-cache',
	});
	const infoResponseData: ResponseObject<Informations> = await infoRes.json();

	if (infoResponseData.success) {
		return infoResponseData.responseObject;
	}

	return null;
}

export default async function Footer() {
	const data = await getData();

	return (
		<footer data-landmark-index='2' className='bg-[#0d0d0d] border-t border-white/8'>
			<div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 py-16 sm:py-20'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16'>

					{/* Brand */}
					<div>
						<div className='flex items-center gap-3 mb-6'>
							<div className='w-2 h-2 bg-primary' />
							<div>
								<div className='text-[11px] tracking-[2px] uppercase font-black text-white'>
									Anna Nischwitz
								</div>
								<div className='text-[9px] tracking-[1.5px] uppercase text-white/40 mt-0.5'>
									Ostéopathe Animalier
								</div>
							</div>
						</div>
						<p className='text-sm text-white/45 leading-relaxed max-w-xs'>
							Ostéopathe animalier diplômée, passionnée par le bien-être de vos compagnons.
						</p>
						{data && (data.facebook || data.instagram) && (
							<div className='flex gap-2 mt-8'>
								{data.facebook && (
									<Link
										href={data.facebook}
										target='_blank'
										rel='noopener noreferrer'
										className='w-9 h-9 border border-white/15 flex items-center justify-center text-white/40 hover:border-primary hover:text-primary transition-colors'
									>
										<SiFacebook className='h-3.5 w-3.5' />
									</Link>
								)}
								{data.instagram && (
									<Link
										href={data.instagram}
										target='_blank'
										rel='noopener noreferrer'
										className='w-9 h-9 border border-white/15 flex items-center justify-center text-white/40 hover:border-primary hover:text-primary transition-colors'
									>
										<SiInstagram className='h-3.5 w-3.5' />
									</Link>
								)}
							</div>
						)}
					</div>

					{/* Navigation */}
					<div>
						<div className='flex items-center gap-3 mb-6'>
							<span className='w-5 h-px bg-primary/60' />
							<span className='text-[9px] tracking-[2px] uppercase text-primary/80 font-semibold'>
								Navigation
							</span>
						</div>
						<ul className='space-y-3'>
							{[
								{ href: '/services', label: 'Services & Tarifs' },
								{ href: '/seance', label: "Déroulement d'une Séance" },
								{ href: '/contact', label: 'Contact' },
							].map(({ href, label }) => (
								<li key={href}>
									<Link
										href={href}
										className='text-[10px] tracking-[1.5px] uppercase text-white/45 hover:text-primary transition-colors'
									>
										{label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact */}
					{data && (
						<div>
							<div className='flex items-center gap-3 mb-6'>
								<span className='w-5 h-px bg-primary/60' />
								<span className='text-[9px] tracking-[2px] uppercase text-primary/80 font-semibold'>
									Contact
								</span>
							</div>
							<div className='space-y-3'>
								<Link
									href={`tel:${formatPhoneNumber(data.phone)}`}
									className='flex items-center gap-3 group'
								>
									<div className='w-8 h-8 border border-white/12 flex items-center justify-center shrink-0 group-hover:border-primary group-hover:bg-primary transition-colors'>
										<Phone className='h-3.5 w-3.5 text-primary group-hover:text-white transition-colors' />
									</div>
									<span className='text-sm text-white/45 group-hover:text-primary transition-colors'>
										{formatPhoneNumber(data.phone)}
									</span>
								</Link>
								<Link
									href={`mailto:${data.email}`}
									className='flex items-center gap-3 group'
								>
									<div className='w-8 h-8 border border-white/12 flex items-center justify-center shrink-0 group-hover:border-primary group-hover:bg-primary transition-colors'>
										<Mail className='h-3.5 w-3.5 text-primary group-hover:text-white transition-colors' />
									</div>
									<span className='text-sm text-white/45 group-hover:text-primary transition-colors break-all'>
										{data.email}
									</span>
								</Link>
							</div>
						</div>
					)}
				</div>

				{/* Bottom bar */}
				<div className='mt-16 pt-8 border-t border-white/8'>
					<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
						<p className='text-[9px] tracking-[1.5px] uppercase text-white/25'>
							© {new Date().getFullYear()} Anna Nischwitz — Tous droits réservés
						</p>
						<div className='flex flex-wrap gap-6'>
							{[
								{ href: '/legal/mentions-legales', label: 'Mentions Légales' },
								{ href: '/legal/confidentialite', label: 'Confidentialité' },
								{ href: '/legal/cgv', label: 'CGV' },
							].map(({ href, label }) => (
								<Link
									key={href}
									href={href}
									className='text-[9px] tracking-[1.5px] uppercase text-white/25 hover:text-primary/70 transition-colors'
								>
									{label}
								</Link>
							))}
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
