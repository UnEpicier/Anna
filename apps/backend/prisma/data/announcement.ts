import type { Announcement } from '@repo/app-types';

export const announcement: Announcement = {
	id: 1,
	enabled: false,
	title: null,
	message: "Message d'annonce",
	ctaLabel: null,
	ctaUrl: null,
	ctaOpenInNewTab: false,
	createdAt: new Date(),
	updatedAt: new Date(),
};
