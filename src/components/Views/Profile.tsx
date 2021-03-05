import React, { createRef, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User } from '../../contracts/User';
import { ColorContext } from '../../libraries/contexts';
import { session } from '../../libraries/session';
import { ColorMap, EMAIL_REGEX, URL_REGEX } from '../../misc/constants';
import { excludeEmpty, handleError, Notif, only, outIf, toBool } from '../../misc/helpers';
import faker from 'faker';
import { isEmpty } from 'lodash';
import axios from 'axios';
import styles from '../../styles/profile.module.css';
import camera from '../../assets/img/camera.svg';

type Props = {};

type Inputs = {
	name: string;
	email: string;
	facebook: string;
	twitter: string;
	youtube: string;
	password: string;
	old_password: string;
};

export default function Profile(props: Props) {
	const [processing, setProcessing] = useState(false);
	const user = session.user() as User;
	const { color } = useContext(ColorContext);
	const [picture, setPicture] = useState(user?.picture?.url || camera);

	const { register, errors, handleSubmit, getValues } = useForm<Inputs>({
		defaultValues: {
			...(only(user, ['name', 'email', 'facebook', 'twitter', 'youtube']) as any),
		},
	});

	const formRef = createRef<HTMLFormElement>();
	const inputRef = createRef<HTMLInputElement>();

	const submit = async (data: Inputs) => {
		setProcessing(true);
		try {
			const response = await axios.post<User>('/auth/profile', excludeEmpty(data, ['old_password', 'password']));

			session.user(response.data);
			Notif.info('Profile has been updated.');
		} catch (error) {
			console.log(error.toJSON());
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	const uploadProfilePicture = async (file: File) => {
		try {
			const form = new FormData();

			form.append('file', file);

			const { data } = await axios.post<User>('/auth/picture', form);

			session.user(data);
			Notif.info('Profile picture uploaded.');
			setPicture(data.picture?.url || camera);
		} catch (error) {
			console.log(error.toJSON());
			handleError(error);
		} finally {
			formRef.current?.reset();
		}
	};

	return (
		<div className='row'>
			<div className='col-md-8'>
				<div className='card'>
					<div className='card-header'>
						<h5 className='title'>Edit Profile</h5>
					</div>
					<form onSubmit={handleSubmit(submit)}>
						<div className='card-body'>
							<div className='row'>
								<div className='col-12'>
									<h4>Personal Information</h4>
									<div className='form-group'>
										<label className={`${styles.label}`} htmlFor='name'>
											Name
											<i className='fas fa-user ml-1'></i>
										</label>
										<input
											id='name'
											type='text'
											className={`form-control mb-0 ${outIf(toBool(errors.name), 'is-invalid')} ${outIf(
												processing,
												'disabled'
											)}`}
											disabled={processing}
											name='name'
											ref={register({ required: true })}
											placeholder={faker.name.findName()}
										/>
										{outIf(toBool(errors.name), <div className='invalid-feedback'>Please provide a valid name.</div>)}
									</div>
									<div className='form-group'>
										<label className={`${styles.label}`} htmlFor='email'>
											Email
											<i className='fas fa-envelope ml-1'></i>
										</label>
										<input
											id='email'
											type='email'
											className={`form-control mb-0 ${outIf(toBool(errors.email), 'is-invalid')} ${outIf(
												processing,
												'disabled'
											)}`}
											disabled={processing}
											name='email'
											ref={register({ required: true, pattern: EMAIL_REGEX })}
											placeholder={faker.internet.exampleEmail()}
											aria-describedby='emailHelpText'
										/>
										<small id='emailHelpText' className='form-text text-muted'>
											Note: Changing your email will not take effect right away, a verification email will be sent
											after submitting this form. Your account's email address will automatically update after you
											verify.
										</small>
										{outIf(toBool(errors.email), <div className='invalid-feedback'>Please provide a valid email.</div>)}
									</div>
								</div>
							</div>
							<div className='row'>
								<div className='col-12'>
									<h4>Social</h4>
									<div className='row'>
										<div className='form-group col-12 col-md-4'>
											<label className={`${styles.label}`} htmlFor='facebook'>
												Facebook
												<i className='fab fa-facebook ml-1'></i>
											</label>
											<input
												id='facebook'
												type='text'
												className={`form-control mb-0 ${outIf(toBool(errors.facebook), 'is-invalid')} ${outIf(
													processing,
													'disabled'
												)}`}
												disabled={processing}
												ref={register({ required: false, pattern: URL_REGEX })}
												name='facebook'
												placeholder='Facebook'
											/>
											{outIf(
												toBool(errors.facebook),
												<div className='invalid-feedback'>Please provide a valid facebook url.</div>
											)}
										</div>
										<div className='form-group col-12 col-md-4'>
											<label className={`${styles.label}`} htmlFor='twitter'>
												Twitter
												<i className='fab fa-twitter ml-1'></i>
											</label>
											<input
												id='twitter'
												type='text'
												className={`form-control mb-0 ${outIf(toBool(errors.twitter), 'is-invalid')} ${outIf(
													processing,
													'disabled'
												)}`}
												disabled={processing}
												ref={register({ required: false, pattern: URL_REGEX })}
												name='twitter'
												placeholder='Twitter'
											/>
											{outIf(
												toBool(errors.twitter),
												<div className='invalid-feedback'>Please provide a valid twitter url.</div>
											)}
										</div>
										<div className='form-group col-12 col-md-4'>
											<label className={`${styles.label}`} htmlFor='youtube'>
												Youtube
												<i className='fab fa-youtube ml-1'></i>
											</label>
											<input
												id='youtube'
												type='text'
												className={`form-control mb-0 ${outIf(toBool(errors.youtube), 'is-invalid')} ${outIf(
													processing,
													'disabled'
												)}`}
												disabled={processing}
												ref={register({ required: false, pattern: URL_REGEX })}
												name='youtube'
												placeholder='Youtube'
											/>
											{outIf(
												toBool(errors.youtube),
												<div className='invalid-feedback'>Please provide a valid youtube url.</div>
											)}
										</div>
									</div>
								</div>
							</div>
							<div className='row'>
								<div className='col-12'>
									<h4 className='mb-0'>Credentials</h4>
									<small className='form-text text-muted mb-3'>
										Note: Leave blank if you don't want to change your current password.
									</small>
									<div className='row'>
										<div className='form-group col-12 col-md-6'>
											<label className={`${styles.label}`} htmlFor='password'>
												New Password
												<i className='fas fa-lock ml-1'></i>
											</label>
											<input
												id='password'
												type='password'
												className={`form-control mb-0 ${outIf(toBool(errors.password), 'is-invalid')} ${outIf(
													processing,
													'disabled'
												)}`}
												disabled={processing}
												ref={register({ required: false })}
												name='password'
												placeholder='New Password'
											/>
											{outIf(
												toBool(errors.password),
												<div className='invalid-feedback'>Please provide a valid new password.</div>
											)}
										</div>
										<div className='form-group col-12 col-md-6'>
											<label className={`${styles.label}`} htmlFor='old_password'>
												Old Password
												<i className='fas fa-lock ml-1'></i>
											</label>
											<input
												id='old_password'
												type='password'
												className={`form-control mb-0 ${outIf(toBool(errors.old_password), 'is-invalid')} ${outIf(
													processing,
													'disabled'
												)}`}
												disabled={processing}
												ref={register({ required: !isEmpty(getValues().password) })}
												name='old_password'
												placeholder='Old Password'
											/>
											{outIf(
												toBool(errors.old_password),
												<div className='invalid-feedback'>Please provide your old password.</div>
											)}
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className='card-footer'>
							<button
								type='submit'
								className={`btn btn-fill btn-${ColorMap[color]} ${outIf(processing, 'disabled')}`}
								disabled={processing}>
								{processing ? <i className='fas fa-circle-notch fa-spin'></i> : 'Save'}
							</button>
						</div>
					</form>
				</div>
			</div>
			<div className='col-md-4'>
				<div className='card card-user'>
					<div className='card-body'>
						<div className='card-text'>
							<div className='author'>
								<div className='block block-one' data-color={color}></div>
								<div className='block block-two' data-color={color}></div>
								<div className='block block-three' data-color={color}></div>
								<div className='block block-four' data-color={color}></div>
								<a
									href='/'
									onClick={(e) => {
										e.preventDefault();
										inputRef.current?.click();
									}}>
									<img className='avatar' src={picture} alt='Profile' />
									<h5 className='title'>@{user?.name.split(' ').join('').toLowerCase()}</h5>
								</a>
								<p className='description'>{user.name}</p>
								<form className='d-none' ref={formRef}>
									<input
										type='file'
										ref={inputRef}
										onChange={(e) => {
											if (e.target.files && e.target.files.length > 0) {
												uploadProfilePicture(e.target.files[0]);
											}
										}}
									/>
								</form>
							</div>
						</div>
						<div className='card-description text-center'>{user.email}</div>
					</div>
					<div className='card-footer'>
						<div className='button-container'>
							{user?.facebook ? (
								<button
									className='btn btn-icon btn-round btn-facebook mx-1'
									onClick={(e) => {
										e.preventDefault();
										window.open(user.facebook as any);
									}}>
									<i className='fab fa-facebook'></i>
								</button>
							) : null}
							{user?.twitter ? (
								<button
									className='btn btn-icon btn-round btn-twitter mx-1'
									onClick={(e) => {
										e.preventDefault();
										window.open(user.twitter as any);
									}}>
									<i className='fab fa-twitter'></i>
								</button>
							) : null}
							{user?.youtube ? (
								<button
									className='btn btn-icon btn-round btn-google mx-1'
									onClick={(e) => {
										e.preventDefault();
										window.open(user.youtube as any);
									}}>
									<i className='fab fa-youtube'></i>
								</button>
							) : null}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
