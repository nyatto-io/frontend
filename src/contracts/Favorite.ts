import { Favorable, ID } from './misc';
import { Model } from './Model';
import { User } from './User';

export interface Favorite<T extends Favorable = Favorable> extends Model {
	type: string;
	group: string;
	favorable_type: string;
	favorable_id: number;
	favorable?: T;
	user_id: ID;
	user?: User;
}
