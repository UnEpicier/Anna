import { useActionState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import Button from '@/components/Button';
import { Send } from 'lucide-react';
import { motion } from 'motion/react';

export default function Form() {
	const [error, action, pending] = useActionState(() => {}, null);

	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.6 }}
			className='lg:col-span-2'>
			<Card className='border-0 shadow-lg bg-white'>
				<CardHeader>
					<CardTitle className='text-primary text-2xl'>
						Formulaire de Contact
					</CardTitle>
					<p className='text-gray-600 mt-2'>
						Remplissez ce formulaire et je vous répondrai dans les
						plus brefs délais
					</p>
				</CardHeader>
				<CardContent>
					<form
						action={action}
						className='space-y-6'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<Label
									htmlFor='name'
									className='text-gray-700'>
									Nom *
								</Label>
								<Input
									id='name'
									name='name'
									autoComplete='name'
									required
									className='mt-2 border-gray-200 focus:border-primary'
								/>
							</div>

							<div>
								<Label
									htmlFor='email'
									className='text-gray-700'>
									Email *
								</Label>
								<Input
									id='email'
									name='email'
									type='email'
									autoComplete='email'
									required
									className='mt-2 border-gray-200 focus:border-primary'
								/>
							</div>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
							<div>
								<Label
									htmlFor='phone'
									className='text-gray-700'>
									Téléphone *
								</Label>
								<Input
									id='phone'
									name='phone'
									type='tel'
									autoComplete='tel'
									required
									className='mt-2 border-gray-200 focus:border-primary'
								/>
							</div>

							<div>
								<Label
									htmlFor='animal'
									className='text-gray-700'>
									Type d'Animal *
								</Label>
								<Input
									id='animal'
									name='animal'
									placeholder='Ex: Chien, Chat, Cheval, NAC'
									autoComplete='off'
									required
									className='mt-2 border-gray-200 focus:border-primary'
								/>
							</div>
						</div>
						<div>
							<Label
								htmlFor='message'
								className='text-gray-700'>
								Message *
							</Label>
							<Textarea
								id='message'
								name='message'
								rows={6}
								autoComplete='off'
								required
								className='mt-2 border-gray-200 focus:border-primary'
								placeholder='Décrivez la raison de votre demande, les symptômes observés, vos disponibilités...'
							/>
						</div>
						<div className='bg-gray-50 rounded-xl p-4 text-sm text-gray-600'>
							<p className='mb-2'>* Champs obligatoires</p>
							<p>
								En soumettant ce formulaire, vous acceptez que
								vos données soient utilisées pour vous
								recontacter. Voir notre politique de
								confidentialité.
							</p>
						</div>
						<Button
							type='submit'
							className='w-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all group'
							size='lg'>
							Envoyer le Message
							<Send className='ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform' />
						</Button>
					</form>
				</CardContent>
			</Card>
		</motion.div>
	);
}
