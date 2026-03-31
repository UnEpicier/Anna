'use client';

import type { Service } from '@repo/app-types';
import { Button } from '@repo/ui';
import { Plus } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useCallback, useState } from 'react';
import type React from 'react';
import { toast } from 'sonner';
import ServiceCard from './components/ServiceCard';

export default function ServicesContent({
	services: dbServices,
}: {
	services: Service[];
}) {
	const [services, setServices] = useState<Service[]>(dbServices ?? []);
	const [deletedIds, setDeletedIds] = useState<number[]>([]);

	const onSubmit = useCallback(
		async (ev: React.FormEvent<HTMLFormElement>) => {
			ev.preventDefault();
			if (!ev.currentTarget.reportValidity()) return;

			const servicesToUpdate = services
				.filter((s) => 'toUpdate' in s && !('toCreate' in s))
				.map((x) => {
					const {
						createdAt: _,
						updatedAt: __,
						toUpdate: ___,
						...serviceData
					} = x as Service & { toUpdate?: boolean };
					return serviceData;
				});

			const servicesToCreate = services
				.filter((s) => 'toCreate' in s)
				.map((x) => {
					const {
						id: _,
						createdAt: __,
						updatedAt: ___,
						toCreate: ____,
						toUpdate: _____,
						...serviceData
					} = x as Service & {
						toCreate?: boolean;
						toUpdate?: boolean;
					};
					return serviceData;
				});

			if (
				servicesToUpdate.length === 0 &&
				servicesToCreate.length === 0 &&
				deletedIds.length === 0
			) {
				toast.warning('Aucun changement à enregistrer.', {
					icon: '⚠️',
				});
				return;
			}

			const promises = [];

			if (servicesToCreate.length > 0) {
				const createRequest = fetch('/api/services', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(servicesToCreate),
				});

				promises.push(createRequest);
				toast.promise(createRequest, {
					loading: 'Création des services...',
					success: 'Services créés avec succès !',
					error: 'Erreur lors de la création des services.',
				});
			}

			if (servicesToUpdate.length > 0) {
				const updateRequest = fetch('/api/services', {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(servicesToUpdate),
				});

				promises.push(updateRequest);
				toast.promise(updateRequest, {
					loading: 'Mise à jour des services...',
					success: 'Services mis à jour avec succès !',
					error: 'Erreur lors de la mise à jour des services.',
				});
			}

			if (deletedIds.length > 0) {
				for (const id of deletedIds) {
					const deleteRequest = fetch(`/api/services/${id}`, {
						method: 'DELETE',
					});
					promises.push(deleteRequest);
					toast.promise(deleteRequest, {
						loading: 'Suppression des services...',
						success: 'Services supprimés avec succès !',
						error: 'Erreur lors de la suppression des services.',
					});
				}
			}

			await Promise.all(promises);

			const newServicesRequest = await fetch('/api/services');
			const newServicesData = await newServicesRequest.json();

			if (newServicesData.success) {
				setServices(newServicesData.responseObject);
				setDeletedIds([]);
			} else {
				toast.error('Erreur lors du rafraîchissement des services.');
			}
		},
		[services, deletedIds]
	);

	const updateService = useCallback(
		(id: number, field: keyof Service, value: any) => {
			setServices((prev) => {
				const serviceIndex = prev.findIndex((s) => s.id === id);
				if (serviceIndex === -1) return prev;

				const updatedServices = [...prev];
				updatedServices[serviceIndex] = {
					...updatedServices[serviceIndex],
					[field]: value,
				} as Service;

				if (!('new' in updatedServices[serviceIndex])) {
					(
						updatedServices[serviceIndex] as Service & {
							toUpdate?: boolean;
						}
					).toUpdate = true;
				}

				return updatedServices;
			});
		},
		[]
	);

	const deleteService = useCallback(
		(id: number) => {
			setServices((prev) => prev.filter((s) => s.id !== id));
			const service = services.find((s) => s.id === id);
			if (service && !('toCreate' in service)) {
				setDeletedIds((d) => [...d, id]);
			}
		},
		[services]
	);

	const addService = useCallback(() => {
		const newService: Service & {
			toCreate: boolean;
		} = {
			id: Date.now(), // Temporary ID, replace with real one from backend
			title: '',
			emoji: '',
			shortDescription: '',
			description: '',
			duration: '',
			price: 0,
			enabled: true,
			toCreate: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		setServices((prev) => [...prev, newService as Service]);
	}, []);

	return (
		<form
			onSubmit={onSubmit}
			className='space-y-6'
		>
			<div className='grid gap-6'>
				<AnimatePresence>
					{services.map((service, index) => (
						<ServiceCard
							key={service.id}
							index={index}
							service={service}
							updateService={updateService}
							deleteService={deleteService}
						/>
					))}
				</AnimatePresence>

				<button
					type='button'
					className='flex items-center justify-center gap-2 p-4 border border-dashed border-border hover:border-primary/40 hover:bg-primary/3 text-muted-foreground hover:text-primary transition-colors'
					onClick={addService}
				>
					<Plus className='w-4 h-4' />
					<span className='text-sm'>Ajouter un service</span>
				</button>
			</div>

			<div className='pt-4 border-t border-border'>
				<Button
					type='submit'
					className='bg-primary hover:bg-primary/85 text-white'
				>
					Enregistrer les modifications
				</Button>
			</div>
		</form>
	);
}
