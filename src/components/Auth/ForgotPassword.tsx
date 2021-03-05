import axios from 'axios';
import faker from 'faker';
import React, { FC, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { ColorContext } from '../../libraries/contexts';
import { EMAIL_REGEX, ColorMap } from '../../misc/constants';
import { handleError, Notif, outIf, toBool } from '../../misc/helpers';
import { routes } from '../../misc/routes';
import styles from '../../styles/auth.module.css';

type Props = {};

type Inputs = {
	email: string;
};

const ForgotPassword: FC<Props> = (props) => {
	const [processing, setProcessing] = useState(false);
	const [sent, setSent] = useState(false);
	const { handleSubmit, register, errors } = useForm<Inputs>();
	const { color } = useContext(ColorContext);

	const submit = async (data: Inputs) => {
		if (sent) {
			return;
		}
		setProcessing(true);
		try {
			const response = await axios.post<{ status: string }>('/auth/forgot-password', data);
			Notif.info(response.data.status, { align: 'center' });
			setSent(true);
		} catch (error) {
			console.log(error.toJSON());
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	return (
		<div className='h-100vh d-flex align-items-center justify-content-center'>
			<div className={`card shadow py-1 ${styles.card}`}>
				<div className='card-body'>
					<h3 className='card-title text-center mt-1'>Forgot Password</h3>
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
									processing || sent,
									'disabled'
								)}`}
								disabled={processing || sent}
							/>
							{outIf(toBool(errors.email), <div className='invalid-feedback'>Please provide a valid email.</div>)}
						</div>
						<div className='form-group'>
							<button
								type='submit'
								className={`btn btn-${ColorMap[color]} w-100 d-flex align-items-center justify-content-center ${outIf(
									processing || sent,
									'disabled'
								)}`}
								disabled={processing || sent}>
								{sent ? 'Email Sent' : processing ? <i className='fas fa-circle-notch fa-spin'></i> : 'Submit'}
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

export default ForgotPassword;
