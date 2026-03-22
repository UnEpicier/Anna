import { type NextRequest, NextResponse } from 'next/server';

function buildCsp(nonce: string): string {
	const directives = [
		"default-src 'self'",
		`script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
		"style-src 'self' 'unsafe-inline'",
		"img-src 'self' data: blob: https://images.unsplash.com https://api.maptiler.com",
		"connect-src 'self' https://api.maptiler.com",
		"font-src 'self' https://api.maptiler.com",
		"worker-src blob:",
		"frame-ancestors 'none'",
		"base-uri 'self'",
		"form-action 'self'",
	];
	return directives.join('; ');
}

export async function proxy(request: NextRequest) {
	const url = request.nextUrl.clone();

	if (
		url.pathname.startsWith('/_next') ||
		url.pathname.startsWith('/api') ||
		url.pathname.startsWith('/favicon') ||
		url.pathname.match(/\.(.*)$/)
	) {
		return NextResponse.next();
	}

	const isAuthRoute = url.pathname.startsWith('/auth');
	const token = request.cookies.get('token')?.value;

	if (!isAuthRoute) {
		if (!token) {
			url.pathname = '/auth/login';
			return NextResponse.redirect(url);
		}

		try {
			const res = await fetch(`${process.env.API_URL}/auth/check`, {
				method: 'POST',
				headers: { Cookie: `token=${token}` },
			});

			if (!res.ok) {
				url.pathname = '/auth/login';
				return NextResponse.redirect(url);
			}
		} catch {
			url.pathname = '/auth/login';
			return NextResponse.redirect(url);
		}
	} else if (token) {
		url.pathname = '/';
		return NextResponse.redirect(url);
	}

	const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
	const csp = buildCsp(nonce);

	const requestHeaders = new Headers(request.headers);
	requestHeaders.set('x-nonce', nonce);

	const response = NextResponse.next({ request: { headers: requestHeaders } });
	response.headers.set('Content-Security-Policy', csp);

	return response;
}
