

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/db/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.b17fd6ec.js","_app/immutable/chunks/scheduler.a70eca57.js","_app/immutable/chunks/index.fec47d3a.js","_app/immutable/chunks/localDb.52dd18f1.js","_app/immutable/chunks/FriendList.bc7f4f65.js","_app/immutable/chunks/each.13dd49ab.js","_app/immutable/chunks/utils.dec7ddc5.js"];
export const stylesheets = [];
export const fonts = [];
