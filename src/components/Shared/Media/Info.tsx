import React, { FC, useContext } from 'react';
import { FavoritesContext } from '../../../libraries/contexts';
import { outIf } from '../../../misc/helpers';
import Favorites from '../../Favorites';
import Genres from '../../Genres';

type Props = {
	group: string;
	type: string;
};

const Info: FC<Props> = ({ group, type }) => {
	const { favorites, favoritePagination, fetchFavorites, loadedFavorites } = useContext(FavoritesContext);

	return (
		<div className='row'>
			<div className='col-12 p-md-3 p-sm-1'>
				<div className='card'>
					<div className='card-body'>
						<h5 className='card-title'>Favorites</h5>
						{outIf(
							!loadedFavorites,
							<div className='d-flex justify-content-center'>
								<i className='fas fa-circle-notch fa-spin'></i>
							</div>,
							<Favorites
								favorites={favorites}
								pagination={favoritePagination}
								onPaginate={(url) => fetchFavorites(url, type)}
							/>
						)}
						<hr className='my-4' />
						<h5 className='card-title'>Genres</h5>
						<Genres type={group} />
					</div>
				</div>
			</div>
		</div>
	);
};

export default Info;
