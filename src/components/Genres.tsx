import React, { FC, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import slug from 'slug';
import { Genre } from '../contracts/misc';
import { ColorContext, GenresContext } from '../libraries/contexts';
import { ColorMap, MediaMap } from '../misc/constants';
import { routes } from '../misc/routes';

type Props = {
	type: string;
};

const Genres: FC<Props> = ({ type }) => {
	const { genres, fetchGenres, genresLoaded: loaded } = useContext(GenresContext);
	const { color } = useContext(ColorContext);

	useEffect(() => {
		fetchGenres(type);
		//eslint-disable-next-line
	}, []);

	if (!loaded) {
		return (
			<div className='d-flex justify-content-center'>
				<i className='fas fa-circle-notch fa-spin'></i>
			</div>
		);
	}

	const groups: Genre[][] = [[]];

	genres.forEach((genre) => {
		if (groups[groups.length - 1].length < 5) {
			groups[groups.length - 1].push(genre);
		} else {
			groups.push([genre]);
		}
	});

	return (
		<div className='row'>
			{groups.map((genres, index) => (
				<div className='col-6 col-md-12 col-lg-6' key={index}>
					<ul className='list-unstyled'>
						{genres.map(({ title }, index) => (
							<li key={index}>
								<Link
									className={`text-${ColorMap[color]}`}
									to={`${routes.DASHBOARD}${routes[MediaMap[type].toUpperCase() as 'ANIME' | 'MANGA']}/genres/${slug(
										title.toLowerCase()
									)}`}>
									<small>{title}</small>
								</Link>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	);
};

export default Genres;
