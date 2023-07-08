

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/today/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.8b6d15c5.js","_app/immutable/chunks/scheduler.a70eca57.js","_app/immutable/chunks/index.fec47d3a.js","_app/immutable/chunks/localDb.52dd18f1.js","_app/immutable/chunks/utils.dec7ddc5.js","_app/immutable/chunks/each.13dd49ab.js","_app/immutable/chunks/index.f1d07f17.js","_app/immutable/chunks/api.75b8bb29.js","_app/immutable/chunks/jwtUtils.fbb3dbd8.js","_app/immutable/chunks/fa.28829ef6.js","_app/immutable/chunks/preload-helper.41c905a7.js"];
export const stylesheets = ["_app/immutable/assets/fa.95b16411.css"];
export const fonts = [];
