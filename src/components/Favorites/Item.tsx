import React, { FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Favorite } from '../../contracts/Favorite';
import { ColorContext } from '../../libraries/contexts';
import { ColorMap } from '../../misc/constants';
import { routes } from '../../misc/routes';

type Props = {
	favorite: Favorite;
	className?: string;
};

const Item: FC<Props> = ({ className, favorite }) => {
	const { color } = useContext(ColorContext);

	return (
		<li className={`${className}`}>
			<Link to={`${routes.DASHBOARD}/${favorite.type}/${favorite.favorable?.id}`} className={`text-${ColorMap[color]}`}>
				<small>{favorite.favorable?.title}</small>
			</Link>
		</li>
	);
};

export default Item;
