'use client';

import { useEffect, useRef, useState } from 'react';

export default function MarqueeText({
	children,
}: {
	children: React.ReactNode;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const measureRef = useRef<HTMLSpanElement>(null);
	const [isOverflowing, setIsOverflowing] = useState(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: children dependencies is needed
	useEffect(() => {
		const container = containerRef.current;
		const measure = measureRef.current;
		if (!container || !measure) return;

		const check = () => {
			setIsOverflowing(measure.offsetWidth > container.clientWidth);
		};

		check();
		const ro = new ResizeObserver(check);
		ro.observe(container);
		return () => ro.disconnect();
	}, [children]);

	return (
		<div
			ref={containerRef}
			className='relative overflow-hidden'
		>
			{/* Span invisible pour mesurer la largeur naturelle du texte */}
			<span
				ref={measureRef}
				className='absolute invisible whitespace-nowrap pointer-events-none'
				aria-hidden='true'
			>
				{children}
			</span>

			{isOverflowing ? (
				<div className='animate-marquee inline-flex whitespace-nowrap'>
					<span className='pr-24'>{children}</span>
					<span
						className='pr-24'
						aria-hidden='true'
					>
						{children}
					</span>
				</div>
			) : (
				<span className='block text-center whitespace-nowrap'>
					{children}
				</span>
			)}
		</div>
	);
}
