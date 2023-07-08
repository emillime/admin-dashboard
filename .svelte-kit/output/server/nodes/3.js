import * as server from '../entries/pages/_page.server.ts.js';

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/3.c4cc73df.js","_app/immutable/chunks/scheduler.a70eca57.js","_app/immutable/chunks/index.fec47d3a.js","_app/immutable/chunks/fa.28829ef6.js","_app/immutable/chunks/index.d3a98df3.js","_app/immutable/chunks/parse.bee59afc.js","_app/immutable/chunks/singletons.3a33352e.js"];
export const stylesheets = ["_app/immutable/assets/fa.95b16411.css"];
export const fonts = [];
