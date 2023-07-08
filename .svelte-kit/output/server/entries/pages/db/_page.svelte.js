import { c as create_ssr_component, v as validate_component } from "../../../chunks/ssr.js";
import "../../../chunks/localDb.js";
import { F as FriendList } from "../../../chunks/FriendList.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<h1 data-svelte-h="svelte-15uoadi">My simple Dexie app</h1>  <h2 data-svelte-h="svelte-1dmlwxr">Result</h2> ${validate_component(FriendList, "FriendList").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
