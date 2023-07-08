import { c as create_ssr_component, d as add_attribute, v as validate_component, f as escape, b as subscribe, n as noop } from "../../../../chunks/ssr.js";
import "chartjs-adapter-luxon";
import "chart.js/auto";
import { l as localDb } from "../../../../chunks/localDb.js";
import { F as FriendList } from "../../../../chunks/FriendList.js";
import { F as Fa } from "../../../../chunks/fa.js";
import { faChartBar } from "@fortawesome/free-regular-svg-icons";
import { liveQuery } from "dexie";
import { f as filterUniqueBookings } from "../../../../chunks/utils.js";
import "@easepick/core";
import "@easepick/range-plugin";
import "@easepick/preset-plugin";
import "@easepick/time-plugin";
const CardLineChart = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data = void 0 } = $$props;
  let lineChartCanvas;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  {
    if (data != void 0 && data.length > 0) {
      new Date(data[0].x);
      new Date(data[data.length - 1]?.x);
    }
  }
  return `<div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-slate-700"><div class="rounded-t mb-0 px-4 py-3 bg-transparent" data-svelte-h="svelte-ycvru9"><div class="flex flex-wrap items-center"><div class="relative w-full max-w-full flex-grow flex-1"><h6 class="uppercase text-slate-100 mb-1 text-xs font-semibold">Overview</h6> <h2 class="text-white text-xl font-semibold">Sales value</h2></div></div></div> <div class="p-4 flex-auto"> <div class="relative h-350-px"><canvas id="line-chart"${add_attribute("this", lineChartCanvas, 0)}></canvas></div></div></div>`;
});
const Dashboard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let chartData;
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    $$rendered = `${validate_component(CardLineChart, "CardLineChart").$$render(
      $$result,
      { data: chartData },
      {
        data: ($$value) => {
          chartData = $$value;
          $$settled = false;
        }
      },
      {}
    )} `;
  } while (!$$settled);
  return $$rendered;
});
const CardStats = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { statSubtitle = "Traffic" } = $$props;
  let { statTitle = "350,897" } = $$props;
  let { statArrow = "up" } = $$props;
  let { statPercent = "3.48" } = $$props;
  let { statPercentColor = "text-emerald-500" } = $$props;
  let { statDescripiron = "Since last month" } = $$props;
  let { statIcon = faChartBar } = $$props;
  let { statIconColor = "bg-red-500" } = $$props;
  if ($$props.statSubtitle === void 0 && $$bindings.statSubtitle && statSubtitle !== void 0)
    $$bindings.statSubtitle(statSubtitle);
  if ($$props.statTitle === void 0 && $$bindings.statTitle && statTitle !== void 0)
    $$bindings.statTitle(statTitle);
  if ($$props.statArrow === void 0 && $$bindings.statArrow && statArrow !== void 0)
    $$bindings.statArrow(statArrow);
  if ($$props.statPercent === void 0 && $$bindings.statPercent && statPercent !== void 0)
    $$bindings.statPercent(statPercent);
  if ($$props.statPercentColor === void 0 && $$bindings.statPercentColor && statPercentColor !== void 0)
    $$bindings.statPercentColor(statPercentColor);
  if ($$props.statDescripiron === void 0 && $$bindings.statDescripiron && statDescripiron !== void 0)
    $$bindings.statDescripiron(statDescripiron);
  if ($$props.statIcon === void 0 && $$bindings.statIcon && statIcon !== void 0)
    $$bindings.statIcon(statIcon);
  if ($$props.statIconColor === void 0 && $$bindings.statIconColor && statIconColor !== void 0)
    $$bindings.statIconColor(statIconColor);
  return `<div class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg"><div class="flex-auto p-4"><div class="flex flex-wrap"><div class="relative w-full pr-4 max-w-full flex-grow flex-1"><h5 class="text-slate-400 uppercase font-bold text-xs">${escape(statSubtitle)}</h5> <span class="font-semibold text-xl text-slate-700">${escape(statTitle)}</span></div> <div class="relative w-auto pl-4 flex-initial"><div class="${"text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full " + escape(statIconColor, true)}">${validate_component(Fa, "Fa").$$render($$result, { icon: statIcon }, {}, {})}</div></div></div> <p class="text-sm text-slate-400 mt-4"><span class="${"mr-2 " + escape(statPercentColor, true)}"><i${add_attribute(
    "class",
    statArrow === "up" ? "fas fa-arrow-up" : "fas fa-arrow-down",
    0
  )}></i> ${escape(statPercent)}%</span> <span class="whitespace-nowrap">${escape(statDescripiron)}</span></p></div></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let bookings;
  let $bookings, $$unsubscribe_bookings = noop, $$subscribe_bookings = () => ($$unsubscribe_bookings(), $$unsubscribe_bookings = subscribe(bookings, ($$value) => $bookings = $$value), bookings);
  let datePicker;
  let startDate = /* @__PURE__ */ new Date();
  let endDate = /* @__PURE__ */ new Date();
  $$subscribe_bookings(bookings = liveQuery(async () => {
    const bookings2 = await localDb.bookings.where("startTime").between(startDate, endDate).toArray();
    return filterUniqueBookings(bookings2);
  }));
  $$unsubscribe_bookings();
  return `<div class="flex justify-center align-middle"><input placeholder="Datum" class="w-64 h-10 px-3 mb-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"${add_attribute("this", datePicker, 0)}></div> ${$bookings ? `${validate_component(CardStats, "CardStats").$$render(
    $$result,
    {
      statSubtitle: "Ordrar",
      statTitle: $bookings.length.toString()
    },
    {},
    {}
  )}` : ``} ${validate_component(Dashboard, "Dashboard").$$render($$result, {}, {}, {})} ${validate_component(FriendList, "FriendList").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
