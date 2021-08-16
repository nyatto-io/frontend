import React, { useContext, useState } from 'react';
import styles from '../../styles/auth.module.css';
import Logo from '../../assets/img/logo.svg';
import faker from 'faker';
import { Link, useHistory } from 'react-router-dom';
import { routes } from '../../misc/routes';
import { useForm } from 'react-hook-form';
import { ColorMap, EMAIL_REGEX } from '../../misc/constants';
import { handleError, Notif, outIf, toBool } from '../../misc/helpers';
import axios, { AxiosError } from 'axios';
import { User } from '../../contracts/User';
import { session } from '../../libraries/session';
import { ColorContext } from '../../libraries/contexts';

type Props = {};

type Inputs = {
	email: string;
	password: string;
};

export default function Login(props: Props) {
	const history = useHistory();
	const [processing, setProcessing] = useState(false);
	const [verifiable, setVerifiable] = useState(false);
	const [credentials, setCredentials] = useState({ email: '', password: '' });
	const [resent, setResent] = useState(false);
	const { register, handleSubmit, errors } = useForm<Inputs>();
	const { color } = useContext(ColorContext);

	if (session.user()) {
		history.push(routes.DASHBOARD);
		return <div></div>;
	}

	const submit = async (data: Inputs) => {
		setProcessing(true);
		setCredentials(data);
		try {
			const response = await axios.post<{ user: User; token: string }>('/auth/login', data);

			const { user, token } = response.data;

			session.user(user);
			session.token(token);
			Notif.success(`Welcome back, ${user.name}`);
			history.push(routes.DASHBOARD);
		} catch (error) {
			const e = error as AxiosError;
			if (e.response && e.response.status === 418) {
				setVerifiable(true);
				setResent(false);
			}
			handleError(error, { align: 'center' });
		} finally {
			setProcessing(false);
		}
	};

	const resendEmail = async () => {
		setResent(true);
		try {
			await axios.post('/auth/resend-email', credentials);
		} catch (error: any) {
			console.log(error.toJSON());
			Notif.error('Unable to resend verification email.', { align: 'center' });
			setResent(false);
			setVerifiable(false);
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
					<h3 className='card-title text-center mt-1'>Login</h3>
					<form onSubmit={handleSubmit(submit)}>
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
						{outIf(
							verifiable,
							<div className='form-group'>
								{resent ? (
									<span className='text-muted font-italic'>Verification Email Sent</span>
								) : (
									<a
										href='/resend-email'
										onClick={async (e) => {
											e.preventDefault();
											await resendEmail();
										}}>
										Resend Verification Email
									</a>
								)}
							</div>
						)}
						<div className='form-group'>
							<button
								type='submit'
								className={`btn btn-${ColorMap[color]} w-100 d-flex align-items-center justify-content-center ${outIf(
									processing,
									'disabled'
								)}`}
								disabled={processing}>
								{processing ? <i className='fas fa-circle-notch fa-spin'></i> : 'Login'}
							</button>
						</div>
						<div className='form-group d-flex'>
							<Link to={routes.REGISTER} className={`btn btn-link btn-${ColorMap[color]} mr-auto`}>
								<small>Dont have an account? Register</small>
							</Link>
							<Link to={routes.FORGOT_PASSWORD} className={`btn btn-link btn-${ColorMap[color]} ml-auto`}>
								<small>Forgot Password?</small>
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
