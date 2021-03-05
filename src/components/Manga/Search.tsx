import React, { FC, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { FavoritesContext, MangasContext } from '../../libraries/contexts';
import { SearchBus } from '../../libraries/events';
import { outIf } from '../../misc/helpers';
import Card from '../Shared/Media/Card';
import Info from '../Shared/Media/Info';
import Pagination from '../Shared/Pagination';
import SplashMini from '../Shared/SplashMini';

type Props = {};

const Search: FC<Props> = (props) => {
	const history = useHistory();
	const url = new URLSearchParams(history.location.search);
	const [keyword, setKeyword] = useState(url.get('search'));

	const { fetchFavorites } = useContext(FavoritesContext);
	const { fetchMangas, mangaPagination: pagination, mangasLoaded: loaded, mangas } = useContext(MangasContext);

	useEffect(() => {
		if (keyword && keyword.length >= 3) {
			fetchMangas(`/manga/mangakakalot?keyword=${keyword}`, 'mangakakalot', 'search');
		}
		// eslint-disable-next-line
	}, [keyword]);

	useEffect(() => {
		const key = SearchBus.listen<string>('search', (keyword) => setKeyword(keyword));

		return () => {
			SearchBus.unlisten('search', key);
		};
		// eslint-disable-next-line
	}, []);

	if (!keyword) {
		history.goBack();
		return null;
	}

	return (
		<div className='row'>
			<div className='col-12'>
				<h3>Search</h3>
				<p>
					You searched for <span className='font-italic'>"{keyword}"</span>
				</p>
			</div>
			<div className='col-12'>
				<Pagination pagination={pagination} onChange={(url) => fetchMangas(url)} />
			</div>
			<div className='col-12 col-md-8 col-xl-9'>
				{!loaded ? (
					<div className='h-100 d-flex align-items-center justify-content-center p-5'>
						<SplashMini />
					</div>
				) : (
					<div className='row'>
						{outIf(mangas.length === 0, <div className='col-12'>No Mangas</div>)}
						{mangas.map((manga, index) => (
							<Card type='manga' favorable={manga} key={index} onFavorite={() => fetchFavorites()} />
						))}
					</div>
				)}
			</div>
			<div className='col-12 col-md-4 col-xl-3'>
				<Info type='manga' group='mangakakalot' />
			</div>
			<div className='col-12'>
				<Pagination pagination={pagination} onChange={(url) => fetchMangas(url)} />
			</div>
		</div>
	);
};

export default Search;
