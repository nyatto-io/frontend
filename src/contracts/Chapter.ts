import { ChapterImage } from './ChapterImage';
import { Model } from './Model';

export interface Chapter extends Model {
	url: string;
	title: string;
	images: ChapterImage[];
}
