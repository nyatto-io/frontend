import React, { FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Manga } from '../../contracts/Manga';
import { ColorContext } from '../../libraries/contexts';
import { ColorMap } from '../../misc/constants';
import { outIf } from '../../misc/helpers';
import { routes } from '../../misc/routes';

type Props = {
	chapter: number;
	onClick: (chapter: number) => void;
	manga: Manga;
};

const Buttons: FC<Props> = ({ chapter, onClick, manga }) => {
	const { color } = useContext(ColorContext);
	return (
		<div className='col-12 d-flex py-3'>
			{outIf(
				chapter > 1,
				<Link
					to={`${routes.DASHBOARD}${routes.MANGA}/${manga.id}/read/${chapter - 1}`}
					className={`btn btn-sm btn-${ColorMap[color]} mr-auto`}
					onClick={(e) => {
						const previous = chapter - 1;
						onClick(previous);
					}}>
					<small className='d-flex align-items-center justify-content-center'>
						<i className='fas fa-arrow-left mr-2'></i>
						Chapter {chapter - 1}
					</small>
				</Link>
			)}
			{outIf(
				chapter < manga.chapters,
				<Link
					to={`${routes.DASHBOARD}${routes.MANGA}/${manga.id}/read/${chapter + 1}`}
					className={`btn btn-sm btn-${ColorMap[color]} ml-auto`}
					onClick={(e) => {
						const next = chapter + 1;
						onClick(next);
					}}>
					<small className='d-flex align-items-center justify-content-center'>
						Chapter {chapter + 1}
						<i className='fas fa-arrow-right ml-2'></i>
					</small>
				</Link>
			)}
		</div>
	);
};

export default Buttons;
