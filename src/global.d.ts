import JQuery from '@types/jquery';

declare global {
	type ColorTypes = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';

	interface String {
		parseNumbers(): number;
	}

	interface Error {
		toJSON(): Object;
	}

	type NotifyFrom = 'top' | 'bottom';
	type NotifyAlign = 'left' | 'center' | 'right';

	interface JQueryStatic {
		notify: (
			content: { icon: string; message: string },
			options: { type: ColorTypes; timer: number; placement: { from: NotifyFrom; align: NotifyAlign } }
		) => void;
	}

	interface Window {
		$: JQueryStatic;
		jQuery: JQueryStatic;
	}
}

export {};
