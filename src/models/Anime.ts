import { Anime as AnimeContract } from '../contracts/Anime';
import { Model } from './Model';

export class Anime extends Model<AnimeContract> {
	protected base = Anime;
	protected url = '/anime';
}
