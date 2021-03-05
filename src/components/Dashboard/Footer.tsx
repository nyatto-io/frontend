import React, { useContext } from 'react';
import { ColorContext } from '../../libraries/contexts';
import { ColorMap } from '../../misc/constants';

type Props = {};

export default function Footer(props: Props) {
	const { color } = useContext(ColorContext);

	return (
		<footer className='footer'>
			<div className='container-fluid'>
				<ul className='nav'>
					<li className='nav-item'>
						<a href='https://github.com/avidianity' className='nav-link' target='_blank' rel='noreferrer'>
							Avidianity
						</a>
					</li>
					<li className='nav-item'>
						<a href='https://github.com/avidianity/home' className='nav-link' target='_blank' rel='noreferrer'>
							Github
						</a>
					</li>
				</ul>
				<div className='copyright'>
					©{new Date().getFullYear()} made with <i className='tim-icons icon-heart-2'></i> by{' '}
					<a href='https://github.com/avidianity' target='_blank' rel='noreferrer' className={`text-${ColorMap[color]}`}>
						John Michael Manlupig
					</a>{' '}
					for a better web.
				</div>
			</div>
		</footer>
	);
}
