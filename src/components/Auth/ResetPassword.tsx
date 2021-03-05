import axios from 'axios';
import React, { FC, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { ColorContext } from '../../libraries/contexts';
import { ColorMap } from '../../misc/constants';
import { handleError, Notif, outIf, toBool } from '../../misc/helpers';
import { routes } from '../../misc/routes';
import styles from '../../styles/auth.module.css';

type Props = {};

type Inputs = {
	password: string;
	password_confirmation: string;
};

type Match = {
	token: string;
};

const ResetPassword: FC<Props> = (props) => {
	const history = useHistory();
	const url = new URLSearchParams(history.location.search);
	const { params } = useRouteMatch<Match>();
	const token = params.token;
	const email = url.get('email');
	const [processing, setProcessing] = useState(false);
	const { handleSubmit, register, errors, setValue } = useForm<Inputs>();
	const { color } = useContext(ColorContext);

	const submit = async (data: Inputs) => {
		setProcessing(true);
		try {
			const response = await axios.post<{ status: string }>('/auth/reset-password', {
				...data,
				token,
				email,
			});
			Notif.info(response.data.status, { align: 'center' });
			history.push(routes.LOGIN);
		} catch (error) {
			console.log(error.toJSON());
			handleError(error);
		} finally {
			setProcessing(false);
			setValue('password', '');
			setValue('password_confirmation', '');
		}
	};

	if (!email) {
		history.goBack();
		return null;
	}

	return (
		<div className='h-100vh d-flex align-items-center justify-content-center'>
			<div className={`card shadow py-1 ${styles.card}`}>
				<div className='card-body'>
					<h3 className='card-title text-center mt-1'>Reset Password</h3>
					<form onSubmit={handleSubmit(submit)}>
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
							<label htmlFor='password_confirmation'>Confirm Password</label>
							<input
								type='password'
								name='password_confirmation'
								id='password_confirmation'
								ref={register({
									required: true,
								})}
								placeholder='Confirm Password'
								className={`form-control mb-0 ${outIf(toBool(errors.password_confirmation), 'is-invalid')} ${outIf(
									processing,
									'disabled'
								)}`}
								disabled={processing}
							/>
							{outIf(
								toBool(errors.password_confirmation),
								<div className='invalid-feedback'>Please provide a confirm password.</div>
							)}
						</div>
						<div className='form-group'>
							<button
								type='submit'
								className={`btn btn-${ColorMap[color]} w-100 d-flex align-items-center justify-content-center ${outIf(
									processing,
									'disabled'
								)}`}
								disabled={processing}>
								{processing ? <i className='fas fa-circle-notch fa-spin'></i> : 'Reset Password'}
							</button>
						</div>
						<div className='form-group d-flex'>
							<Link to={routes.REGISTER} className={`btn btn-link btn-${ColorMap[color]} mx-auto`}>
								<small>Go back to login.</small>
							</Link>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;
