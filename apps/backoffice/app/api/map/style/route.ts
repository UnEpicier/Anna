import { NextResponse } from 'next/server';

export async function GET() {
	const key = process.env.MAPTILER_API_KEY;
	if (!key) {
		return NextResponse.json({ error: 'Map service unavailable' }, { status: 503 });
	}

	const res = await fetch(
		`https://api.maptiler.com/maps/019c900c-33c6-7117-9201-72b30eef182b/style.json?key=${key}&language=fr`,
		{ next: { revalidate: 3600 } }
	);

	if (!res.ok) {
		return NextResponse.json({ error: 'Map service unavailable' }, { status: 503 });
	}

	const data = await res.json();
	return NextResponse.json(data);
}
