import { type NextRequest, NextResponse } from 'next/server';

const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const ALLOWED_ORIGINS = new Set([
	process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001',
]);

function isCsrfSafe(req: NextRequest): boolean {
	if (!MUTATING_METHODS.has(req.method)) return true;
	const origin = req.headers.get('origin');
	if (!origin) return false;
	return ALLOWED_ORIGINS.has(origin);
}

async function handler(req: NextRequest, ctx: RouteContext<'/api/[...path]'>) {
	if (!isCsrfSafe(req)) {
		return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
	}

	const path = (await ctx.params).path.join('/');
	const url = new URL(req.url);

	const backendUrl = `${process.env.API_URL}/${path}${url.search}`;

	const res = await fetch(backendUrl, {
		method: req.method,
		headers: {
			'Content-Type': 'application/json',
			Authorization: req.headers.get('Authorization') ?? '',
			Cookie: req.headers.get('Cookie') ?? '',
		},
		body:
			req.method !== 'GET' && req.method !== 'HEAD'
				? await req.text()
				: undefined,
	});

	const setCookieHeaders = res.headers.getSetCookie?.() ?? [];

	let response: NextResponse;
	try {
		const data = await res.json();
		response = NextResponse.json(data, { status: res.status });
	} catch (_error) {
		const text = await res.text();
		response = new NextResponse(text, { status: res.status });
	}

	for (const cookie of setCookieHeaders) {
		response.headers.append('Set-Cookie', cookie);
	}

	return response;
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
