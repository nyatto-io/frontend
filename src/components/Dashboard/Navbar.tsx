import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { User } from '../../contracts/User';
import { session } from '../../libraries/session';
import { Notif } from '../../misc/helpers';
import { routes } from '../../misc/routes';
import Search from './Search';
import $ from 'jquery';
import Icon from '../../assets/img/default-avatar.png';

type Props = {};

export default function Navbar(props: Props) {
	const match = useRouteMatch();
	const history = useHistory();
	const user = session.user() as User;
	const [picture, setPicture] = useState(user?.picture?.url || Icon);

	const url = (path: string) => `${match.path}${path}`;

	const logout = async () => {
		try {
			await axios.post('/auth/logout');
		} catch (error) {
			console.log(error.toJSON());
		} finally {
			session.clearAll();
			history.push(routes.LOGIN);
			Notif.info('Logged out successfully.', { align: 'center' });
		}
	};

	useEffect(() => {
		const key = session.listen<User>('user-session', (user) => {
			if (user && user.picture && user.picture.url) {
				setPicture(user.picture.url);
			}
		});
		return () => {
			session.unlisten('user-session', key);
		};
	}, []);

	return (
		<>
			<nav className='navbar navbar-expand-lg navbar-absolute navbar-transparent'>
				<div className='container-fluid'>
					<div className='navbar-wrapper'>
						<div className='navbar-toggle d-inline'>
							<button type='button' className='navbar-toggler'>
								<span className='navbar-toggler-bar bar1'></span>
								<span className='navbar-toggler-bar bar2'></span>
								<span className='navbar-toggler-bar bar3'></span>
							</button>
						</div>
						<Link className='navbar-brand' to={routes.DASHBOARD}>
							Dashboard
						</Link>
					</div>
					<button
						className='navbar-toggler'
						type='button'
						data-toggle='collapse'
						data-target='#navigation'
						aria-expanded='false'
						aria-label='Toggle navigation'>
						<span className='navbar-toggler-bar navbar-kebab'></span>
						<span className='navbar-toggler-bar navbar-kebab'></span>
						<span className='navbar-toggler-bar navbar-kebab'></span>
					</button>
					<div className='collapse navbar-collapse' id='navigation'>
						<ul className='navbar-nav ml-auto'>
							<li className='search-bar input-group'>
								<button
									className='btn btn-link'
									id='search-button'
									onClick={(e) => {
										e.preventDefault();
										$('#searchModal').modal('toggle');
									}}>
									<i className='tim-icons icon-zoom-split'></i>
									<span className='d-lg-none d-md-block text'>Search</span>
								</button>
							</li>
							<li className='dropdown nav-item'>
								<a href='/' className='dropdown-toggle nav-link' data-toggle='dropdown'>
									<div className='notification d-none d-lg-block d-xl-block'></div>
									<i className='tim-icons icon-sound-wave'></i>
									<p className='d-lg-none'>Notifications</p>
								</a>
								<ul className='dropdown-menu dropdown-menu-right dropdown-navbar'>
									{/* <li className='nav-link'>
										<a href='/' className='nav-item dropdown-item'>
											Mike John responded to your email
										</a>
									</li>
									<li className='nav-link'>
										<a href='/' className='nav-item dropdown-item'>
											You have 5 more tasks
										</a>
									</li>
									<li className='nav-link'>
										<a href='/' className='nav-item dropdown-item'>
											Your friend Michael is in town
										</a>
									</li>
									<li className='nav-link'>
										<a href='/' className='nav-item dropdown-item'>
											Another notification
										</a>
									</li>
									<li className='nav-link'>
										<a href='/' className='nav-item dropdown-item'>
											Another one
										</a>
									</li> */}
								</ul>
							</li>
							<li className='dropdown nav-item'>
								<a href='/' className='dropdown-toggle nav-link' data-toggle='dropdown'>
									<div className='photo'>
										<img src={picture} alt='Profile' className='border shadow' />
									</div>
									<b className='caret d-none d-lg-block d-xl-block'></b>
									<p className='d-lg-none'>Account</p>
								</a>
								<ul className='dropdown-menu dropdown-navbar'>
									<li className='nav-link'>
										<Link to={url(routes.PROFILE)} className='nav-item dropdown-item'>
											Profile
										</Link>
									</li>
									<li className='nav-link'>
										<Link to={url(routes.SETTINGS)} className='nav-item dropdown-item'>
											Settings
										</Link>
									</li>
									<li className='dropdown-divider'></li>
									<li className='nav-link'>
										<a
											href={url(routes.LOGOUT)}
											className='nav-item dropdown-item'
											onClick={(e) => {
												e.preventDefault();
												logout();
											}}>
											Log out
										</a>
									</li>
								</ul>
							</li>
							<li className='separator d-lg-none'></li>
						</ul>
					</div>
				</div>
			</nav>
			<Search />
		</>
	);
}
