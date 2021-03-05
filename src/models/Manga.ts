import { Model } from '@avidianity/model';
import { Manga as MangaContract } from '../contracts/Manga';

export class Manga extends Model<MangaContract> {
	protected base = Manga;
	protected url = '/manga';
}
