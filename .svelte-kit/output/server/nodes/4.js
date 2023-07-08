

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/dashboard/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.dd717f0c.js","_app/immutable/chunks/scheduler.a70eca57.js","_app/immutable/chunks/index.fec47d3a.js","_app/immutable/chunks/api.04474085.js","_app/immutable/chunks/jwtUtils.fbb3dbd8.js","_app/immutable/chunks/localDb.52dd18f1.js","_app/immutable/chunks/FriendList.25a27e44.js","_app/immutable/chunks/each.13dd49ab.js","_app/immutable/chunks/utils.a31f8b5c.js","_app/immutable/chunks/fa.28829ef6.js"];
export const stylesheets = ["_app/immutable/assets/fa.95b16411.css"];
export const fonts = [];
