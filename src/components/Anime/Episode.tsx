import React, { FC, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Episode as EpisodeContract } from '../../contracts/misc';
import { ColorContext } from '../../libraries/contexts';
import { ColorMap } from '../../misc/constants';

type Props = {
	episode: EpisodeContract;
	path: string;
};

const Episode: FC<Props> = ({ episode, path }) => {
	const { color } = useContext(ColorContext);

	return (
		<Link to={`${path}/watch/${episode.episode}`} className={`btn btn-${ColorMap[color]} btn-sm w-100`}>
			<small>{episode.title}</small>
		</Link>
	);
};

export default Episode;
