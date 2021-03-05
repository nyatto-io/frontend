import React from 'react';
import { Link } from 'react-router-dom';
import { session } from '../libraries/session';
import { outIf, toBool } from '../misc/helpers';
import { routes } from '../misc/routes';
import styles from '../styles/email-verified.module.css';

type Props = {};

export default function EmailVerified(props: Props) {
	return (
		<div className='h-100vh d-flex align-items-center justify-content-center'>
			<div className={`card ${styles.card}`}>
				<div className='card-body'>
					<h4 className='card-title text-center'>You have verified your email successfully!</h4>
					{outIf(
						!toBool(session.user()),
						<Link to={routes.LOGIN} className='btn btn-success w-100'>
							Go to Login
						</Link>
					)}
				</div>
			</div>
		</div>
	);
}
