import * as server from '../entries/pages/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.51055db4.js","_app/immutable/chunks/scheduler.a70eca57.js","_app/immutable/chunks/index.fec47d3a.js","_app/immutable/chunks/fa.28829ef6.js","_app/immutable/chunks/index.f1d07f17.js","_app/immutable/chunks/parse.bee59afc.js","_app/immutable/chunks/singletons.4d12ce3b.js"];
export const stylesheets = ["_app/immutable/assets/fa.95b16411.css"];
export const fonts = [];
