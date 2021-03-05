import { Model } from '@avidianity/model';
import { Anime as AnimeContract } from '../contracts/Anime';

export class Anime extends Model<AnimeContract> {
	protected base = Anime;
	protected url = '/anime';
}
