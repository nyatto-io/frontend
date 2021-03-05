import { Paginated } from '@avidianity/model';
import { createContext } from 'react';
import { Anime } from '../contracts/Anime';
import { Favorite } from '../contracts/Favorite';
import { Manga } from '../contracts/Manga';
import { Genre } from '../contracts/misc';
import { makeDummyPagination } from '../misc/helpers';

export const ColorContext = createContext({
	color: 'primary',
	setColor: (color: string) => {},
	background: 'dark',
	setBackground: (color: string) => {},
});

export const GenresContext = createContext({
	genres: [] as Genre[],
	setGenres: (genres: Genre[]) => {},
	fetchGenres: async (type: string) => {},
	genresLoaded: false,
	setGenresLoaded: (value: boolean) => {},
});

export const FavoritesContext = createContext({
	favorites: [] as Favorite[],
	favoritePagination: makeDummyPagination() as Paginated<Favorite>,
	loadedFavorites: false,
	onPaginate: (url: string) => {},
	setLoadedFavorites: (value: boolean) => {},
	fetchFavorites: async (url?: string, type = '', keyword = '') => {},
	sendFavoriteRequest: async (type: string, id: any) => false,
});

export const AnimesContext = createContext({
	animes: [] as Anime[],
	setAnimes: (animes: Anime[]) => {},
	animePagination: makeDummyPagination() as Paginated<Anime>,
	animesLoaded: false,
	setAnimesLoaded: (loaded: boolean) => {},
	fetchAnimes: async (url?: string, group = 'gogoanime', type = 'fetchAll') => {},
});

export const MangasContext = createContext({
	mangas: [] as Manga[],
	setMangas: (animes: Manga[]) => {},
	mangaPagination: makeDummyPagination() as Paginated<Manga>,
	mangasLoaded: false,
	setMangasLoaded: (loaded: boolean) => {},
	fetchMangas: async (url?: string, group = 'mangakakalot', type = 'fetchAll') => {},
});
