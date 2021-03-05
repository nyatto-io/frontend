import { Favorite } from './Favorite';
import { File } from './File';
import { ID, Nullable } from './misc';
import { Model } from './Model';

export interface Manga extends Model {
	group: string;
	genres: Nullable<string>;
	rating: string;
	title: string;
	status: Nullable<string>;
	url: string;
	image_id: ID;
	image?: File;
	favorites?: Favorite<Manga>[];
	is_favorite?: boolean;
	description: Nullable<string>;
	chapters: number;
}
