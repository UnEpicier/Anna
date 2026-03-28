'use client';

import { useEffect, useRef, useState } from 'react';

export default function MarqueeText({
	children,
}: {
	children: React.ReactNode;
}) {
	const containerRef = useRef<HTMLDivElement>(null);
	const textRef = useRef<HTMLSpanElement>(null);
	const [isOverflowing, setIsOverflowing] = useState(false);

	useEffect(() => {
		const check = () => {
			const container = containerRef.current;
			const text = textRef.current;
			if (container && text) {
				setIsOverflowing(text.scrollWidth > container.clientWidth);
			}
		};

		check();

		const observer = new ResizeObserver(check);
		if (containerRef.current) observer.observe(containerRef.current);

		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={containerRef}
			className='overflow-hidden'
		>
			<span
				ref={textRef}
				className={`inline-block whitespace-nowrap ${isOverflowing ? 'animate-marquee' : ''}`}
			>
				{children}
			</span>
		</div>
	);
}
