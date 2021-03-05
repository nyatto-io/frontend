import React from 'react';

type Props = {
	className?: string;
};

export default function SplashMini({ className }: Props) {
	return (
		<div className={`d-flex align-items-center justify-content-center splash ${className}`}>
			<i className='fas fa-4x fa-circle-notch fa-spin text-white'></i>
		</div>
	);
}
