import React, { FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Chapter as ChapterContract } from '../../contracts/Chapter';
import { ColorContext } from '../../libraries/contexts';
import { ColorMap } from '../../misc/constants';

type Props = {
	chapter: ChapterContract;
	path: string;
};

const Chapter: FC<Props> = ({ chapter, path }) => {
	const { color } = useContext(ColorContext);

	return (
		<Link to={`${path}/read/${chapter.title}`} className={`btn btn-${ColorMap[color]} btn-sm w-100`}>
			<small>Chapter {chapter.title}</small>
		</Link>
	);
};

export default Chapter;
