import axios from 'axios';
import Chart from 'chart.js';
import React, { createRef, FC, useContext, useEffect, useState } from 'react';
import { FreeObject } from '../../contracts/misc';
import { ColorContext } from '../../libraries/contexts';
import {
	gradientChartOptionsConfigurationWithTooltipBlue as chOptBlue,
	gradientChartOptionsConfigurationWithTooltipGreen as chOptGreen,
	gradientChartOptionsConfigurationWithTooltipPurple as chOptPink,
	gradientBarChartConfiguration as chOptGeneral,
} from '../../misc/constants';
import { handleError, minifyNumber, outIf } from '../../misc/helpers';
import SplashMini from '../Shared/SplashMini';

type Props = {};

const Statistics: FC<Props> = (props) => {
	const [loaded, setLoaded] = useState(false);
	const [counts, setCounts] = useState({ anime: 0, manga: 0 });
	const favoriteRef = createRef<HTMLCanvasElement>();
	const animeRef = createRef<HTMLCanvasElement>();
	const mangaRef = createRef<HTMLCanvasElement>();
	const { color } = useContext(ColorContext);

	const fetchAnimesAndMangasStatistics = async () => {
		const { data } = await axios.get<{ animes: { [key: string]: string[] }; mangas: { [key: string]: string[] } }>(
			'/statistics/animes-and-mangas'
		);
		initChart(animeRef, color, data.animes, 'Animes', 'line');
		initChart(mangaRef, color, data.mangas, 'Mangas', 'line');

		for (const month in data.animes) {
			counts.anime += data.animes[month].length;
		}

		for (const month in data.mangas) {
			counts.manga += data.mangas[month].length;
		}

		setCounts({ ...counts });
	};

	const fetchFavorites = async () => {
		const { data } = await axios.get<{ [key: string]: string[] }>('/statistics/favorites');
		if (!favoriteRef.current) {
			initChart({ current: document.querySelector('#favoriteCanvas') }, color, data, 'Favorites', 'bar');
		} else {
			initChart(favoriteRef, color, data, 'Favorites', 'bar');
		}
	};

	const fetchAll = async () => {
		try {
			await Promise.all([fetchAnimesAndMangasStatistics(), fetchFavorites()]);
		} catch (error) {
			console.log(error.toJSON());
			handleError(error);
		} finally {
			setLoaded(true);
		}
	};

	useEffect(() => {
		fetchAll();
		// eslint-disable-next-line
	}, []);

	return (
		<>
			{outIf(!loaded, <SplashMini />)}
			<div className={`row ${outIf(!loaded, 'd-none')}`}>
				<div className='col-12 col-md-6'>
					<div className='card card-chart'>
						<div className='card-header'>
							<div className='row'>
								<div className='col-12 text-left'>
									<h5 className='card-category'>Animes</h5>
									<h2 className='card-title'>{minifyNumber(counts.anime)}</h2>
								</div>
							</div>
						</div>
						<div className='card-body'>
							<div className='chart-area'>
								<canvas ref={animeRef}></canvas>
							</div>
						</div>
					</div>
				</div>
				<div className='col-12 col-md-6'>
					<div className='card card-chart'>
						<div className='card-header'>
							<div className='row'>
								<div className='col-12 text-left'>
									<h5 className='card-category'>Mangas</h5>
									<h2 className='card-title'>{minifyNumber(counts.manga)}</h2>
								</div>
							</div>
						</div>
						<div className='card-body'>
							<div className='chart-area'>
								<canvas ref={mangaRef}></canvas>
							</div>
						</div>
					</div>
				</div>
				<div className='col-12'>
					<div className='card card-chart'>
						<div className='card-header'>
							<div className='row'>
								<div className='col-12 text-left'>
									<h5 className='card-category'>Favorites</h5>
								</div>
							</div>
						</div>
						<div className='card-body'>
							<div className='chart-area'>
								<canvas id='favoriteCanvas' ref={favoriteRef}></canvas>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

const CHART_COLORS = {
	blue: '#3161F4',
	pink: '#d346b1',
	green: '#00F2C3',
} as FreeObject;

const initChart = (ref: any, color: string, data: { [key: string]: string[] }, title: string, type: string) => {
	if (ref.current) {
		const chartColorConfig: any = ((color) => {
			switch (color) {
				case 'blue':
					return chOptBlue;
				case 'green':
					return chOptGreen;
				case 'pink':
					return chOptPink;
				default:
					return chOptGeneral;
			}
		})(color);

		const chart_labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		const chart_data = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		for (const key in data) {
			const index = chart_labels.findIndex((month) => {
				return month.toLowerCase() === key.toLowerCase().substring(0, 3);
			});

			chart_data[index] = data[key].length;
		}

		const ctx = ref.current.getContext('2d');

		if (ctx) {
			const gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

			gradientStroke.addColorStop(1, 'rgba(29,140,248,0.2)');
			gradientStroke.addColorStop(0.4, 'rgba(29,140,248,0.0)');
			gradientStroke.addColorStop(0, 'rgba(29,140,248,0)');

			new Chart(ctx, {
				type,
				data: {
					labels: chart_labels,
					datasets: [
						{
							label: title,
							fill: true,
							backgroundColor: gradientStroke,
							borderColor: CHART_COLORS[color],
							borderWidth: 2,
							borderDash: [],
							borderDashOffset: 0.0,
							pointBackgroundColor: CHART_COLORS[color],
							pointBorderColor: 'rgba(255,255,255,0)',
							pointHoverBackgroundColor: CHART_COLORS[color],
							pointBorderWidth: 20,
							pointHoverRadius: 4,
							pointHoverBorderWidth: 15,
							pointRadius: 4,
							data: chart_data,
						},
					],
				},
				options: chartColorConfig,
			});
		}
	}
};

export default Statistics;
