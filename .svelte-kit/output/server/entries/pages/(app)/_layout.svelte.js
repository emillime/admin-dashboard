import { g as getContext, c as create_ssr_component, b as subscribe, e as each, d as add_attribute, f as escape, v as validate_component } from "../../../chunks/ssr.js";
import { F as Fa } from "../../../chunks/fa.js";
import { faListUl, faChartLine, faBriefcase } from "@fortawesome/free-solid-svg-icons";
import { g as getTokenFromCookie } from "../../../chunks/jwtUtils.js";
const getStores = () => {
  const stores = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
const navigating = {
  subscribe(fn) {
    const store = getStores().navigating;
    return store.subscribe(fn);
  }
};
const PillNavbar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  const menuItems = [
    {
      icon: faListUl,
      text: "Dagens",
      path: "/today"
    },
    {
      icon: faChartLine,
      text: "Statistik",
      path: "/dashboard"
    },
    {
      icon: faBriefcase,
      text: "Inställningar",
      path: "/settings"
    }
  ];
  $$unsubscribe_page();
  return `<nav class="flex flex-nowrap justify-center"><ul class="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row w-11/12">${each(menuItems, (item) => {
    return `<li class="-mb-px mr-2 last:mr-0 flex-auto text-center"><a${add_attribute("href", item.path, 0)} class="${"text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " + escape(
      $page.url.pathname === item.path ? "text-white bg-sky-600" : "text-sky-600 bg-white",
      true
    )}">${validate_component(Fa, "Fa").$$render(
      $$result,
      {
        icon: item.icon,
        class: "inline text-center mr-1"
      },
      {},
      {}
    )} ${escape(item.text)}</a> </li>`;
  })}</ul></nav>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $navigating, $$unsubscribe_navigating;
  $$unsubscribe_navigating = subscribe(navigating, (value) => $navigating = value);
  {
    if ($navigating) {
      const token = getTokenFromCookie();
      if (!token) {
        window.location.href = "/";
      }
    }
  }
  $$unsubscribe_navigating();
  return `<header class="bg-slate-100">${validate_component(PillNavbar, "PillNavbar").$$render($$result, {}, {}, {})}</header> <main class="w-screen h-screen bg-slate-100">${slots.default ? slots.default({}) : ``}</main>`;
});
export {
  Layout as default
};
