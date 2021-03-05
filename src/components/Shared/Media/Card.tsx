import dayjs from 'dayjs';
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Anime } from '../../../contracts/Anime';
import { Manga } from '../../../contracts/Manga';
import { Favorable } from '../../../contracts/misc';
import { ColorContext, FavoritesContext } from '../../../libraries/contexts';
import { ColorMap } from '../../../misc/constants';
import { toBool, outIf } from '../../../misc/helpers';
import { routes } from '../../../misc/routes';
import styles from '../../../styles/media/card.module.css';
import Logo from '../../../assets/img/logo.svg';

type Props = {
	favorable: Favorable;
	onFavorite?: (favorite: boolean) => void;
	type: 'anime' | 'manga';
};

export default function Card(props: Props) {
	const {
		favorable: { id, title, image, created_at, updated_at, is_favorite },
		onFavorite,
		type,
	} = props;
	const { color } = useContext(ColorContext);
	const [isFavorite, setIsFavorite] = useState(toBool(is_favorite));
	const [favoriting, setFavoriting] = useState(false);

	const { sendFavoriteRequest: sendRequest } = useContext(FavoritesContext);

	const viewUrl = `${routes.DASHBOARD}${routes[type.toUpperCase() as 'ANIME' | 'MANGA']}/${id}`;

	const sendFavoriteRequest = async () => {
		if (favoriting) {
			return;
		}
		setFavoriting(true);
		setIsFavorite(!isFavorite);
		try {
			const isFavorite = await sendRequest(type, id);
			if (onFavorite) {
				onFavorite(isFavorite);
			}
			setIsFavorite(isFavorite);
		} catch (error) {
			console.log(error.toJSON());
		} finally {
			setFavoriting(false);
		}
	};

	return (
		<div className='col-6 col-md-6 col-xl-3 p-md-3 p-sm-1 d-flex'>
			<div className='card flex-1'>
				<div className={`${styles['image-container']}`}>
					<Link to={viewUrl} className={`${styles['image-link']}`}>
						<img
							src={image?.url}
							alt={title}
							className={`${styles['image']}`}
							onError={(e) => {
								e.currentTarget.setAttribute('src', Logo);
							}}
						/>
					</Link>
				</div>
				<div className='card-body'>
					<Link
						to={`${viewUrl}`}
						className={`card-title d-block text-center justify-content-center ${styles['card-title']} ${
							styles[`card-title-${ColorMap[color]}`]
						}`}>
						{title}
					</Link>
				</div>
				<div className='card-footer'>
					<small className='card-text d-block mb-2'>
						{outIf(
							type === 'anime',
							<>Episodes: {(props.favorable as Anime).episodes}</>,
							<>Chapters: {(props.favorable as Manga).chapters}</>
						)}
					</small>
					<small className='text-muted d-block'>Date Added</small>
					<small className='text-muted d-block mb-2'>{dayjs(created_at).fromNow()}</small>
					<small className='text-muted d-block'>Last Updated</small>
					<small className='text-muted d-block mb-2'>{dayjs(updated_at).fromNow()}</small>
					<div className='d-flex justify-content-center'>
						<button
							className={`btn btn-link btn-${ColorMap[color]} text-${ColorMap[color]}`}
							onClick={(e) => {
								e.preventDefault();
								sendFavoriteRequest();
							}}>
							<i className={`fa${outIf(isFavorite, 's', 'r')} fa-heart`}></i>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
