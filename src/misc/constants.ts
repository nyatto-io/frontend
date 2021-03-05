import { FreeObject } from '../contracts/misc';

export const APP_NAME = process.env.REACT_APP_NAME || 'nyatto';

export const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const URL_REGEX = /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

export const ColorMap = {
	pink: 'primary',
	blue: 'info',
	green: 'success',
	primary: 'primary',
	info: 'info',
	success: 'success',
} as FreeObject;

export const anime = {
	types: ['gogoanime'],
};

export const manga = {
	types: ['mangakakalot'],
};

const Map = {} as FreeObject;

anime.types.forEach((type) => {
	Map[type] = 'anime';
});

manga.types.forEach((type) => {
	Map[type] = 'manga';
});

export const MediaMap = Map;

export const gradientChartOptionsConfigurationWithTooltipBlue = {
	maintainAspectRatio: false,
	legend: {
		display: false,
	},

	tooltips: {
		backgroundColor: '#f5f5f5',
		titleFontColor: '#333',
		bodyFontColor: '#666',
		bodySpacing: 4,
		xPadding: 12,
		mode: 'nearest',
		intersect: 0,
		position: 'nearest',
	},
	responsive: true,
	scales: {
		yAxes: [
			{
				barPercentage: 1.6,
				gridLines: {
					drawBorder: false,
					color: 'rgba(29,140,248,0.0)',
					zeroLineColor: 'transparent',
				},
				ticks: {
					suggestedMin: 60,
					suggestedMax: 125,
					padding: 20,
					fontColor: '#2380f7',
				},
			},
		],

		xAxes: [
			{
				barPercentage: 1.6,
				gridLines: {
					drawBorder: false,
					color: 'rgba(29,140,248,0.1)',
					zeroLineColor: 'transparent',
				},
				ticks: {
					padding: 20,
					fontColor: '#2380f7',
				},
			},
		],
	},
};

export const gradientChartOptionsConfigurationWithTooltipPurple = {
	maintainAspectRatio: false,
	legend: {
		display: false,
	},

	tooltips: {
		backgroundColor: '#f5f5f5',
		titleFontColor: '#333',
		bodyFontColor: '#666',
		bodySpacing: 4,
		xPadding: 12,
		mode: 'nearest',
		intersect: 0,
		position: 'nearest',
	},
	responsive: true,
	scales: {
		yAxes: [
			{
				barPercentage: 1.6,
				gridLines: {
					drawBorder: false,
					color: 'rgba(29,140,248,0.0)',
					zeroLineColor: 'transparent',
				},
				ticks: {
					suggestedMin: 60,
					suggestedMax: 125,
					padding: 20,
					fontColor: '#9a9a9a',
				},
			},
		],

		xAxes: [
			{
				barPercentage: 1.6,
				gridLines: {
					drawBorder: false,
					color: 'rgba(225,78,202,0.1)',
					zeroLineColor: 'transparent',
				},
				ticks: {
					padding: 20,
					fontColor: '#9a9a9a',
				},
			},
		],
	},
};

export const gradientChartOptionsConfigurationWithTooltipOrange = {
	maintainAspectRatio: false,
	legend: {
		display: false,
	},

	tooltips: {
		backgroundColor: '#f5f5f5',
		titleFontColor: '#333',
		bodyFontColor: '#666',
		bodySpacing: 4,
		xPadding: 12,
		mode: 'nearest',
		intersect: 0,
		position: 'nearest',
	},
	responsive: true,
	scales: {
		yAxes: [
			{
				barPercentage: 1.6,
				gridLines: {
					drawBorder: false,
					color: 'rgba(29,140,248,0.0)',
					zeroLineColor: 'transparent',
				},
				ticks: {
					suggestedMin: 50,
					suggestedMax: 110,
					padding: 20,
					fontColor: '#ff8a76',
				},
			},
		],

		xAxes: [
			{
				barPercentage: 1.6,
				gridLines: {
					drawBorder: false,
					color: 'rgba(220,53,69,0.1)',
					zeroLineColor: 'transparent',
				},
				ticks: {
					padding: 20,
					fontColor: '#ff8a76',
				},
			},
		],
	},
};

export const gradientChartOptionsConfigurationWithTooltipGreen = {
	maintainAspectRatio: false,
	legend: {
		display: false,
	},

	tooltips: {
		backgroundColor: '#f5f5f5',
		titleFontColor: '#333',
		bodyFontColor: '#666',
		bodySpacing: 4,
		xPadding: 12,
		mode: 'nearest',
		intersect: 0,
		position: 'nearest',
	},
	responsive: true,
	scales: {
		yAxes: [
			{
				barPercentage: 1.6,
				gridLines: {
					drawBorder: false,
					color: 'rgba(29,140,248,0.0)',
					zeroLineColor: 'transparent',
				},
				ticks: {
					suggestedMin: 50,
					suggestedMax: 125,
					padding: 20,
					fontColor: '#9e9e9e',
				},
			},
		],

		xAxes: [
			{
				barPercentage: 1.6,
				gridLines: {
					drawBorder: false,
					color: 'rgba(0,242,195,0.1)',
					zeroLineColor: 'transparent',
				},
				ticks: {
					padding: 20,
					fontColor: '#9e9e9e',
				},
			},
		],
	},
};

export const gradientBarChartConfiguration = {
	maintainAspectRatio: false,
	legend: {
		display: false,
	},

	tooltips: {
		backgroundColor: '#f5f5f5',
		titleFontColor: '#333',
		bodyFontColor: '#666',
		bodySpacing: 4,
		xPadding: 12,
		mode: 'nearest',
		intersect: 0,
		position: 'nearest',
	},
	responsive: true,
	scales: {
		yAxes: [
			{
				gridLines: {
					drawBorder: false,
					color: 'rgba(29,140,248,0.1)',
					zeroLineColor: 'transparent',
				},
				ticks: {
					suggestedMin: 60,
					suggestedMax: 120,
					padding: 20,
					fontColor: '#9e9e9e',
				},
			},
		],

		xAxes: [
			{
				gridLines: {
					drawBorder: false,
					color: 'rgba(29,140,248,0.1)',
					zeroLineColor: 'transparent',
				},
				ticks: {
					padding: 20,
					fontColor: '#9e9e9e',
				},
			},
		],
	},
};
