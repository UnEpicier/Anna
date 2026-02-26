import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function proxy(request: Request) {
	const requestHeaders = new Headers(request.headers);
	const url = new URL(request.url);

	const cookieStore = await cookies();

	// if (url.pathname !== '/auth/login') {
	// 	if (!cookieStore.has('token')) {
	// 		NextResponse.redirect('/auth/login');
	// 	}
	// } else if (url.pathname === '/auth/login') {
	// 	if (cookieStore.has('token')) {
	// 		NextResponse.redirect('/');
	// 	}
	// }

	return NextResponse.next();
}
