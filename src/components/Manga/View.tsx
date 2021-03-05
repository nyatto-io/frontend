import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { Manga } from '../../contracts/Manga';
import { Nullable } from '../../contracts/misc';
import { Chapter as ChapterContract } from '../../contracts/Chapter';
import { handleError, Notif } from '../../misc/helpers';
import SplashMini from '../Shared/SplashMini';
import { routes } from '../../misc/routes';
import Chapter from './Chapter';
import Info from '../Shared/Media/Info';
import { ColorContext } from '../../libraries/contexts';
import { ColorMap } from '../../misc/constants';
import { trim } from 'lodash';
import Logo from '../../assets/img/logo.svg';

type Props = {};

type Match = {
	id: string;
};

const Loading = () => (
	<div className='row'>
		<div className='col-12 pt-3'>
			<SplashMini />
		</div>
	</div>
);

export default function View(props: Props) {
	const [loaded, setLoaded] = useState(false);
	const [manga, setManga] = useState<Nullable<Manga>>(null);
	const [chapters, setChapters] = useState<ChapterContract[]>([]);
	const match = useRouteMatch<Match>();
	const history = useHistory();

	const { color } = useContext(ColorContext);

	const id = match.params.id;

	const fetchManga = async () => {
		try {
			const { data } = await axios.get<Manga>(`/manga/${id}`);
			setManga(data);
			fetchMangaChapters(data);
			setLoaded(true);
		} catch (error) {
			console.log(error.toJSON());
			handleError(error);
			history.goBack();
		}
	};

	const fetchMangaChapters = async (manga: Manga) => {
		try {
			const { data } = await axios.get<ChapterContract[]>(`/manga/${manga.id}/chapters`);
			setChapters(data);
		} catch (error) {
			console.log(error.toJSON());
			Notif.error('Unable to fetch chapters.');
		}
	};

	const makeGenres = (genres: string | null) => {
		if (!genres) {
			return 'N/A';
		}
		return genres.split(',').map((genre, index) => (
			<Link
				className={`text-${ColorMap[color]} ml-1`}
				to={`${routes.DASHBOARD}${routes.MANGA}/genres/${trim(genre.toLowerCase())}`}
				key={index}>
				{genre}
			</Link>
		));
	};

	useEffect(() => {
		fetchManga();
		// eslint-disable-next-line
	}, []);

	return (
		<div className='row'>
			<div className='col-12 col-md-9'>
				{loaded && manga ? (
					<div className='row'>
						<div className='col-12 col-md-4 col-lg-3'>
							<div className='d-flex'>
								<img
									src={manga.image!.url}
									alt={manga.title}
									className={`img-fluid mx-auto`}
									onError={(e) => {
										e.currentTarget.setAttribute('src', Logo);
									}}
								/>
							</div>
							<hr className='my-3' />
							<small className='d-block my-1'>Rating: {manga.rating}</small>
							<hr />
							<small className='d-block my-1'>Status: {manga.status || 'N/A'}</small>
							<hr />
							<small className='d-block my-1'>Genres</small>
							<small className='d-block'>{makeGenres(manga.genres)}</small>
						</div>
						<div className='col-12 col-md-8 col-lg-9 mt-sm-2'>
							<h4 className='mt-3'>{manga.title}</h4>
							<p className='my-5'>{manga.description}</p>
							{chapters.length > 0 ? (
								<div className='row'>
									{chapters.map((chapter, index) => (
										<div className='col-4 col-md-4 col-lg-4 col-xl-3 mb-3 mb-sm-0' key={index}>
											<Chapter chapter={chapter} path={history.location.pathname} />
										</div>
									))}
								</div>
							) : (
								<Loading />
							)}
						</div>
					</div>
				) : (
					<Loading />
				)}
			</div>
			<div className='col-12 col-md-3'>
				<Info type='manga' group={manga?.group || 'mangakakalot'} />
			</div>
		</div>
	);
}
