import { Model } from './Model';
import { Favorite as FavoriteContract } from '../contracts/Favorite';
import { Anime as AnimeContract } from '../contracts/Anime';
import { Manga as MangaContract } from '../contracts/Manga';

export class Favorite extends Model<FavoriteContract<AnimeContract | MangaContract>> {
	protected base = Favorite;
	protected url = '/favorites';
	protected fillable = ['favorable_type', 'favorable_id'];
}
