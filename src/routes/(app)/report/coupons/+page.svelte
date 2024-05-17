<script lang="ts">
  import { localDb } from "$lib/localDb";
  import { easepick } from "@easepick/core";
  import { PresetPlugin } from "@easepick/preset-plugin";
  import { RangePlugin } from "@easepick/range-plugin";
  import { TimePlugin } from "@easepick/time-plugin";
  import { liveQuery } from "dexie";
  import { DateTime } from "luxon";
  import { onDestroy, onMount } from "svelte";
  import { writable } from "svelte/store";
  import { Render, Subscribe, createTable } from "svelte-headless-table";
  import { addHiddenColumns } from "svelte-headless-table/plugins";

  let picker: easepick.Core;

  let datePicker: HTMLElement;

  let startDate = DateTime.now().minus({ month: 1 }).startOf("month");
  let endDate = startDate.endOf("month");

  const data = writable<CouponReport[]>([]);

  $: coupons = liveQuery(async () => {
    return localDb.coupons
      .where("createdAt")
      .between(startDate.toJSDate(), endDate.toJSDate(), true, true)
      .filter(
        (coupon) =>
          coupon.createdByUserType === "admin" &&
          coupon.couponType === "giftCard"
      )
      .toArray();
  });

  $: generateFlexReport($coupons);

  const table = createTable(data, {
    hiddenCols: addHiddenColumns(),
  });

  const columns = table.createColumns([
    table.column({
      header: "Skapad",
      accessor: "createdAt",
    }),
    table.column({
      header: "Kod",
      accessor: "code",
    }),
    table.column({
      header: "Belopp",
      accessor: "discountAmount",
    }),
    table.column({
      header: "Användningar",
      accessor: "used",
    }),
    table.column({
      header: "Använt belopp",
      accessor: "totalSpent",
    }),
    table.column({
      header: "Betalt",
      accessor: "grossRevenue",
    }),
  ]);

  const {
    headerRows,
    rows,
    tableAttrs,
    tableBodyAttrs,
  } = table.createViewModel(columns);

  async function generateFlexReport(coupons: Coupon[]) {
    if (coupons == null || coupons.length === 0) {
      data.set([]);
      return;
    }

    console.log("Generating flex report for: ", startDate, endDate);
    console.log(coupons);

    let rows: CouponReport[] = await Promise.all(
      coupons.map(async (coupon) => {
        let totalSpent = await localDb.bookings
          .where("bookingId.coupon")
          .equals(coupon.code)
          .toArray()
          .then((bookings) => {
            return bookings.reduce((acc, booking) => {
              return acc + booking.bookingId.couponAmount;
            }, 0);
          });

        return {
          createdAt: coupon.createdAt,
          updatedAt: coupon.updatedAt,
          active: coupon.active,
          code: coupon.code,
          couponType: coupon.couponType,
          discountAmount: coupon.discountAmount,
          fromDate: coupon.fromDate,
          toDate: coupon.toDate,
          paddleDate: coupon.paddleDate,
          paddleDateFrom: coupon.paddleDateFrom,
          paddleDateTo: coupon.paddleDateTo,
          allSuppliers: coupon.allSuppliers,
          used: coupon.used,
          myUses: coupon.used,
          totalSpent: totalSpent,
          grossRevenue:
            coupon.discountAmount === 3000 ? 1990 : coupon.discountAmount,
        } satisfies CouponReport;
      })
    );

    data.set(rows);
  }

  onMount(async () => {
    let today = DateTime.now();
    picker = new easepick.create({
      element: datePicker,
      css: [
        "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css",
        "https://cdn.jsdelivr.net/npm/@easepick/range-plugin@1.2.1/dist/index.css",
        "https://cdn.jsdelivr.net/npm/@easepick/preset-plugin@1.2.1/dist/index.css",
        "https://cdn.jsdelivr.net/npm/@easepick/time-plugin@1.2.1/dist/index.css",
        "datepicker.css",
      ],
      zIndex: 10,
      format: "YYYY/MM/DD HH:mm",
      inline: false,
      header: "",
      RangePlugin: {
        repick: false,
        strict: true,
        // @ts-ignore Wrong types, JSDate is ok
        startDate: startDate,
        // @ts-ignore Wrong types, JSDate is ok
        endDate: endDate,
        locale: { one: "dag", other: "dagar" },
      },
      PresetPlugin: {
        customPreset: {
          Idag: [
            today.startOf("day").toJSDate(),
            today.endOf("day").toJSDate(),
          ],
          "Denna vecka": [
            today.startOf("week").toJSDate(),
            today.endOf("week").toJSDate(),
          ],
          "Förra veckan": [
            today.startOf("week").minus({ weeks: 1 }).toJSDate(),
            today.endOf("week").minus({ weeks: 1 }).toJSDate(),
          ],
          "Denna månad": [
            today.startOf("month").toJSDate(),
            today.endOf("month").toJSDate(),
          ],
          "Förra månaden": [
            today.startOf("month").minus({ months: 1 }).toJSDate(),
            today.endOf("month").minus({ months: 1 }).toJSDate(),
          ],
          "Detta år": [
            today.startOf("year").toJSDate(),
            today.endOf("year").toJSDate(),
          ],
        },
      },
      TimePlugin: {
        stepMinutes: 60,
      },
      plugins: [RangePlugin, PresetPlugin, TimePlugin],
      setup(p) {
        p.setStartTime("00:00");
        p.setEndTime("23:00");
        p.on("render", (e) => {
          const { view, date, target } = e.detail;
          if (view === "Main") {
            reformatTimePicker(p);
          }
        });
        p.on("select", (event: CustomEvent) => {
          const { start, end } = event.detail;
          startDate = start;
          endDate = end;
        });
      },
    });
  });

  function reformatTimePicker(p: easepick.Core) {
    // Hide the minutes since we only want to show full hours
    p.ui.container
      .querySelectorAll(
        '.time-plugin-container > .time-plugin-custom-block > select[name$="[mm]"]'
      )
      .forEach((el) => {
        (el as HTMLSelectElement).hidden = true;
      });

    // Trigger event when time is changed manually
    p.ui.container
      .querySelectorAll(
        '.time-plugin-container > .time-plugin-custom-block > select[name$="[HH]"]'
      )
      .forEach((el) => {
        (el as HTMLSelectElement).onchange = (e) => {
          let detail = {
            start: p.getStartDate(),
            end: p.getEndDate(),
          };
          if ((el as HTMLSelectElement).name.includes("start")) {
            detail.start?.setHours(parseInt((el as HTMLSelectElement).value));
          } else if ((el as HTMLSelectElement).name.includes("end")) {
            detail.end?.setHours(parseInt((el as HTMLSelectElement).value));
          }
          if (detail.start && detail.end) {
            p.trigger("select", detail);
          }
        };
      });

    // Format hours to look better
    p.ui.container
      .querySelectorAll(
        '.time-plugin-container > .time-plugin-custom-block > select[name$="[HH]"] > option'
      )
      .forEach((el) => {
        el.textContent = `0${el.textContent}`.slice(-2);
        el.textContent = `${el.textContent}:00`;
      });
  }

  onDestroy(() => {
    if (picker) {
      picker.off("render", () => {});
      picker.off("select", () => {});
      picker.ui.container
        .querySelectorAll(
          '.time-plugin-container > .time-plugin-custom-block > select[name$="[HH]"]'
        )
        .forEach((el) => {
          (el as HTMLSelectElement).onchange = null;
        });
    }
  });
</script>

<div class="flex justify-center align-middle">
  <input
    bind:this={datePicker}
    placeholder="Datum"
    class="w-64 h-10 px-3 mb-3 min-w-[300px] text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
  />
</div>

<div class="w-full overflow-x-auto">
  <table class="w-full bg-transparent border-collapse" {...$tableAttrs}>
    <thead>
      {#each $headerRows as headerRow (headerRow.id)}
        <Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
          <tr {...rowAttrs}>
            {#each headerRow.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs>
                <th
                  class="px-6 border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-50 text-slate-500 border-slate-100"
                  {...attrs}
                >
                  <Render of={cell.render()} />
                </th>
              </Subscribe>
            {/each}
          </tr>
        </Subscribe>
      {/each}
    </thead>
    <tbody {...$tableBodyAttrs}>
      {#each $rows as row (row.id)}
        <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
          <tr {...rowAttrs}>
            {#each row.cells as cell (cell.id)}
              <Subscribe attrs={cell.attrs()} let:attrs>
                <td
                  class="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
                  {...attrs}
                >
                  <Render of={cell.render()} />
                </td>
              </Subscribe>
            {/each}
          </tr>
        </Subscribe>
      {/each}
    </tbody>
  </table>
</div>
