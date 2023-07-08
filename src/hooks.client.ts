import type { HandleClientError } from "@sveltejs/kit";

export const handleError = (async ({ error, event }) => {
    console.error(error, { extra: { event } });

    return {
        message: 'Unexpected error!'
    };
}) satisfies HandleClientError;