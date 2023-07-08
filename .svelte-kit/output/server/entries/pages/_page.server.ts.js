import { r as redirect, f as fail } from "../../chunks/index.js";
import "../../chunks/localDb.js";
import { p as parseJwt } from "../../chunks/jwtUtils.js";
const BASE_URL = "https://923vmokr87.execute-api.eu-central-1.amazonaws.com/production";
async function authorize(email, password) {
  const response = await fetch(`${BASE_URL}/authorization`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    throw new Error("Failed to authorize");
  }
  const data = await response.json();
  if (data.msg != "authorized") {
    throw new Error("Failed to authorize");
  }
  return data.token;
}
const load = async ({ locals }) => {
  if (locals.token)
    throw redirect(307, "/dashboard");
};
const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    const email = data.get("email")?.toString();
    const password = data.get("password")?.toString();
    if (email == null || password == null || email.length === 0 || password.length === 0) {
      return fail(422, {
        error: "Email eller lösenord får inte vara tomt"
      });
    }
    let token;
    try {
      token = await authorize(email, password);
    } catch (error) {
      return fail(401, {
        error: "Fel email eller lösenord"
      });
    }
    const tokenData = parseJwt(token);
    cookies.set("token", token, {
      path: "/",
      expires: new Date(tokenData.exp * 1e3),
      httpOnly: false
    });
    throw redirect(303, "/dashboard");
  }
};
export {
  actions,
  load
};
