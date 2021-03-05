import { Paginated } from '@avidianity/model';
import React from 'react';
import { Favorite } from '../contracts/Favorite';
import { Favorable } from '../contracts/misc';
import Container from './Favorites/Container';
import Item from './Favorites/Item';
import Pagination from './Shared/Pagination';

type Props<T extends Favorable> = {
	favorites: Favorite<T>[];
	pagination: Paginated<any>;
	onPaginate: (url: string) => void;
};

export default function Favorites<T extends Favorable>({ favorites, pagination, onPaginate }: Props<T>) {
	if (favorites.length === 0) {
		return <small className='text-muted m-0 p-0'>N/A</small>;
	}

	return (
		<Container>
			<ul className='list-unstyled'>
				{favorites.map((favorite, index) => (
					<Item favorite={favorite} key={index} />
				))}
			</ul>
			<Pagination pagination={pagination} onChange={(url) => onPaginate(url)} small={true} />
		</Container>
	);
}
