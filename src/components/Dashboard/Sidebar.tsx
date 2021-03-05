import React, { useContext } from 'react';
import { Link, useRouteMatch } from 'react-router-dom';
import { ColorContext } from '../../libraries/contexts';
import { routes } from '../../misc/routes';
import RouterLink from './RouterLink';
import Icon from '../../assets/img/logo.svg';
import { APP_NAME } from '../../misc/constants';

type Props = {};

export default function Sidebar(props: Props) {
	const match = useRouteMatch();

	const { color } = useContext(ColorContext);

	const url = (path: string) => `${match.path}${path}`;
	const links = [
		{
			to: url(''),
			title: 'Dashboard',
			icon: 'tim-icons icon-chart-pie-36',
			exact: true,
		},
		{
			to: url(routes.ANIME),
			title: 'Anime',
			icon: 'tim-icons icon-tv-2',
			exact: false,
		},
		{
			to: url(routes.MANGA),
			title: 'Manga',
			icon: 'tim-icons icon-book-bookmark',
			exact: false,
		},
		{
			to: url(routes.FAVORITES),
			title: 'Favorites',
			icon: 'tim-icons icon-tag',
			exact: false,
		},
		{
			to: url(routes.PROFILE),
			title: 'Profile',
			icon: 'tim-icons icon-single-02',
			exact: false,
		},
	];

	return (
		<div className='sidebar' data-color={color}>
			<div className='sidebar-wrapper'>
				<div className='logo'>
					<Link to={routes.DASHBOARD} className='simple-text logo-mini'>
						<img src={Icon} alt='Home App' className='img-fluid rounded-circle' />
					</Link>
					<Link to={routes.DASHBOARD} className='simple-text logo-normal'>
						{APP_NAME}
					</Link>
				</div>
				<ul className='nav'>
					{links.map((link, index) => (
						<RouterLink {...link} key={index} />
					))}
					<li className='active-pro'>
						<Link to={url(routes.SETTINGS)}>
							<i className='fas fa-cog'></i>
							<p>Settings</p>
						</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}
