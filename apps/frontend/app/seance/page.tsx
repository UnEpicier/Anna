'use client';

import { ImageWithFallback } from '@repo/ui';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

const steps = [
	{
		num: '01',
		title: 'Anamnèse et Prise de Contact',
		duration: '10–15 min',
		description:
			"Échange sur l'historique de votre animal, ses habitudes, son mode de vie et la raison de la consultation.",
		details: [
			'Motif de consultation',
			'Historique médical et vétérinaire',
			'Mode de vie et environnement',
			'Alimentation et activité physique',
			'Comportements observés',
		],
	},
	{
		num: '02',
		title: 'Observation Statique et Dynamique',
		duration: '5–10 min',
		description:
			'Observation au repos et en mouvement pour détecter les déséquilibres posturaux et les troubles de la locomotion.',
		details: [
			'Posture générale',
			'Appuis et équilibre',
			'Observation de la marche',
			'Détection des asymétries',
			'Analyse du comportement',
		],
	},
	{
		num: '03',
		title: 'Examen Ostéopathique Complet',
		duration: '15–20 min',
		description:
			"À l'aide de techniques manuelles douces, évaluation de la mobilité de toutes les structures du corps.",
		details: [
			"Palpation de l'ensemble du corps",
			'Tests de mobilité articulaire',
			'Évaluation des tensions musculaires',
			'Recherche de zones de restriction',
			'Bilan ostéopathique complet',
		],
	},
	{
		num: '04',
		title: 'Traitement Ostéopathique',
		duration: '20–30 min',
		description:
			'Traitement des dysfonctions détectées grâce à des techniques adaptées à votre animal et à son état.',
		details: [
			'Techniques douces et non invasives',
			'Manipulations articulaires',
			'Relâchement des tensions musculaires',
			'Équilibration du système nerveux',
			"Respect du rythme de l'animal",
		],
	},
	{
		num: '05',
		title: 'Conseils et Recommandations',
		duration: '5–10 min',
		description:
			'Conseils personnalisés pour optimiser les bénéfices de la séance et prendre soin de votre animal au quotidien.',
		details: [
			'Temps de repos recommandé',
			'Exercices adaptés',
			'Conseils posturaux',
			"Adaptation de l'environnement",
			'Prévention et suivi',
		],
	},
	{
		num: '06',
		title: 'Suivi Post-Séance',
		duration: 'Après la séance',
		description:
			"Disponibilité pour répondre à vos questions et assurer un suivi de l'évolution de votre animal.",
		details: [
			'Compte-rendu écrit de la séance',
			'Disponibilité pour questions',
			'Planification du suivi si nécessaire',
			'Coordination avec le vétérinaire',
			"Suivi de l'évolution",
		],
	},
];

const importantPoints = [
	{
		label: 'Durée',
		text: "Entre 45 min et 1h30 selon l'espèce et les besoins de l'animal.",
	},
	{
		label: 'Approche douce',
		text: 'Toutes les manipulations sont réalisées dans le respect du bien-être et du confort de votre animal.',
	},
	{
		label: 'Complémentarité',
		text: "L'ostéopathie ne se substitue pas à la médecine vétérinaire mais la complète parfaitement.",
	},
];

const preparation = {
	avant: [
		'Préparez les documents vétérinaires (radios, examens…)',
		'Notez les comportements inhabituels observés',
		'Prévoyez un espace calme pour la séance',
		"Évitez de nourrir l'animal juste avant",
	],
	apres: [
		'Laissez votre animal se reposer 24–48h',
		'Évitez les efforts intenses pendant 2–3 jours',
		"Surveillez l'évolution et notez les changements",
		"N'hésitez pas à me contacter en cas de question",
	],
};

const faqs = [
	{
		q: 'Mon animal va-t-il avoir mal pendant la séance ?',
		a: 'Non, les techniques utilisées sont douces et non invasives. Votre animal peut ressentir un léger inconfort lors de la libération de certaines tensions, mais cela reste très bref et sans douleur.',
	},
	{
		q: 'Combien de séances sont nécessaires ?',
		a: "Cela dépend de chaque animal et de sa problématique. Une séance peut suffire pour un problème ponctuel, tandis qu'un suivi régulier (2 à 4 fois par an) est recommandé pour les animaux sportifs ou âgés.",
	},
	{
		q: 'Quand vais-je voir les résultats ?',
		a: "Les effets peuvent être immédiats ou se manifester dans les 48 à 72 heures suivant la séance. Le corps de l'animal a besoin de temps pour intégrer les corrections effectuées.",
	},
];

function TimelineSteps() {
	const containerRef = useRef<HTMLDivElement>(null);
	const stepEls = useRef<(HTMLDivElement | null)[]>([]);
	const [activeStep, setActiveStep] = useState(0);

	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ['start 70%', 'end 30%'],
	});
	const lineScaleY = useSpring(scrollYProgress, { stiffness: 60, damping: 20 });

	useEffect(() => {
		const update = () => {
			const mid = window.innerHeight / 2;
			let best = 0, bestDist = Infinity;
			stepEls.current.forEach((el, i) => {
				if (!el) return;
				const r = el.getBoundingClientRect();
				const d = Math.abs(r.top + r.height / 2 - mid);
				if (d < bestDist) { bestDist = d; best = i; }
			});
			setActiveStep(best);
		};
		window.addEventListener('scroll', update, { passive: true });
		update();
		return () => window.removeEventListener('scroll', update);
	}, []);

	return (
		<div ref={containerRef} className='relative'>
			{/* Ligne fond */}
			<div className='absolute left-[13px] sm:left-[21px] top-3.5 bottom-3.5 w-px bg-border' />
			{/* Ligne fill scroll */}
			<motion.div
				className='absolute left-[13px] sm:left-[21px] top-3.5 bottom-3.5 w-px bg-primary origin-top'
				style={{ scaleY: lineScaleY }}
			/>

			{steps.map((step, i) => {
				const isPast = i < activeStep;
				const isActive = i === activeStep;

				return (
					<div
						key={step.num}
						ref={el => { stepEls.current[i] = el; }}
						className='grid grid-cols-[32px_1fr] sm:grid-cols-[44px_1fr] gap-4 sm:gap-6'
					>
						{/* Dot */}
						<div className='flex justify-center'>
							<motion.div
								className='w-7 h-7 border flex items-center justify-center shrink-0 relative z-10'
								animate={{
									backgroundColor: isPast || isActive ? '#c4956a' : '#ffffff',
									borderColor: isPast || isActive ? '#c4956a' : 'rgba(196,149,106,0.2)',
									scale: isActive ? 1.35 : 1,
								}}
								transition={{ duration: 0.3 }}
							>
								<motion.span
									className='text-[11px] font-black'
									animate={{ color: isPast || isActive ? '#ffffff' : '#c4956a' }}
									transition={{ duration: 0.3 }}
								>
									{step.num}
								</motion.span>
							</motion.div>
						</div>

						{/* Contenu */}
						<motion.div
							className='pb-8'
							animate={{ scale: isActive ? 1.01 : 1, opacity: isPast ? 0.55 : 1 }}
							transition={{ duration: 0.3 }}
						>
							<div className='flex flex-wrap items-baseline justify-between gap-2 mb-2'>
								<h3 className='text-base sm:text-lg font-bold text-foreground'>
									{step.title}
								</h3>
								<motion.span
									className='text-[9px] tracking-[1.5px] uppercase font-semibold shrink-0'
									animate={{ color: isActive ? '#c4956a' : 'rgba(196,149,106,0.6)' }}
									transition={{ duration: 0.3 }}
								>
									{step.duration}
								</motion.span>
							</div>
							<p className='text-sm text-muted-foreground leading-relaxed mb-4 max-w-2xl'>
								{step.description}
							</p>
							<div className='flex flex-wrap gap-2'>
								{step.details.map((d) => (
									<span
										key={d}
										className='text-[8px] tracking-[1px] uppercase text-muted-foreground border border-border px-2 py-1'
									>
										{d}
									</span>
								))}
							</div>
						</motion.div>
					</div>
				);
			})}
		</div>
	);
}

const stagger = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
	hidden: { opacity: 0, y: 20 },
	visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function SeanceTypePage() {
	return (
		<div className='min-h-screen'>
			{/* ── Hero ── */}
			<section className='-mt-18 relative min-h-[60svh] sm:min-h-[70svh] flex flex-col overflow-hidden'>
				<div className='absolute inset-0'>
					<ImageWithFallback
						src='https://images.unsplash.com/photo-1548681528-6a5c45b66b42'
						alt=''
						className='w-full h-full object-cover brightness-75'
					/>
					<div className='absolute inset-0 bg-linear-to-t from-[rgba(8,5,3,0.92)] via-[rgba(8,5,3,0.45)] to-transparent' />
				</div>

				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className='relative z-10 flex justify-center pt-28'
				>
					<span className='px-4 py-2 text-[10px] tracking-[2px] uppercase text-white font-medium border border-white/30 rounded-full backdrop-blur-sm bg-white/10'>
						Séance Type · Ostéopathie Animalière
					</span>
				</motion.div>

				<div className='flex-1' />

				<div className='relative z-10 px-6 sm:px-10 lg:px-16 pb-10 sm:pb-14'>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className='flex items-center gap-3 mb-4'
					>
						<span className='w-6 h-px bg-primary/70' />
						<span className='text-[10px] tracking-[2px] uppercase text-primary/90'>
							Comment ça se passe
						</span>
					</motion.div>

					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.5 }}
						className='text-6xl sm:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-4'
					>
						Séance<br />
						<span className='font-light text-white/50'>type</span>
					</motion.h1>

					<motion.p
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.65 }}
						className='text-sm text-white/55 leading-relaxed max-w-sm'
					>
						Découvrez le déroulement d&apos;une consultation d&apos;ostéopathie
						animalière, étape par étape.
					</motion.p>
				</div>

				<div className='absolute bottom-0 right-8 w-px h-8 bg-white/15' />
			</section>

			{/* ── Intro ── */}
			<section className='py-20 sm:py-28 bg-white'>
				<div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-16'>
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center'>
						<motion.div
							initial={{ opacity: 0, x: -30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.7 }}
						>
							<div className='flex items-center gap-3 mb-4'>
								<span className='w-5 h-px bg-primary' />
								<span className='text-[9px] tracking-[2px] uppercase text-primary font-semibold'>
									Approche globale
								</span>
							</div>
							<h2 className='text-4xl sm:text-5xl font-black text-foreground leading-none tracking-tight mb-6'>
								Une séance<br />
								<span className='font-light text-primary'>personnalisée</span>
							</h2>
							<div className='space-y-4 text-sm text-muted-foreground leading-relaxed'>
								<p>
									Chaque séance est unique car elle est adaptée aux besoins
									spécifiques de votre animal. Mon objectif est d&apos;identifier
									et de traiter les causes des déséquilibres pour améliorer
									durablement son bien-être.
								</p>
								<p>
									Je travaille en collaboration avec votre vétérinaire pour
									assurer une prise en charge complète et optimale de votre
									compagnon.
								</p>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 30 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.7, delay: 0.15 }}
							className='rounded-2xl overflow-hidden aspect-4/3 w-full'
						>
							<ImageWithFallback
								src='https://images.unsplash.com/photo-1548681528-6a5c45b66b42'
								alt="Séance d'ostéopathie animalière"
								className='w-full h-full object-cover'
							/>
						</motion.div>
					</div>
				</div>
			</section>

			{/* ── Timeline ── */}
			<section className='py-20 sm:py-28 bg-white border-t border-border'>
				<div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-16'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='mb-12'
					>
						<div className='flex items-center gap-3 mb-4'>
							<span className='w-5 h-px bg-primary' />
							<span className='text-[9px] tracking-[2px] uppercase text-primary font-semibold'>
								Déroulement
							</span>
						</div>
						<h2 className='text-4xl sm:text-5xl font-black text-foreground leading-none tracking-tight'>
							Les étapes<br />
							<span className='font-light text-primary'>de la séance</span>
						</h2>
					</motion.div>

					<TimelineSteps />
				</div>
			</section>

			{/* ── Points importants + Préparation (dark, fusionné) ── */}
			<section className='py-20 sm:py-28 bg-[#111]'>
				<div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-16'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='mb-12'
					>
						<div className='flex items-center gap-3 mb-4'>
							<span className='w-5 h-px bg-primary/70' />
							<span className='text-[9px] tracking-[2px] uppercase text-primary/80 font-semibold'>
								À savoir
							</span>
						</div>
						<h2 className='text-4xl sm:text-5xl font-black text-white leading-none tracking-tight'>
							Avant &amp; après<br />
							<span className='font-light text-white/45'>la séance</span>
						</h2>
					</motion.div>

					{/* Points importants */}
					<motion.div
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}
						variants={stagger}
						className='grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/5 mb-12'
					>
						{importantPoints.map((pt) => (
							<motion.div
								key={pt.label}
								variants={fadeUp}
								className='bg-[#111] p-6 sm:p-8'
							>
								<div className='text-[9px] tracking-[2px] uppercase text-primary font-semibold mb-3'>
									{pt.label}
								</div>
								<p className='text-sm text-white/60 leading-relaxed'>{pt.text}</p>
							</motion.div>
						))}
					</motion.div>

					{/* Avant / Après */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
						{[
							{ title: 'Avant la séance', items: preparation.avant },
							{ title: 'Après la séance', items: preparation.apres },
						].map(({ title, items }) => (
							<motion.div
								key={title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.6 }}
							>
								<h3 className='text-[11px] tracking-[2px] uppercase text-white/50 font-semibold mb-5'>
									{title}
								</h3>
								<div className='space-y-0 divide-y divide-white/5'>
									{items.map((item) => (
										<div key={item} className='flex items-start gap-4 py-3'>
											<span className='w-1 h-1 rounded-full bg-primary mt-2 shrink-0' />
											<span className='text-sm text-white/60 leading-relaxed'>{item}</span>
										</div>
									))}
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ── FAQ ── */}
			<section className='py-20 sm:py-28 bg-white'>
				<div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-16'>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='mb-10'
					>
						<div className='flex items-center gap-3 mb-4'>
							<span className='w-5 h-px bg-primary' />
							<span className='text-[9px] tracking-[2px] uppercase text-primary font-semibold'>
								Questions fréquentes
							</span>
						</div>
						<h2 className='text-4xl sm:text-5xl font-black text-foreground leading-none tracking-tight'>
							Vos<br />
							<span className='font-light text-primary'>questions</span>
						</h2>
					</motion.div>

					<motion.div
						initial='hidden'
						whileInView='visible'
						viewport={{ once: true }}
						variants={stagger}
						className='divide-y divide-border'
					>
						{faqs.map((faq, i) => (
							<motion.div key={i} variants={fadeUp} className='py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-16'>
								<h3 className='text-base font-bold text-foreground leading-snug'>
									{faq.q}
								</h3>
								<p className='text-sm text-muted-foreground leading-relaxed'>
									{faq.a}
								</p>
							</motion.div>
						))}
					</motion.div>
				</div>
			</section>

			{/* ── CTA ── */}
			<section className='py-16 sm:py-20 bg-white'>
				<div className='max-w-7xl mx-auto px-6 sm:px-8 lg:px-16'>
					<motion.div
						initial={{ opacity: 0, scale: 0.98 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className='relative bg-[#111] rounded-2xl sm:rounded-3xl px-8 sm:px-16 py-14 sm:py-20 text-center overflow-hidden'
					>
						<div className='absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none' />

						<p className='text-[9px] tracking-[2px] uppercase text-primary/70 mb-4'>
							Prêt à commencer ?
						</p>
						<h2 className='text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-none tracking-tight mb-4'>
							Réservons<br />
							<span className='font-light text-white/50'>une séance</span>
						</h2>
						<p className='text-sm text-white/40 mb-8 max-w-md mx-auto leading-relaxed'>
							Prenez rendez-vous pour une consultation personnalisée à domicile.
						</p>
						<Link
							href='/contact'
							className='inline-flex items-center gap-2 bg-primary hover:bg-primary/85 text-white text-[10px] font-bold tracking-[2px] uppercase px-8 py-4 transition-colors'
						>
							Prendre rendez-vous
							<ArrowRight className='h-4 w-4' />
						</Link>
					</motion.div>
				</div>
			</section>
		</div>
	);
}
