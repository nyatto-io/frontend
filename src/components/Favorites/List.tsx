import React, { FC, useContext, useEffect } from 'react';
import { Favorable } from '../../contracts/misc';
import { FavoritesContext } from '../../libraries/contexts';
import { SearchBus } from '../../libraries/events';
import { outIf } from '../../misc/helpers';
import Card from '../Shared/Media/Card';
import Pagination from '../Shared/Pagination';
import SplashMini from '../Shared/SplashMini';

type Props = {};

const List: FC<Props> = (props) => {
	const { loadedFavorites, fetchFavorites, favorites, favoritePagination, onPaginate } = useContext(FavoritesContext);

	useEffect(() => {
		fetchFavorites();
		const key = SearchBus.listen<string>('search', async (keyword) => {
			await fetchFavorites('', '', keyword);
		});

		return () => {
			SearchBus.unlisten('search', key);
		};
		// eslint-disable-next-line
	}, []);

	return (
		<div className='row'>
			<div className='col-12'>
				<Pagination pagination={favoritePagination} onChange={onPaginate} small={true} />
			</div>
			<div className='col-12'>
				<div className='row'>
					{outIf(
						!loadedFavorites,
						<div className='col-12'>
							<SplashMini />
						</div>,
						favorites.map(({ favorable, type }, index) => (
							<Card
								favorable={favorable as Favorable}
								type={type as 'anime' | 'manga'}
								key={index}
								onFavorite={() => fetchFavorites()}
							/>
						))
					)}
				</div>
			</div>
			<div className='col-12'>
				<Pagination pagination={favoritePagination} onChange={onPaginate} small={true} />
			</div>
		</div>
	);
};

export default List;
