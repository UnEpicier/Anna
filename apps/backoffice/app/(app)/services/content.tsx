'use client';

import type { Service } from '@repo/app-types';
import { Button } from '@repo/ui';
import { Plus } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { type FormEvent, useCallback, useState } from 'react';
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
		async (ev: FormEvent<HTMLFormElement>) => {
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
			icon: 'Paw',
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
					className='flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-md bg-gray-100/50 hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer'
					onClick={addService}
				>
					<Plus />
					Ajouter un service
				</button>
			</div>

			<div className='pt-4 border-t border-gray-200'>
				<Button
					type='submit'
					className='bg-linear-to-r from-[#7f5539] to-[#5a3a26] hover:shadow-lg hover:shadow-[#7f5539]/20 transition-all duration-200 cursor-pointer'
				>
					Enregistrer les modifications
				</Button>
			</div>
		</form>
	);
}
