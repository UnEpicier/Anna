'use client';

import { Button, Input, Label } from '@repo/ui';
import { Facebook, Instagram } from 'lucide-react';
import { useActionState } from 'react';

export default function SocialContent({
	socials,
}: {
	socials: { facebook: string; instagram: string };
}) {
	const [error, action, pending] = useActionState(() => {}, null);

	return (
		<form
			action={action}
			className='space-y-6'>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
				<div className='relative overflow-hidden bg-linear-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 group hover:shadow-md transition-all duration-300'>
					<div className='absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-blue-500 to-blue-600 opacity-5 rounded-bl-full' />

					<div className='relative'>
						<Label
							htmlFor='instagram'
							className='flex items-center gap-3 mb-4 cursor-pointer'>
							<div className='p-3 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-lg'>
								<Facebook className='w-5 h-5' />
							</div>
							<span className='text-lg font-semibold text-gray-900'>
								Facebook
							</span>
						</Label>

						<Input
							id='instagram'
							defaultValue={socials.facebook}
							placeholder='https://www.facebook.com/votreprofil'
							className='border-gray-200 focus:border-[#7f5539] focus:ring-[#7f5539]/20 transition-all duration-200'
							disabled={pending}
						/>
					</div>
				</div>

				<div className='relative overflow-hidden bg-linear-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6 group hover:shadow-md transition-all duration-300'>
					<div className='absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-pink-500 to-purple-600 opacity-5 rounded-bl-full' />

					<div className='relative'>
						<Label
							htmlFor='instagram'
							className='flex items-center gap-3 mb-4 cursor-pointer'>
							<div className='p-3 rounded-xl bg-linear-to-br from-pink-500 to-purple-600 text-white shadow-lg'>
								<Instagram className='w-5 h-5' />
							</div>
							<span className='text-lg font-semibold text-gray-900'>
								Instagram
							</span>
						</Label>

						<Input
							id='instagram'
							defaultValue={socials.instagram}
							placeholder='https://www.instagram.com/votreprofil'
							className='border-gray-200 focus:border-[#7f5539] focus:ring-[#7f5539]/20 transition-all duration-200'
							disabled={pending}
						/>
					</div>
				</div>
			</div>

			<div className='bg-blue-50 border border-blue-200 rounded-xl p-4'>
				<p className='text-sm text-blue-900'>
					<span className='font-semibold'>💡 Astuce :</span> Entrez
					l&apos;URL complète de votre profil (commençant par
					https://). Laissez le champ vide ou avec &ldquo;#&ldquo; si
					vous n&apos;avez pas de compte.
				</p>
			</div>

			<div className='pt-4 border-t border-gray-200'>
				<Button
					type='submit'
					className='bg-linear-to-r from-[#7f5539] to-[#5a3a26] hover:shadow-lg hover:shadow-[#7f5539]/20 transition-all duration-200'>
					Enregistrer les modifications
				</Button>
			</div>
		</form>
	);
}
