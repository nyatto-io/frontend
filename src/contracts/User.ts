import { File } from './File';
import { ID, Nullable } from './misc';
import { Model } from './Model';

export interface User extends Model {
	name: string;
	email: string;
	password?: string;
	email_verified_at: Nullable<string>;
	profile_picture_id: Nullable<ID>;
	picture: Nullable<File>;
	facebook: Nullable<string>;
	twitter: Nullable<string>;
	youtube: Nullable<string>;
}
