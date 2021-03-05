import React, { FC, useContext, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { MangasContext } from '../../libraries/contexts';
import ByGenres from '../Shared/Media/ByGenres';

type Props = {};

type Match = {
	genre: string;
};

const Genre: FC<Props> = (props) => {
	const { params } = useRouteMatch<Match>();
	const [genre, setGenre] = useState(params.genre);
	const [loading, setLoading] = useState(false);

	const { fetchMangas, mangaPagination: pagination, mangasLoaded: loaded, mangas } = useContext(MangasContext);

	useEffect(() => {
		if (loading) {
			return;
		}
		setLoading(true);
		fetchMangas(`/manga/mangakakalot?keyword=${genre}`, 'mangakakalot', 'search').finally(() => setLoading(false));
		// eslint-disable-next-line
	}, [genre]);

	useEffect(() => {
		setGenre(params.genre);
	}, [params.genre]);

	return (
		<ByGenres
			type='manga'
			group='mangakakalot'
			pagination={pagination}
			favorables={mangas}
			onPaginate={(url) => fetchMangas(url)}
			loaded={loaded}
			genre={genre}
		/>
	);
};

export default Genre;
