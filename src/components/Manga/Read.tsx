import axios from 'axios';
import { parseInt } from 'lodash';
import React, { FC, useContext, useEffect, useState } from 'react';
import { useRouteMatch, useHistory, Link } from 'react-router-dom';
import { Chapter } from '../../contracts/Chapter';
import { Manga } from '../../contracts/Manga';
import { Nullable } from '../../contracts/misc';
import { ColorContext, MangasContext } from '../../libraries/contexts';
import { ColorMap } from '../../misc/constants';
import { equal, handleError } from '../../misc/helpers';
import { routes } from '../../misc/routes';
import Buttons from './Buttons';
import SplashMini from '../Shared/SplashMini';

type Props = {};

type Match = {
	id: string;
	chapter: string;
};

const Read: FC<Props> = (props) => {
	const [loaded, setLoaded] = useState(false);
	const { params } = useRouteMatch<Match>();
	const { id } = params;
	const [chapter, setChapter] = useState(parseInt(params.chapter));
	const history = useHistory();

	const { mangas, mangasLoaded } = useContext(MangasContext);
	const { color } = useContext(ColorContext);

	const [manga, setManga] = useState(mangas.find((manga) => equal(manga.id, id)));
	const [chapterData, setChapterData] = useState<Nullable<Chapter>>(null);

	const fetchChapter = async (manga: Manga | undefined, chapter: number) => {
		if (manga) {
			try {
				const { data } = await axios.get<Chapter>(`/manga/${manga.group}?type=getChapter&id=${manga.id}&chapter=${chapter}`);
				setChapterData(data);
				setLoaded(true);
			} catch (error) {
				handleError(error);
				history.goBack();
			}
		}
	};

	const fetchManga = async () => {
		try {
			const { data } = await axios.get<Manga>(`/manga/${id}`);
			setManga(data);
			fetchChapter(data, chapter);
		} catch (error) {
			handleError(error);
			history.goBack();
		}
	};

	useEffect(() => {
		fetchChapter(manga, chapter);
		if (!manga) {
			if (mangasLoaded) {
				history.goBack();
			} else {
				fetchManga();
			}
		}
		// eslint-disable-next-line
	}, []);

	if (!manga) {
		return null;
	}

	if (!loaded || !chapterData) {
		return <SplashMini />;
	}

	const handleClick = (chapter: number) => {
		setChapter(chapter);
		fetchChapter(manga, chapter);
	};

	return (
		<div className={`container-fluid`}>
			<div className='row'>
				<Buttons onClick={handleClick} chapter={chapter} manga={manga} />
				<div className='col-12'>
					<div className='container'>
						<div className='row'>
							{chapterData.images.map((image, index) => (
								<div className='col-12' key={index}>
									<img
										src={image.file.url}
										alt={`${manga.title} Chapter ${chapter} - ${index + 1}`}
										className='img-fluid'
									/>
								</div>
							))}
						</div>
					</div>
				</div>
				<Buttons onClick={handleClick} chapter={chapter} manga={manga} />
				<div className='col-12'>
					<h6>
						<Link
							to={`${routes.DASHBOARD}${routes.ANIME}/${manga.id}`}
							className={`btn btn-link btn-${ColorMap[color]} btn-sm`}>
							{manga.title}
						</Link>
					</h6>
					<p>{manga.description}</p>
				</div>
			</div>
		</div>
	);
};

export default Read;
