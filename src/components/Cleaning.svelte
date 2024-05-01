<script lang="ts">
  import { getSlots } from "$lib/api";
  import { onDestroy, onMount } from "svelte";
  import { getTokenFromCookie } from "../utils/jwtUtils";
  import { DateTime } from "luxon";
  import { easepick } from "@easepick/core";
  import { TimePlugin } from "@easepick/time-plugin";
  import { liveQuery } from "dexie";
  import { localDb } from "$lib/localDb";

  let datePicker: HTMLElement;
  let picker: easepick.Core;

  let cleanDate = DateTime.now().startOf("week");

  const token = getTokenFromCookie() ?? "";
  const slotsPromise = getSlots(token);

  $: bookings = liveQuery(async () => {
    const bookings = await localDb.bookings
      .where("startTime")
      .aboveOrEqual(cleanDate.toJSDate())
      .and((booking) => booking.startTime <= DateTime.now().toJSDate())
      .toArray();
    return bookings;
  });

  onMount(() => {
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
      TimePlugin: {
        stepMinutes: 60,
      },
      plugins: [TimePlugin],
      setup(p) {
        p.setTime("23:00");
        p.on("render", (e) => {
          const { view, date, target } = e.detail;
          if (view === "Main") {
            reformatTimePicker(p);
          }
        });
        p.on("select", (event: CustomEvent) => {
          console.log(event.detail.date);
          cleanDate = event.detail.date;
        });
      },
    });
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
            date: p.getDate(),
          };
          detail.date?.setHours(parseInt((el as HTMLSelectElement).value));
          if (detail.date) {
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

  function getColCount(slots: Slot[]) {
    let maxCol = 0;

    for (const slot of slots) {
      const col = parseInt(slot.slot[1]);

      if (col > maxCol) {
        maxCol = col;
      }
    }

    return maxCol;
  }

  function isSlotUsedSinceDate(slot: string, date: DateTime) {
    $bookings?.forEach((booking) => {
      console.log('checking: ' + booking.productSlotId.slot);
      if (booking.productSlotId.slot === slot) {
        console.log('Slot ' + slot + ' is used since ' + date.toLocaleString());
        return true;
      }
    });
    console.log('Slot ' + slot + ' not used since ' + date.toLocaleString());
    return false;
  }
</script>
<div class="flex justify-center align-middle">
  <input
    bind:this={datePicker}
    placeholder="Datum"
    class="w-64 h-10 px-3 mb-3 min-w-[300px] text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
  />
</div>
{#await slotsPromise}
  <p>laddar...</p>
{:then slots}

  <!-- The below comment is needed to generate the classes -->
  <!-- Can be grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4 grid-cols-5 grid-cols-6 grid-cols-7 grid-cols-8 grid-cols-9 grid-cols-10 grid-cols-11 grid-cols-12 -->
  <div class="grid grid-cols-{getColCount(slots)} gap-2 w-fit">
    {#each slots.sort((a, b) => parseInt(b.slot[0]) - parseInt(a.slot[0]) || parseInt(a.slot[1]) - parseInt(b.slot[1])) as slot}
      <div class={`${isSlotUsedSinceDate(slot.slot, cleanDate) ? 'bg-red-600' : 'bg-sky-600'} p-5 aspect-square`}>{slot.slot}</div>
    {/each}
  </div>
{/await}
