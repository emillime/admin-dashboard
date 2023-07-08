

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/(app)/settings/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.bcc36156.js","_app/immutable/chunks/scheduler.a70eca57.js","_app/immutable/chunks/index.fec47d3a.js","_app/immutable/chunks/localDb.52dd18f1.js","_app/immutable/chunks/jwtUtils.fbb3dbd8.js"];
export const stylesheets = [];
export const fonts = [];
