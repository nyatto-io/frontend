import axios from 'axios';
import React, { FC, useContext, useEffect, useState } from 'react';
import { Drivers } from '../../contracts/misc';
import { Setting } from '../../contracts/Setting';
import { ColorContext } from '../../libraries/contexts';
import { ColorMap } from '../../misc/constants';
import { handleError, Notif, outIf, sentencify } from '../../misc/helpers';
import SplashMini from '../Shared/SplashMini';

type Props = {};

const Settings: FC<Props> = (props) => {
	const [loaded, setLoaded] = useState(false);
	const [settings, setSettings] = useState<Setting[]>([]);
	const [drivers, setDrivers] = useState<Drivers>();
	const [processing, setProcessing] = useState(false);

	const { color } = useContext(ColorContext);

	const fetchSettings = async () => {
		const { data } = await axios.get<Setting[]>('/auth/settings');
		setSettings(data);
	};

	const fetchDrivers = async () => {
		const { data } = await axios.get<Drivers>('/config/drivers');
		setDrivers(data);
	};

	const boot = async () => {
		setLoaded(false);
		try {
			await Promise.all([fetchSettings(), fetchDrivers()]);
		} catch (error: any) {
			console.log(error.toJSON());
			Notif.error('Unable to boot settings.');
		} finally {
			setLoaded(true);
		}
	};

	const setting = {
		find(key: string) {
			return settings.find((setting) => setting.key.includes(key));
		},
		get<T>(key: string, defaultValue: T | null = null) {
			const match = this.find(key);

			return match?.value || defaultValue;
		},
		has(key: string) {
			return this.find(key) !== undefined;
		},
		set(key: string, value: any) {
			const match = this.find(key);
			if (match) {
				match.value = value;
				const index = settings.findIndex((setting) => setting.id === match.id);
				settings.splice(index, 1, match);
				setSettings([...settings]);
			} else {
				setSettings([
					...settings,
					{
						key,
						value,
					},
				]);
			}
		},
	};

	const save = async () => {
		setProcessing(true);
		try {
			const { data } = await axios.post<Setting[]>('/auth/settings/bulk', { payload: settings });
			setSettings(data);
			Notif.info('Settings saved successfully.');
		} catch (error: any) {
			console.log(error.toJSON());
			handleError(error);
		} finally {
			setProcessing(false);
		}
	};

	useEffect(() => {
		boot();
		// eslint-disable-next-line
	}, []);

	if (!loaded) {
		return <SplashMini />;
	}

	return (
		<div className='row'>
			<div className='col-12'>
				<h4>Settings</h4>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						await save();
					}}>
					<fieldset>
						<legend>Anime Driver</legend>
						<div className='form-group'>
							{drivers?.anime.map((driver, index) => (
								<div className='custom-control custom-radio custom-control-inline' key={index}>
									<input
										type='radio'
										id={`${driver}`}
										name='anime-driver'
										className='custom-control-input'
										checked={
											(!setting.has('anime-driver') && driver === 'gogoanime') ||
											setting.get('anime-driver') === driver
										}
										onChange={() => setting.set('anime-driver', driver)}
										disabled={processing}
									/>
									<label className='custom-control-label' htmlFor={`${driver}`}>
										{sentencify(driver)}
									</label>
								</div>
							))}
						</div>
					</fieldset>
					<fieldset>
						<legend>Manga Driver</legend>
						<div className='form-group'>
							{drivers?.manga.map((driver, index) => (
								<div className='custom-control custom-radio custom-control-inline' key={index}>
									<input
										type='radio'
										id={`${driver}`}
										name='manga-driver'
										className='custom-control-input'
										checked={
											(!setting.has('manga-driver') && driver === 'mangakakalot') ||
											setting.get('manga-driver') === driver
										}
										onChange={() => setting.set('manga-driver', driver)}
										disabled={processing}
									/>
									<label className='custom-control-label' htmlFor={`${driver}`}>
										{sentencify(driver)}
									</label>
								</div>
							))}
						</div>
					</fieldset>
					<fieldset>
						<legend>Misc</legend>
						<div className='form-group'>
							<div className='custom-control custom-checkbox'>
								<input
									type='checkbox'
									className='custom-control-input'
									id='notify-favorites-update'
									checked={setting.get('notify-favorites-update', 'no') === 'yes'}
									onChange={() =>
										setting.set(
											'notify-favorites-update',
											outIf(setting.get('notify-favorites-update') === 'yes', 'no', 'yes')
										)
									}
								/>
								<label className='custom-control-label' htmlFor='notify-favorites-update'>
									Notify me on updates from my favorites (episodes and chapters)
								</label>
							</div>
						</div>
					</fieldset>
					<div className='form-group pt-3'>
						<button
							type='submit'
							className={`btn btn-sm btn-${ColorMap[color]} ${outIf(processing, 'disabled')}`}
							disabled={processing}>
							{processing ? <i className='fas fa-circle-notch fa-spin'></i> : 'Save'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Settings;
