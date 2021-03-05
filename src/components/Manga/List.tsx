import React, { useContext, useEffect } from 'react';
import { MangasContext, FavoritesContext } from '../../libraries/contexts';
import Card from '../Shared/Media/Card';
import Container from '../Shared/Media/Container';

type Props = {};

export default function List(props: Props) {
	const { fetchFavorites } = useContext(FavoritesContext);

	const { fetchMangas, mangaPagination, mangas, mangasLoaded } = useContext(MangasContext);

	useEffect(() => {
		fetchMangas();
		// eslint-disable-next-line
	}, []);

	return (
		<Container
			type='manga'
			group='mangakakalot'
			pagination={mangaPagination}
			onPaginate={(url) => fetchMangas(url)}
			loaded={mangasLoaded}>
			{mangas.map((manga, index) => (
				<Card type='manga' favorable={manga} key={index} onFavorite={() => fetchFavorites(undefined, 'manga')} />
			))}
		</Container>
	);
}
