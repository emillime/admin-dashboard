import { fail, redirect } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { authorize } from "../lib/api";
import { parseJwt } from "../utils/jwtUtils";

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.token) throw redirect(307, '/today');
}

export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();

        const email = data.get('email')?.toString();
        const password = data.get('password')?.toString();

        if (email == null || password == null || email.length === 0 || password.length === 0) {
            return fail(422, {
                error: "Email eller lösenord får inte vara tomt"
            });
        }

        let token: string;
        try {   
            token = await authorize(email, password);
        } catch (error) {
            return fail(401, {
                error: "Fel email eller lösenord"
            });
        }

        const tokenData = parseJwt(token);

		cookies.set('token', token, { 
            path: '/',
            expires: new Date(tokenData.exp*1000),
            httpOnly: false,
        });

		throw redirect(303, '/today');
	}
};