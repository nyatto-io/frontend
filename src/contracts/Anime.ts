import { Favorite } from './Favorite';
import { File } from './File';
import { ID, Nullable } from './misc';
import { Model } from './Model';

export interface Anime extends Model {
	group: string;
	genres: Nullable<string>;
	rating: Nullable<string>;
	title: string;
	status: Nullable<string>;
	url: string;
	image_id: ID;
	image?: File;
	favorites?: Favorite<Anime>[];
	is_favorite?: boolean;
	description: Nullable<string>;
	episodes: number;
	english_title: Nullable<string>;
	synonyms: Nullable<string>;
	japanese_title: Nullable<string>;
}
