import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { Anime } from '../../contracts/Anime';
import { Episode as EpisodeContract, Nullable } from '../../contracts/misc';
import { handleError, Notif } from '../../misc/helpers';
import SplashMini from '../Shared/SplashMini';
import { routes } from '../../misc/routes';
import Episode from './Episode';
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
	const [anime, setAnime] = useState<Nullable<Anime>>(null);
	const [episodes, setEpisodes] = useState<EpisodeContract[]>([]);
	const match = useRouteMatch<Match>();
	const history = useHistory();

	const { color } = useContext(ColorContext);

	const id = match.params.id;

	const fetchAnime = async () => {
		try {
			const { data } = await axios.get<Anime>(`/anime/${id}`);
			setAnime(data);
			fetchAnimeEpisodes(data);
			setLoaded(true);
		} catch (error) {
			console.log(error.toJSON());
			handleError(error);
			history.goBack();
		}
	};

	const fetchAnimeEpisodes = async (anime: Anime) => {
		try {
			const { data } = await axios.get<EpisodeContract[]>(`/anime/${anime.group}?type=view&id=${anime.id}`);
			setEpisodes(data);
		} catch (error) {
			console.log(error.toJSON());
			Notif.error('Unable to fetch episodes.');
		}
	};

	const makeGenres = (genres: string | null) => {
		if (!genres) {
			return 'N/A';
		}
		return genres.split(',').map((genre, index) => (
			<Link
				className={`text-${ColorMap[color]} ml-1`}
				to={`${routes.DASHBOARD}${routes.ANIME}/genres/${trim(genre.toLowerCase())}`}
				key={index}>
				{genre}
			</Link>
		));
	};

	useEffect(() => {
		fetchAnime();
		// eslint-disable-next-line
	}, []);

	return (
		<div className='row'>
			<div className='col-12 col-md-9'>
				{loaded && anime ? (
					<div className='row'>
						<div className='col-12 col-md-4 col-lg-3'>
							<div className='d-flex'>
								<img
									src={anime.image!.url}
									alt={anime.title}
									className={`img-fluid mx-auto`}
									onError={(e) => {
										e.currentTarget.setAttribute('src', Logo);
									}}
								/>
							</div>
							<hr className='my-3' />
							<small className='d-block my-1'>Rating: {anime.rating}</small>
							<hr />
							<small className='d-block my-1'>Status: {anime.status || 'N/A'}</small>
							<hr />
							<small className='d-block my-1'>Genres</small>
							<small className='d-block'>{makeGenres(anime.genres)}</small>
							<hr />
							<small className='d-block my-1'>English Title: {anime.english_title || 'N/A'}</small>
							<hr />
							<small className='d-block my-1'>Japanese Title: {anime.japanese_title || 'N/A'}</small>
							<hr />
							<small className='d-block my-1'>Synonyms: {anime.synonyms || 'N/A'}</small>
						</div>
						<div className='col-12 col-md-8 col-lg-9 mt-sm-2'>
							<h4 className='mt-3'>{anime.title}</h4>
							<p className='my-5'>{anime.description}</p>
							{episodes.length > 0 ? (
								<div className='row'>
									{episodes.map((episode, index) => (
										<div className='col-4 col-md-4 col-lg-4 col-xl-3 mb-3 mb-sm-0' key={index}>
											<Episode episode={episode} path={history.location.pathname} />
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
				<Info type='anime' group={anime?.group || 'gogoanime'} />
			</div>
		</div>
	);
}
