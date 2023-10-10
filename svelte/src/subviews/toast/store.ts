
export class ToastModel {

	public id?: number;
	public type?: string;
	public dismissible?: boolean;
	public timeout?: number;
	public message?: string;
}

import { writable } from "svelte/store";

export const toasts = writable<ToastModel[]>([]);

export const addToast = (toast: ToastModel) => {

	// Create a unique ID so we can easily find/remove it
	// if it is dismissible/has a timeout.
	const id = Math.floor(Math.random() * 10000);

	// Setup some sensible defaults for a toast.
	const defaults: ToastModel = { id: id, type: "info", dismissible: true, timeout: 3000, message: "" };

	// Push the toast to the top of the list of toasts
	toasts.update((all) => [{ ...defaults, ...toast }, ...all]);

	// If toast is dismissible, dismiss it after "timeout" amount of time.
	if (toast.timeout) setTimeout(() => dismissToast(id), toast.timeout);
};

export const dismissToast = (id: number) => {
	toasts.update((all) => all.filter((t: ToastModel) => t.id !== id));
};
