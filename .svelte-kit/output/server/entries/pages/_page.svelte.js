import { c as create_ssr_component, v as validate_component, f as escape } from "../../chunks/ssr.js";
import { F as Fa } from "../../chunks/fa.js";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import "devalue";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { form } = $$props;
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  return `<main><section class="relative w-full h-full py-40 min-h-screen"><div class="absolute top-0 w-full h-full bg-slate-100 bg-no-repeat bg-full"></div> <div class="container mx-auto px-4 h-full"><div class="flex content-center items-center justify-center h-full"><div class="w-full lg:w-4/12 px-4"><div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-xl rounded-lg bg-slate-200 border-0"><div class="flex-auto px-4 lg:px-10 py-10"><form method="POST"><div class="relative w-full mb-3"><label class="inline align-middle uppercase text-slate-600 text-xs font-bold mb-2" for="grid-email">E-post ${validate_component(Fa, "Fa").$$render(
    $$result,
    {
      icon: faUser,
      fw: true,
      class: "inline text-center ml-1"
    },
    {},
    {}
  )}</label> <input id="grid-email" name="email" type="email" class="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="E-post"></div> <div class="relative w-full mb-3"><label class="inline uppercase text-slate-600 text-xs font-bold mb-2" for="grid-password">Lösenord
										${validate_component(Fa, "Fa").$$render(
    $$result,
    {
      icon: faLock,
      fw: true,
      class: "inline text-center ml-1"
    },
    {},
    {}
  )}</label> <input id="grid-password" name="password" type="password" class="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="Lösenord"></div> <div class="text-center mt-6"><button class="bg-sky-600 text-white active:bg-slate-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150" type="submit" data-svelte-h="svelte-16ks9pf">Logga in</button> ${form?.error && form?.error !== "" ? `<div class="text-sm text-red-500"><small>${escape(form?.error)}</small></div>` : ``}</div></form></div></div></div></div></div></section></main>`;
});
export {
  Page as default
};
