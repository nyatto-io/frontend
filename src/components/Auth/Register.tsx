import React, { useContext, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import faker from 'faker';
import styles from '../../styles/auth.module.css';
import Logo from '../../assets/img/logo.svg';
import { routes } from '../../misc/routes';
import { handleError, Notif, outIf, toBool } from '../../misc/helpers';
import { ColorMap, EMAIL_REGEX } from '../../misc/constants';
import axios from 'axios';
import { User as UserContract } from '../../contracts/User';
import { ColorContext } from '../../libraries/contexts';
import { session } from '../../libraries/session';

type Props = {};

type Inputs = {
	name: string;
	email: string;
	password: string;
};

export default function Register(props: Props) {
	const history = useHistory();
	const [processing, setProcessing] = useState(false);
	const { register, handleSubmit, errors } = useForm<Inputs>();

	const { color } = useContext(ColorContext);

	if (session.user()) {
		history.push(routes.DASHBOARD);
		return <div></div>;
	}

	const submit = async (data: Inputs) => {
		setProcessing(true);
		try {
			await axios.post<UserContract>('/auth/register', data);

			Notif.success('Registered successfully. Please check your email for verification.', { align: 'center' });
		} catch (error) {
			console.log(error.toJSON());
			handleError(error, { align: 'center' });
		} finally {
			setProcessing(false);
		}
	};

	return (
		<div className='h-100vh d-flex align-items-center justify-content-center'>
			<div className={`card shadow py-1 ${styles.card}`}>
				<div className='card-body'>
					<div className='d-flex align-items-center justify-content-center'>
						<img
							src={Logo}
							alt='Logo'
							className={`rounded-circle clickable ${styles.icon}`}
							onClick={(e) => {
								e.preventDefault();
								history.push(routes.HOME);
							}}
						/>
					</div>
					<h3 className='card-title text-center mt-1'>Register</h3>
					<form onSubmit={handleSubmit(submit)}>
						<div className='form-group'>
							<label htmlFor='name'>Name</label>
							<input
								type='text'
								name='name'
								id='name'
								ref={register({ required: true })}
								placeholder={faker.name.findName()}
								className={`form-control mb-0 ${outIf(toBool(errors.name), 'is-invalid')} ${outIf(processing, 'disabled')}`}
								disabled={processing}
							/>
							{outIf(toBool(errors.name), <div className='invalid-feedback'>Please provide your name.</div>)}
						</div>
						<div className='form-group'>
							<label htmlFor='email'>Email</label>
							<input
								type='email'
								name='email'
								id='email'
								ref={register({ required: true, pattern: EMAIL_REGEX })}
								autoComplete='email'
								placeholder={faker.internet.exampleEmail().toLowerCase()}
								className={`form-control mb-0 ${outIf(toBool(errors.email), 'is-invalid')} ${outIf(
									processing,
									'disabled'
								)}`}
								disabled={processing}
							/>
							{outIf(toBool(errors.email), <div className='invalid-feedback'>Please provide a valid email.</div>)}
						</div>
						<div className='form-group'>
							<label htmlFor='password'>Password</label>
							<input
								type='password'
								name='password'
								id='password'
								ref={register({ required: true })}
								placeholder='Password'
								className={`form-control mb-0 ${outIf(toBool(errors.password), 'is-invalid')} ${outIf(
									processing,
									'disabled'
								)}`}
								disabled={processing}
							/>
							{outIf(toBool(errors.password), <div className='invalid-feedback'>Please provide a password.</div>)}
						</div>
						<div className='form-group'>
							<button
								type='submit'
								className={`btn btn-${ColorMap[color]} w-100 d-flex align-items-center justify-content-center ${outIf(
									processing,
									'disabled'
								)}`}
								disabled={processing}>
								{processing ? <i className='fas fa-circle-notch fa-spin'></i> : 'Register'}
							</button>
						</div>
						<div className='form-group text-center'>
							<Link to={routes.LOGIN} className={`btn btn-link btn-${ColorMap[color]}`}>
								Already have an account? Login
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
