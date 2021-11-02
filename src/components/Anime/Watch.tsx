import axios from 'axios';
import React, { FC, useContext, useEffect, useRef, useState } from 'react';
import { Link, useHistory, useRouteMatch } from 'react-router-dom';
import { Anime } from '../../contracts/Anime';
import { AnimesContext, ColorContext } from '../../libraries/contexts';
import { ColorMap } from '../../misc/constants';
import { equal, handleError, outIf } from '../../misc/helpers';
import { routes } from '../../misc/routes';
import SplashMini from '../Shared/SplashMini';
import styles from '../../styles/anime/watch.module.css';
import { isEmpty } from 'lodash';

type Props = {};

type Match = {
	id: string;
	episode: string;
};

const Watch: FC<Props> = (props) => {
	const [loaded, setLoaded] = useState(false);
	const [url, setUrl] = useState('');
	const { params } = useRouteMatch<Match>();
	const { id } = params;
	const [episode, setEpisode] = useState(Number(params.episode));
	const history = useHistory();
	const iframe = useRef<HTMLIFrameElement>(null);
	const { animes, animesLoaded } = useContext(AnimesContext);
	const { color } = useContext(ColorContext);

	const [anime, setAnime] = useState(animes.find((anime) => equal(anime.id, id)));

	const fetchEpisode = async (anime: Anime | undefined, episode: number) => {
		if (anime) {
			try {
				const { data } = await axios.get<{ url: string }>(
					`/anime/${anime.group}?type=getEpisodeUrl&id=${anime.id}&episode=${episode}`
				);
				setUrl(data.url);
				setLoaded(true);
			} catch (error) {
				handleError(error);
				history.goBack();
			}
		}
	};

	const fetchAnime = async () => {
		try {
			const { data } = await axios.get<Anime>(`/anime/${id}`);
			setAnime(data);
			fetchEpisode(data, episode);
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	useEffect(() => {
		fetchEpisode(anime, episode);
		if (!anime) {
			if (animesLoaded) {
				history.goBack();
			} else {
				fetchAnime();
			}
		}
		// eslint-disable-next-line
	}, []);

	if (!anime) {
		return null;
	}

	if (!loaded) {
		return <SplashMini />;
	}

	return (
		<div className={`container-fluid`}>
			<div className='row'>
				<div className='col-12'>
					<div className={`${styles['iframe-wrapper']} ${outIf(isEmpty(url), 'd-none')}`}>
						<iframe
							ref={iframe}
							src={url}
							frameBorder='0'
							allowFullScreen
							className={`${styles.iframe}`}
							title={anime.title}></iframe>
					</div>
				</div>
				<div className='col-12 d-flex py-3'>
					{outIf(
						episode > 1,
						<Link
							to={`${routes.DASHBOARD}${routes.ANIME}/${anime.id}/watch/${episode - 1}`}
							className={`btn btn-sm btn-${ColorMap[color]} mr-auto`}
							onClick={(e) => {
								const previous = episode - 1;
								setUrl('');
								setEpisode(previous);
								fetchEpisode(anime, previous);
							}}>
							<small className='d-flex align-items-center justify-content-center'>
								<i className='fas fa-arrow-left mr-2'></i>
								Episode {episode - 1}
							</small>
						</Link>
					)}
					{outIf(
						episode < anime.episodes,
						<Link
							to={`${routes.DASHBOARD}${routes.ANIME}/${anime.id}/watch/${episode + 1}`}
							className={`btn btn-sm btn-${ColorMap[color]} ml-auto`}
							onClick={(e) => {
								const next = episode + 1;
								setUrl('');
								setEpisode(next);
								fetchEpisode(anime, next);
							}}>
							<small className='d-flex align-items-center justify-content-center'>
								Episode {episode + 1}
								<i className='fas fa-arrow-right ml-2'></i>
							</small>
						</Link>
					)}
				</div>
				<div className='col-12'>
					<h6>
						<Link
							to={`${routes.DASHBOARD}${routes.ANIME}/${anime.id}`}
							className={`btn btn-link btn-${ColorMap[color]} btn-sm`}>
							{anime.title}
						</Link>
					</h6>
					<p>{anime.description}</p>
				</div>
			</div>
		</div>
	);
};

export default Watch;
