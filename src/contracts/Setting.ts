import { Model } from './Model';

export interface Setting extends Model {
	key: string;
	value: string;
}
