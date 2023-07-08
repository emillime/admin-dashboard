import { c as create_ssr_component, f as escape, v as validate_component, e as each, b as subscribe, d as add_attribute, n as noop } from "../../../../chunks/ssr.js";
import { liveQuery } from "dexie";
import { l as localDb } from "../../../../chunks/localDb.js";
import { f as filterUniqueBookings } from "../../../../chunks/utils.js";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import { DateTime } from "luxon";
import { F as Fa } from "../../../../chunks/fa.js";
const CardTable = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { date } = $$props;
  let { bookings } = $$props;
  if ($$props.date === void 0 && $$bindings.date && date !== void 0)
    $$bindings.date(date);
  if ($$props.bookings === void 0 && $$bindings.bookings && bookings !== void 0)
    $$bindings.bookings(bookings);
  return `<div class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white"><div class="rounded-t mb-0 px-4 py-3 border-0"><div class="flex flex-wrap items-center"><h3 class="mr-4 font-semibold text-lg text-slate-700">Bokningar (${escape(bookings?.length)})</h3> <button class="m-1 text-sky-600 hover:text-sky-900">${validate_component(Fa, "Fa").$$render(
    $$result,
    {
      icon: faCaretRight,
      rotate: 180,
      size: "1.5x"
    },
    {},
    {}
  )}</button> <h3 class="font-semibold text-lg text-slate-700 group relative">${escape(`${DateTime.fromJSDate(date).toRelativeCalendar()}`)} <span class="pointer-events-none absolute -top-7 left-0 w-max opacity-0 transition-opacity group-hover:opacity-90 bg-sky-200 rounded-md text-sm">${escape(date.toLocaleDateString())}</span></h3> <button class="m-1 text-sky-600 hover:text-sky-900">${validate_component(Fa, "Fa").$$render($$result, { icon: faCaretRight, size: "1.5x" }, {}, {})}</button></div></div> <div class="block w-full overflow-x-auto"><table class="items-center w-full bg-transparent border-collapse"><thead data-svelte-h="svelte-140iagi"><tr><th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-50 text-slate-500 border-slate-100">Tid</th> <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-50 text-slate-500 border-slate-100">Namn</th> <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-50 text-slate-500 border-slate-100">Telefonnummer</th> <th class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-50 text-slate-500 border-slate-100">Antal</th></tr></thead> <tbody>${bookings ? `${each(bookings, (booking) => {
    return `<tr><td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"><span class="text-slate-600">${escape(`${DateTime.fromJSDate(booking.startTime).toFormat("HH:mm")} - ${DateTime.fromJSDate(booking.endTime).toFormat("HH:mm")}`)} </span></td> <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"><span class="font-bold text-slate-600">${escape(booking.bookingId.customerInfo.firstName)} ${escape(booking.bookingId.customerInfo.lastName)} </span></td> <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"><a href="${"tel:+" + escape(booking.bookingId.customerInfo.mobile, true)}">+${escape(booking.bookingId.customerInfo.mobile)}</a></td> <td class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">${each(Object.values(booking.bookingId.priceObject.products), (product) => {
      return `${escape(product.quantity)} ${escape(product.productName)} <br>`;
    })}</td> </tr>`;
  })}` : ``}</tbody></table></div></div>`;
});
const GanttSchedule = create_ssr_component(($$result, $$props, $$bindings, slots$1) => {
  let $$unsubscribe_bookings;
  let { date } = $$props;
  let { bookings } = $$props;
  $$unsubscribe_bookings = subscribe(bookings, (value) => value);
  let ganttElement;
  if ($$props.date === void 0 && $$bindings.date && date !== void 0)
    $$bindings.date(date);
  if ($$props.bookings === void 0 && $$bindings.bookings && bookings !== void 0)
    $$bindings.bookings(bookings);
  $$unsubscribe_bookings();
  return `<div${add_attribute("this", ganttElement, 0)}></div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let end;
  let bookings;
  let uniqueBookings;
  let $bookings, $$unsubscribe_bookings = noop, $$subscribe_bookings = () => ($$unsubscribe_bookings(), $$unsubscribe_bookings = subscribe(bookings, ($$value) => $bookings = $$value), bookings);
  let start = DateTime.now().startOf("day").toJSDate();
  let $$settled;
  let $$rendered;
  do {
    $$settled = true;
    end = DateTime.fromJSDate(start).endOf("day").toJSDate();
    $$subscribe_bookings(bookings = liveQuery(async () => {
      return localDb.bookings.where("startTime").aboveOrEqual(start).and((booking) => booking.startTime <= end).toArray();
    }));
    uniqueBookings = $bookings != null ? filterUniqueBookings($bookings) : [];
    $$rendered = `${$bookings ? `${validate_component(GanttSchedule, "GanttSchedule").$$render(
      $$result,
      { bookings, date: start },
      {
        date: ($$value) => {
          start = $$value;
          $$settled = false;
        }
      },
      {}
    )} ${validate_component(CardTable, "CardTable").$$render(
      $$result,
      { bookings: uniqueBookings, date: start },
      {
        date: ($$value) => {
          start = $$value;
          $$settled = false;
        }
      },
      {}
    )}` : ``}`;
  } while (!$$settled);
  $$unsubscribe_bookings();
  return $$rendered;
});
export {
  Page as default
};
