import { type NextRequest, NextResponse } from 'next/server';

async function handler(req: NextRequest, ctx: RouteContext<'/api/[...path]'>) {
	const path = (await ctx.params).path.join('/');
	const url = new URL(req.url);

	const backendUrl = `${process.env.API_URL}/${path}${url.search}`;

	const res = await fetch(backendUrl, {
		method: req.method,
		headers: {
			'Content-Type': 'application/json',
			Authorization: req.headers.get('Authorization') ?? '',
		},
		body:
			req.method !== 'GET' && req.method !== 'HEAD'
				? await req.text()
				: undefined,
	});

	try {
		const data = await res.json();
		return NextResponse.json(data, { status: res.status });
	} catch (_error) {
		const text = await res.text();
		return new NextResponse(text, { status: res.status });
	}
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
