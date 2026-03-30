'use client';

import { Briefcase, Clock, MapPin, Radius } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

type HomeContentProps = {
	stats: {
		services: number;
		departments: number;
		actionRadius?: number;
		openDays?: number;
	};
};

const statCards = (stats: HomeContentProps['stats']) => [
	{
		icon: Briefcase,
		value: stats.services,
		label: 'Services',
		color: 'text-sky-600',
		bg: 'bg-sky-50',
		border: 'border-sky-200',
		top: 'bg-sky-500',
	},
	{
		icon: Clock,
		value: stats.openDays ?? '—',
		label: 'Jours ouverts',
		color: 'text-violet-600',
		bg: 'bg-violet-50',
		border: 'border-violet-200',
		top: 'bg-violet-500',
	},
	{
		icon: Radius,
		value: stats.actionRadius ? `${stats.actionRadius} km` : '—',
		label: "Rayon d'action",
		color: 'text-amber-600',
		bg: 'bg-amber-50',
		border: 'border-amber-200',
		top: 'bg-amber-500',
	},
	{
		icon: MapPin,
		value: stats.departments,
		label: 'Départements',
		color: 'text-emerald-600',
		bg: 'bg-emerald-50',
		border: 'border-emerald-200',
		top: 'bg-emerald-500',
	},
];

const quickLinks = [
	{
		href: '/services',
		icon: Briefcase,
		label: 'Gérer les services',
		description: 'Modifier les tarifs et descriptions',
	},
	{
		href: '/schedule',
		icon: Clock,
		label: 'Gérer les horaires',
		description: "Modifier les jours et heures d'ouverture",
	},
	{
		href: '/informations',
		icon: MapPin,
		label: 'Informations',
		description: "Zone d'action, coordonnées, adresse",
	},
	{
		href: '/leave',
		icon: Clock,
		label: 'Absences',
		description: 'Planifier des périodes de fermeture',
	},
];

export default function HomeContent({ stats }: HomeContentProps) {
	return (
		<div className='space-y-8'>
			{/* Header */}
			<div>
				<div className='flex items-center gap-3 mb-1'>
					<span className='w-4 h-px bg-primary/60' />
					<span className='text-[9px] tracking-[2px] uppercase text-primary/80 font-semibold'>
						Vue d&apos;ensemble
					</span>
				</div>
				<h1 className='text-2xl font-black text-foreground tracking-tight'>
					Tableau de bord
				</h1>
			</div>

			{/* Stats */}
			<div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
				{statCards(stats).map((card, i) => (
					<motion.div
						key={card.label}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: i * 0.06 }}
						className='border border-border bg-white overflow-hidden'
					>
						<div className={`h-1 w-full ${card.top}`} />
						<div className='p-5'>
							<div className={`w-8 h-8 border ${card.border} ${card.bg} flex items-center justify-center mb-4`}>
								<card.icon className={`w-4 h-4 ${card.color}`} />
							</div>
							<div className='text-3xl font-black text-foreground tracking-tight mb-1'>
								{card.value}
							</div>
							<div className='text-[10px] tracking-[1.5px] uppercase text-muted-foreground'>
								{card.label}
							</div>
						</div>
					</motion.div>
				))}
			</div>

			{/* Quick links */}
			<div>
				<div className='flex items-center gap-3 mb-4'>
					<span className='w-4 h-px bg-primary/60' />
					<span className='text-[9px] tracking-[2px] uppercase text-primary/80 font-semibold'>
						Accès rapides
					</span>
				</div>
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
					{quickLinks.map((link, i) => (
						<motion.div
							key={link.href}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.24 + i * 0.06 }}
						>
							<Link
								href={link.href}
								className='flex items-center gap-4 p-4 border border-border bg-white hover:border-primary/40 hover:bg-primary/3 transition-colors group'
							>
								<div className='w-8 h-8 border border-primary/20 bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:border-primary transition-colors'>
									<link.icon className='w-4 h-4 text-primary group-hover:text-white transition-colors' />
								</div>
								<div>
									<div className='text-sm font-semibold text-foreground group-hover:text-primary transition-colors'>
										{link.label}
									</div>
									<div className='text-xs text-muted-foreground'>
										{link.description}
									</div>
								</div>
							</Link>
						</motion.div>
					))}
				</div>
			</div>

			{/* Analytics placeholder */}
			<div className='border border-dashed border-border h-64 flex items-center justify-center'>
				<p className='text-[10px] tracking-[2px] uppercase text-muted-foreground/50'>
					Google Analytics — à venir
				</p>
			</div>
		</div>
	);
}
