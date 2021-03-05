import React, { useContext, useEffect } from 'react';
import { AnimesContext, FavoritesContext } from '../../libraries/contexts';
import Card from '../Shared/Media/Card';
import Container from '../Shared/Media/Container';

type Props = {};

export default function List(props: Props) {
	const { fetchFavorites } = useContext(FavoritesContext);

	const { fetchAnimes, animePagination, animes, animesLoaded } = useContext(AnimesContext);

	useEffect(() => {
		fetchAnimes();
		// eslint-disable-next-line
	}, []);

	return (
		<Container type='anime' group='gogoanime' pagination={animePagination} onPaginate={(url) => fetchAnimes(url)} loaded={animesLoaded}>
			{animes.map((anime, index) => (
				<Card type='anime' favorable={anime} key={index} onFavorite={() => fetchFavorites(undefined, 'anime')} />
			))}
		</Container>
	);
}
