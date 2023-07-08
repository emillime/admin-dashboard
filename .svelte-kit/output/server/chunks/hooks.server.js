import { v as validateToken } from "./jwtUtils.js";
import { r as redirect } from "./index.js";
const handle = async ({ event, resolve }) => {
  const token = event.locals.token || event.cookies?.get("token");
  if (token) {
    event.locals.token = validateToken(token);
  }
  if (event.route.id?.startsWith("/(app)")) {
    if (event.locals.token == null || event.locals.token.length === 0) {
      throw redirect(303, "/");
    }
  }
  return resolve(event);
};
export {
  handle
};
