import { NextResponse } from 'next/server';

export async function proxy(_request: Request) {
	// const requestHeaders = new Headers(request.headers);
	// const url = new URL(request.url);

	// const cookieStore = await cookies();

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
