export type ResponseObject<T = null> = {
	success: boolean;
	message: string;
	statusCode: number;
	responseObject: T;
};

export type Informations = {
	id: number;
	email: string;
	phone: string;
	address: string;
	actionAddress: string;
	actionLong: number;
	actionLat: number;
	actionRadius: number;
	facebook: string;
	instagram: string;
	notifyLeave: string;
};

export type Service = {
	id: number;
	title: string;
	description: string;
	icon: string;
	price: number;
	duration: string;
	enabled: boolean;
};

export type Department = {
	id: number;
	name: string;
	geojson: Record<string, any>;
	active: boolean;
};

export type Schedule = {
	day: string;
	startTime: string;
	endTime: string;
	open: boolean;
};
