import { Anime } from './Anime';
import { Manga } from './Manga';

export type ID = number | undefined;

export type Favorable = Anime | Manga;

export type Nullable<T> = T | null;

export type Genre = {
	title: string;
	url: string;
};

export type FreeObject = { [key: string]: string };

export type Episode = {
	url: string;
	title: string;
	episode: number;
};

export type Drivers = {
	anime: string[];
	manga: string[];
};
