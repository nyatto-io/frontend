import React, { FC, useContext } from 'react';
import { Favorable, Paginated } from '../../../contracts/misc';
import { FavoritesContext } from '../../../libraries/contexts';
import { sentencify, outIf, ucwords } from '../../../misc/helpers';
import Pagination from '../Pagination';
import SplashMini from '../SplashMini';
import Card from './Card';
import Info from './Info';

type Props = {
	pagination: Paginated<any>;
	onPaginate: (url: string) => void;
	loaded: boolean;
	type: 'anime' | 'manga';
	group: string;
	favorables: Favorable[];
	genre: string;
};

const ByGenres: FC<Props> = ({ pagination, onPaginate, loaded, type, group, favorables, genre }) => {
	const { fetchFavorites } = useContext(FavoritesContext);

	return (
		<div className='row'>
			<div className='col-12'>
				<h3>{sentencify(genre)}</h3>
			</div>
			<div className='col-12'>
				<Pagination pagination={pagination} onChange={onPaginate} />
			</div>
			<div className='col-12 col-md-8 col-xl-9'>
				{!loaded ? (
					<div className='h-100 d-flex align-items-center justify-content-center p-5'>
						<SplashMini />
					</div>
				) : (
					<div className='row'>
						{outIf(favorables.length === 0, <div className='col-12'>No {ucwords(type)}</div>)}
						{favorables.map((favorable, index) => (
							<Card type={type} favorable={favorable} key={index} onFavorite={() => fetchFavorites(undefined, type)} />
						))}
					</div>
				)}
			</div>
			<div className='col-12 col-md-4 col-xl-3'>
				<Info type={type} group={group} />
			</div>
			<div className='col-12'>
				<Pagination pagination={pagination} onChange={onPaginate} />
			</div>
		</div>
	);
};

export default ByGenres;
