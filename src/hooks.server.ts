import { validateToken } from './utils/jwtUtils';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
	const token = event.locals.token || event.cookies?.get('token');

	if (token) {
		event.locals.token = validateToken(token);
	}

	if (event.route.id?.startsWith('/(app)')) {
		if (event.locals.token == null || event.locals.token.length === 0) {
			console.log(event.url)
			throw redirect(303, `/?redirectTo=${event.url.pathname}${event.url.search}`);
		}
	}

	return resolve(event);
}) satisfies Handle;
