import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { APP_NAME } from '../../misc/constants';
import { routes } from '../../misc/routes';
import Logo from '../../assets/img/logo.svg';

type Props = {};

const Navbar: FC<Props> = (props) => {
	return (
		<nav className='navbar navbar-expand-lg'>
			<Link className='navbar-brand' to={routes.HOME}>
				<div className='align-top d-flex'>
					<img src={Logo} width='30' height='30' className='d-inline-block align-self-center' alt='Nyatto' />
					<span className='align-self-center ml-1'>{APP_NAME}</span>
				</div>
			</Link>
			<button
				className='navbar-toggler'
				type='button'
				data-toggle='collapse'
				data-target='#navbarSupportedContent'
				aria-controls='navbarSupportedContent'
				aria-expanded='false'
				aria-label='Toggle navigation'>
				<i className='fas fa-ellipsis-v'></i>
			</button>

			<div className='collapse navbar-collapse' id='navbarSupportedContent'>
				<ul className='navbar-nav ml-auto'>
					<li className='nav-item'>
						<Link className='nav-link' to={routes.LOGIN}>
							<i className='fas fa-sign-in-alt mr-1'></i>
							Login
						</Link>
					</li>
					<li className='nav-item'>
						<Link className='nav-link' to={routes.REGISTER}>
							<i className='fas fa-user mr-1'></i>
							Register
						</Link>
					</li>
				</ul>
			</div>
		</nav>
	);
};

export default Navbar;
