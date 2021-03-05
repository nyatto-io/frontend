import { Model } from '@avidianity/model';
import { User as UserContract } from '../contracts/User';

export class User extends Model<UserContract> {
	protected base = User;
	protected url = '/users';
	protected fillable = ['name', 'email'];
}
