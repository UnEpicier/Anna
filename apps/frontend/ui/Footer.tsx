import { Heart, Mail, Phone } from 'lucide-react';
import { SiFacebook, SiInstagram } from '@icons-pack/react-simple-icons';
import Link from 'next/link';
import { Informations, Response } from '@/utils/types';
import { formatPhoneNumber } from '@/utils/format';

async function getData() {
	const infoRes = await fetch(`${process.env.API_URL}/informations`, {
		next: { revalidate: 60 },
	});
	const infoResponseData: Response<Informations> = await infoRes.json();

	if (infoResponseData.success) {
		return infoResponseData.responseObject;
	}

	return null;
}

export default async function Footer() {
	const data = await getData();
	
	return (
		<footer
			data-landmark-index='2'
			className='relative bg-linear-to-b from-gray-50 to-white border-t border-border'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
					<div>
						<div className='flex items-center gap-3 mb-6'>
							<div className='w-12 h-12 bg-linear-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-white shadow-lg'>
								AN
							</div>
							<div>
								<h3 className='text-primary'>Anna Nischwitz</h3>
								<p className='text-sm text-muted-foreground'>
									Ostéopathe Animalier
								</p>
							</div>
						</div>
						<p className='text-gray-600 leading-relaxed'>
							Ostéopathe animalier diplômée, passionnée par le
							bien-être de vos compagnons.
						</p>
					</div>

					<div>
						<h4 className='text-primary mb-6'>Liens Rapides</h4>
						<ul className='space-y-3'>
							<li>
								<Link
									href='/services'
									className='text-gray-600 hover:text-primary transition-colors hover:translate-x-1 inline-block'>
									Services & Tarifs
								</Link>
							</li>
							<li>
								<Link
									href='/seance'
									className='text-gray-600 hover:text-primary transition-colors hover:translate-x-1 inline-block'>
									Déroulement d&apos;une Séance
								</Link>
							</li>
							<li>
								<Link
									href='/blog'
									className='text-gray-600 hover:text-primary transition-colors hover:translate-x-1 inline-block'>
									Blog
								</Link>
							</li>
							<li>
								<Link
									href='/contact'
									className='text-gray-600 hover:text-primary transition-colors hover:translate-x-1 inline-block'>
									Contact
								</Link>
							</li>
						</ul>
					</div>

					{data ? (
						<div>
							<h4 className='text-primary mb-6'>Contact</h4>
							<div className='space-y-4 text-gray-600'>
								<Link
									href={`tel:${formatPhoneNumber(data.phone)}`}
									className='flex items-center gap-3 hover:text-primary transition-colors group'>
									<div className='bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors'>
										<Phone className='h-4 w-4 text-primary' />
									</div>
									<span>{formatPhoneNumber(data.phone)}</span>
								</Link>
								<Link
									href={`mailto:${data.email}`}
									className='flex items-center gap-3 hover:text-primary transition-colors group'>
									<div className='bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors'>
										<Mail className='h-4 w-4 text-primary' />
									</div>
									<span>{data.email}</span>
								</Link>
								<div className='flex gap-3 mt-6'>
									<Link
										href={data.facebook}
										target='_blank'
										rel='noopener noreferrer'
										className='bg-primary/10 p-3 rounded-xl text-primary hover:bg-primary hover:text-white transition-all hover:scale-110 shadow-sm'>
										<SiFacebook className='h-5 w-5' />
									</Link>
									<Link
										href={data.instagram}
										target='_blank'
										rel='noopener noreferrer'
										className='bg-primary/10 p-3 rounded-xl text-primary hover:bg-primary hover:text-white transition-all hover:scale-110 shadow-sm'>
										<SiInstagram className='h-5 w-5' />
									</Link>
								</div>
							</div>
						</div>
					) : (
						<div />
					)}
				</div>

				<div className='mt-12 pt-8 border-t border-border'>
					<div className='flex flex-col md:flex-row justify-between items-center gap-4'>
						<p className='text-sm text-gray-600 flex items-center gap-2'>
							© {new Date().getFullYear()} Anna Nischwitz. Tous
							droits réservés.
							<Heart className='h-4 w-4 text-primary inline' />
						</p>
						<div className='flex flex-wrap gap-6 text-sm'>
							<Link
								href='/legal/mentions-legales'
								className='text-gray-600 hover:text-primary transition-colors'>
								Mentions Légales
							</Link>
							<Link
								href='/legal/confidentialite'
								className='text-gray-600 hover:text-primary transition-colors'>
								Politique de Confidentialité
							</Link>
							<Link
								href='/legal/cgv'
								className='text-gray-600 hover:text-primary transition-colors'>
								CGV
							</Link>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
