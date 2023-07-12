<script lang="ts">
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
  import { onMount } from "svelte";
  import { DateTime } from "luxon";

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
    return filterUniqueBookings(bookings);
  });

  onMount(async () => {
    const picker = new easepick.create({
      element: datePicker,
      css: [
        "https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css",
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
</script>

<div class="flex justify-center align-middle">
  <input
    bind:this={datePicker}
    placeholder="Datum"
    class="w-64 h-10 px-3 mb-3 min-w-[300px] text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
  />
</div>
{#if $bookings}
  <CardStats statSubtitle="Ordrar" statTitle={$bookings.length.toString()} />
{/if}
<Dashboard />
<FriendList />
