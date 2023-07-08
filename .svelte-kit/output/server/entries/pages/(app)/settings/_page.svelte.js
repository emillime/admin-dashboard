import { c as create_ssr_component } from "../../../../chunks/ssr.js";
import "../../../../chunks/localDb.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<button class="ml-10 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded" data-svelte-h="svelte-7cziwo">Logout</button> <button class="ml-10 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded" data-svelte-h="svelte-2cy0sl">Delete Database</button>`;
});
export {
  Page as default
};
