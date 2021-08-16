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

export interface Paginated<T> {
	current_page: 0;
	data: T[];
	first_page_url: string;
	from: string;
	last_page: string;
	last_page_url: string;
	links: { active: boolean; label: string; url: string }[];
	next_page_url: string;
	path: string;
	per_page: 1;
	prev_page_url: string;
	to: string;
	total: 0;
}
