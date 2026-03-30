import { Button, Input, Label, Textarea } from '@repo/ui';
import { Send } from 'lucide-react';
import { motion } from 'motion/react';
import { useActionState } from 'react';

export default function Form() {
	const [_error, action] = useActionState(() => {}, null);

	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
			className='lg:col-span-2'
		>
			<div className='flex items-center gap-3 mb-6'>
				<span className='w-5 h-px bg-primary' />
				<span className='text-[9px] tracking-[2px] uppercase text-primary font-semibold'>
					Formulaire de contact
				</span>
			</div>

			<form action={action} className='space-y-5'>
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
					<div className='space-y-1.5'>
						<Label htmlFor='name' className='text-[9px] tracking-[2px] uppercase text-muted-foreground'>
							Nom *
						</Label>
						<Input id='name' name='name' autoComplete='name' required />
					</div>
					<div className='space-y-1.5'>
						<Label htmlFor='email' className='text-[9px] tracking-[2px] uppercase text-muted-foreground'>
							Email *
						</Label>
						<Input id='email' name='email' type='email' autoComplete='email' required />
					</div>
				</div>

				<div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
					<div className='space-y-1.5'>
						<Label htmlFor='phone' className='text-[9px] tracking-[2px] uppercase text-muted-foreground'>
							Téléphone *
						</Label>
						<Input id='phone' name='phone' type='tel' autoComplete='tel' required />
					</div>
					<div className='space-y-1.5'>
						<Label htmlFor='animal' className='text-[9px] tracking-[2px] uppercase text-muted-foreground'>
							Type d&apos;animal *
						</Label>
						<Input
							id='animal'
							name='animal'
							placeholder='Chien, Chat, Cheval, NAC…'
							autoComplete='off'
							required
						/>
					</div>
				</div>

				<div className='space-y-1.5'>
					<Label htmlFor='message' className='text-[9px] tracking-[2px] uppercase text-muted-foreground'>
						Message *
					</Label>
					<Textarea
						id='message'
						name='message'
						rows={6}
						autoComplete='off'
						required
						placeholder='Décrivez la raison de votre demande, les symptômes observés, vos disponibilités…'
					/>
				</div>

				<p className='text-[10px] text-muted-foreground leading-relaxed'>
					* Champs obligatoires. En soumettant ce formulaire, vous acceptez
					que vos données soient utilisées pour vous recontacter.
				</p>

				<Button
					type='submit'
					size='lg'
					className='w-full bg-primary hover:bg-primary/85 text-white group'
				>
					Envoyer le message
					<Send className='h-4 w-4 group-hover:translate-x-0.5 transition-transform' />
				</Button>
			</form>
		</motion.div>
	);
}
