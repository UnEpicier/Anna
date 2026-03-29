export default function MarqueeText({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='overflow-hidden'>
			<div className='animate-marquee inline-flex whitespace-nowrap'>
				<span className='pr-24'>{children}</span>
				<span
					className='pr-24'
					aria-hidden='true'
				>
					{children}
				</span>
			</div>
		</div>
	);
}
