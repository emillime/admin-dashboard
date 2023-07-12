<script lang="ts">
  import {
    faSackDollar,
    faSackXmark,
    faMoneyBill1Wave,
    faCoins,
    faMoneyBillTrendUp,
    faPiggyBank,
	faMagnifyingGlassChart,
    type IconDefinition,
  } from "@fortawesome/free-solid-svg-icons";

  import Dashboard from "../../../components/Dashboard.svelte";
  import FriendList from "$lib/components/FriendList.svelte";
  import CardStats from "../../../components/CardStats.svelte";
  import { liveQuery } from "dexie";
  import { localDb } from "$lib/localDb";
  import { easepick } from "@easepick/core";
  import { RangePlugin } from "@easepick/range-plugin";
  import { PresetPlugin } from "@easepick/preset-plugin";
  import { TimePlugin } from "@easepick/time-plugin";
  import { filterUniqueBookings } from "$lib/utils";
  import { onDestroy, onMount } from "svelte";
  import { DateTime } from "luxon";

  let picker: easepick.Core;

  let datePicker: HTMLElement;
  let datePickerEnd: HTMLElement;
  let startDate: Date = DateTime.now().startOf("week").toJSDate();
  let endDate: Date = DateTime.fromJSDate(startDate).endOf("week").toJSDate();

  $: bookings = liveQuery(async () => {
    const bookings = await localDb.bookings
      .where("startTime")
      .aboveOrEqual(startDate)
      .and((booking) => booking.startTime <= endDate)
      .toArray();
    return bookings;
  });

  $: uniqueBookings = filterUniqueBookings($bookings ?? []);

  $: totalSales = Math.round(
    uniqueBookings.reduce((sum, booking) => {
      return sum + booking.bookingId.paidAmount;
    }, 0)
  );

  function getSalesIcon(amount: number): IconDefinition {
    switch (true) {
      case amount < 10:
        return faSackXmark;
      case amount < 500:
        return faCoins;
      case amount < 1300:
        return faMoneyBill1Wave;
      case amount < 2500:
        return faMoneyBillTrendUp;
      case amount < 5000:
        return faPiggyBank;
      default:
        return faSackDollar;
    }
  }

  function getAvgSales(totalValue: number, numberOfBookings: number) {
	if (numberOfBookings === 0) {
		return 0;
	}
	return Math.round(totalValue / numberOfBookings);
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
  });

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
{#if $bookings}
<div class="flex flex-row flex-wrap justify-evenly">
  <CardStats
    statSubtitle="Ordrar"
    statTitle={uniqueBookings.length.toString()}
  />
  <CardStats
    statSubtitle="Snittorder"
    statTitle={getAvgSales(totalSales, uniqueBookings.length).toLocaleString() + " kr"}
	statIcon={getSalesIcon(getAvgSales(totalSales, uniqueBookings.length))}
  />
  <CardStats
    statSubtitle="Intäkter"
    statTitle={totalSales.toLocaleString() + " kr"}
    statIcon={getSalesIcon(totalSales)}
  />
</div>
{/if}
<Dashboard />
<FriendList />
