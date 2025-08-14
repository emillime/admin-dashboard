import * as client_hooks from '../../../src/hooks.client.ts';

export { matchers } from './matchers.js';

export const nodes = [
	() => import('./nodes/0'),
	() => import('./nodes/1'),
	() => import('./nodes/2'),
	() => import('./nodes/3'),
	() => import('./nodes/4'),
	() => import('./nodes/5'),
	() => import('./nodes/6'),
	() => import('./nodes/7'),
	() => import('./nodes/8'),
	() => import('./nodes/9'),
	() => import('./nodes/10')
];

export const server_loads = [];

export const dictionary = {
		"/": [~3],
		"/(app)/coupons": [4,[2]],
		"/(app)/customers": [5,[2]],
		"/(app)/dashboard": [6,[2]],
		"/(app)/report": [7,[2]],
		"/(app)/report/coupons": [8,[2]],
		"/(app)/settings": [9,[2]],
		"/(app)/today": [10,[2]]
	};

export const hooks = {
	handleError: client_hooks.handleError || (({ error }) => { console.error(error) }),
};

export { default as root } from '../root.svelte';