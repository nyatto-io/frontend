import _, { isEmpty } from 'lodash';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import $ from 'jquery';
import { Paginated } from '../contracts/misc';

dayjs.extend(relativeTime);

export class Notif {
	protected static timer = 1000;

	static primary(message: string, options?: { from?: NotifyFrom; align?: NotifyAlign }) {
		$.notify(
			{ icon: 'tim-icons icon-app', message },
			{
				type: 'primary',
				timer: Notif.timer,
				placement: {
					from: options?.from || 'top',
					align: options?.align || 'right',
				},
			}
		);
	}

	static info(message: string, options?: { from?: NotifyFrom; align?: NotifyAlign }) {
		$.notify(
			{ icon: 'tim-icons icon-bulb-63', message },
			{
				type: 'info',
				timer: Notif.timer,
				placement: {
					from: options?.from || 'top',
					align: options?.align || 'right',
				},
			}
		);
	}

	static success(message: string, options?: { from?: NotifyFrom; align?: NotifyAlign }) {
		$.notify(
			{ icon: 'tim-icons icon-check-2', message },
			{
				type: 'success',
				timer: Notif.timer,
				placement: {
					from: options?.from || 'top',
					align: options?.align || 'right',
				},
			}
		);
	}

	static error(message: string, options?: { from?: NotifyFrom; align?: NotifyAlign }) {
		$.notify(
			{ icon: 'tim-icons icon-alert-circle-exc', message },
			{
				type: 'danger',
				timer: Notif.timer,
				placement: {
					from: options?.from || 'top',
					align: options?.align || 'right',
				},
			}
		);
	}
}

export function equal(first: any, second: any) {
	return `${first}` === `${second}`;
}

export function makeDummyPagination() {
	return {
		current_page: 0,
		data: [],
		first_page_url: '',
		from: '',
		last_page: '',
		last_page_url: '',
		links: [],
		next_page_url: '',
		path: '',
		per_page: 1,
		prev_page_url: '',
		to: '',
		total: 0,
	} as Paginated<any>;
}

export function excludeEmpty<T, K extends keyof T>(data: T, keys: K[]) {
	const result: any = {};
	Object.entries(data).forEach(([key, value]) => {
		if (keys.includes(key as any)) {
			if (!isEmpty(value)) {
				result[key] = value;
			}
		} else {
			result[key] = value;
		}
	});
	return result;
}

export function toBool(data: any) {
	return data ? true : false;
}

export function outIf<T>(condition: boolean, output: T, defaultValue: any = ''): T {
	return condition ? output : (defaultValue as unknown as T);
}

export function ucfirst(string: string) {
	const array = string.split('');
	array[0] = array[0].toUpperCase();
	return array.join('');
}

export function ucwords(string: string) {
	return string
		.split(' ')
		.map((word) => (word === 'Id' ? 'ID' : ucfirst(word)))
		.join(' ');
}

export function exists<T, K extends keyof T>(object: T, key: K) {
	return key in object;
}

export function handleError(error: any, options?: { from?: NotifyFrom; align?: NotifyAlign }) {
	if (error.response) {
		const response = error.response;
		if (response.data.message && response.status !== 422) {
			Notif.error(response.data.message, options);
		} else if (response.status === 422) {
			Object.values(response.data.errors).forEach((errors: any) => errors.forEach((error: any) => Notif.error(error, options)));
		} else {
			Notif.error('Something went wrong, please try again later.', options);
		}
	} else if (error.message) {
		Notif.error(error.message, options);
	}
}

export function groupBy<T, K extends keyof T>(data: Array<T>, key: K) {
	const temp: { [key: string]: Array<T> } = {};

	data.forEach((item) => {
		const property: any = item[key];
		if (!(property in temp)) {
			temp[property] = [];
		}
		temp[property].push(item);
	});
	return Object.keys(temp).map((key) => temp[key]);
}

export function createTableColumns(data: Array<any>) {
	if (data.length === 0) {
		return [];
	}

	return Object.keys(data[0]).map((key) => {
		switch (key) {
			case 'id':
				return 'ID';
			case 'createdAt':
				return 'Created';
			case 'updatedAt':
				return 'Modified';
			case 'created_at':
				return 'Created';
			case 'updated_at':
				return 'Modified';
			default:
				return sentencify(key);
		}
	});
}

export function sentencify(words: string) {
	return ucwords(_.snakeCase(words).split('_').join(' ').split('-').join(' '));
}

export function parseDate(date: string) {
	return dayjs(date).fromNow();
}

export function makeMask<T extends Function>(callable: T, callback: Function) {
	return ((data: any) => {
		return callable(callback(data));
	}) as unknown as T;
}

export function except<T, K extends keyof T>(data: T, keys: Array<K>) {
	const copy = { ...data };
	for (const key of keys) {
		if (key in copy) {
			delete copy[key];
		}
	}
	return copy;
}

export function exceptMany<T, K extends keyof T>(data: Array<T>, keys: Array<K>) {
	return [...data].map((item) => except(item, keys));
}

export function orEqual<T>(data: T, keys: Array<T>) {
	return keys.includes(data);
}

export function only<T, K extends keyof T>(data: T, keys: Array<K>) {
	const result = {} as T;
	(result as any)['id'] = (data as any)['id'];
	for (const key of keys) {
		result[key] = data[key];
	}
	return result;
}

export function onlyMany<T, K extends keyof T>(data: Array<T>, keys: Array<K>) {
	return [...data].map((item) => only(item, keys));
}

const formatter = new Intl.NumberFormat('en-PH', {
	style: 'currency',
	currency: 'PHP',
});

export function formatCurrency(value: number) {
	return formatter.format(value).replace(/\D00(?=\D*$)/, '');
}

export function minifyNumber(value: number | string) {
	if (typeof value === 'string') {
		value = value.parseNumbers();
	}
	return Math.abs(value) > 999 ? (Math.sign(value) * Math.round(Math.abs(value) / 100)) / 10 + 'k' : Math.sign(value) * Math.abs(value);
}
