<script lang="ts">
  import { getSlots } from "$lib/api";
  import type { Observable } from "dexie";
  import { onMount } from "svelte";
  import { getTokenFromCookie } from "../utils/jwtUtils";
  import { DateTime } from "luxon";
  import type {
    SvelteGanttComponent,
    SvelteGanttOptions,
  } from "svelte-gantt/types/gantt";
  import type { RowModel } from "svelte-gantt/types/core/row";
  import type { SvelteTask, TaskModel } from "svelte-gantt/types/core/task";
  import { percentOfPeriodDone } from "$lib/utils";

  export let date: Date;
  export let bookings: Observable<Booking[]>;
  let SvelteGantt;
  let SvelteGanttTable;

  let gantt: SvelteGanttComponent;
  let ganttElement: HTMLElement;

  let rows: RowModel[] = [];

  let currentTime = DateTime.now().toMillis();

  $: tasks = $bookings?.map((booking, index) => {
    return {
      id: index,
      amountDone: percentOfPeriodDone(currentTime, booking.startTime.getTime(), booking.endTime.getTime()),
      from: booking.startTime,
      to: booking.endTime,
      label: `${booking.bookingId.customerInfo.firstName} ${booking.bookingId.customerInfo.lastName}`,
      showButton: false,
      enableDragging: false,
      resourceId: Number(booking.productSlotId.slot),
	  classes: "border-separator",
    } ?? [];
  }) satisfies TaskModel[];

  $: if (gantt && rows && tasks) {
    gantt.$set({
      rows,
      tasks,
      from: DateTime.fromJSDate(date).startOf("day").toMillis(),
      to: DateTime.fromJSDate(date).endOf("day").toMillis(),
    });
  }

  onMount(async () => {
    SvelteGantt = (await import("svelte-gantt")).SvelteGantt;
    SvelteGanttTable = (await import("svelte-gantt")).SvelteGanttTable;

    let options: SvelteGanttOptions = {
      headers: [
        { unit: "day", format: "dd/MM/yyyy" },
        { unit: "hour", format: "hh:mm" },
      ],
      rows: [],
      tasks: [],
      timeRanges: [
        {
          id: 0,
          from: currentTime,
          to: currentTime + 60000,
          label: "Nu",
          enableResizing: false,
        },
      ],
      columnUnit: "hour",
      columnOffset: 1,
      magnetOffset: 0,
      rowHeight: 50,
      rowPadding: 6,
      fitWidth: true,
      minWidth: 2500,
      from: DateTime.fromJSDate(date).startOf("day").toMillis(),
      to: DateTime.fromJSDate(date).endOf("day").toMillis(),
      tableWidth: 75,
      tableHeaders: [
        { title: "", property: "label", width: 100, type: "tree" },
      ],
      ganttTableModules: [SvelteGanttTable],
      /*taskElementHook: (node, task) => {
            let popup: HTMLElement;
            function onHover() {
                popup = createPopup((task as unknown as TaskModel), node); // Typed wrong in svelte-gantt
            }

            function onLeave() {
                if(popup) {
                    popup.remove();
                }
            }

            node.addEventListener('mouseenter', onHover);
            node.addEventListener('mouseleave', onLeave);

            return {
                destroy() {
                    node.removeEventListener('mouseenter', onHover);
                    node.removeEventListener('mouseleave', onLeave);
                }
            }
        },*/
    };

    gantt = new SvelteGantt({
      target: ganttElement,
      props: options,
    });

    const token = getTokenFromCookie() ?? "";
    const slots = await getSlots(token);
    rows = slots.map((slot) => {
      return {
        id: Number(slot.slot),
        enableDragging: false,
        label: `Slot ${slot.slot}`,
        height: 50,
        expanded: false,
      };
    });

	setTimeout(() => {
      const ganttBody = document.getElementsByClassName("sg-timeline-body")[0];
      const timerange = document.getElementsByClassName("sg-time-range")[0];
      if (!timerange) return;
      if (!ganttBody) return;
      const currentPos = timerange.getBoundingClientRect().left;
      const scrollOffset = ganttBody.scrollLeft;
      const clientWidth = ganttBody.clientWidth;
      const target = clientWidth / 2 + 75;
      const diff = currentPos - target;
      ganttBody.scrollTo({ behavior: "smooth", left: diff + scrollOffset });
    }, 300);
  });

  function createPopup(task: TaskModel, node: HTMLElement): HTMLElement {
    const rect = node.getBoundingClientRect();
    const div = document.createElement("div");
    div.className = "sg-popup";
    div.innerHTML = `
            <div class="sg-popup-title">${task.label}</div>
            <div class="sg-popup-item">
                <div class="sg-popup-item-label">From:</div>
                <div class="sg-popup-item-value">${new Date(
                  task.from
                ).toLocaleTimeString()}</div>
            </div>
            <div class="sg-popup-item">
                <div class="sg-popup-item-label">To:</div>
                <div class="sg-popup-item-value">${new Date(
                  task.to
                ).toLocaleTimeString()}</div>
            </div>
        `;
    div.style.position = "absolute";
    div.style.top = `${rect.bottom}px`;
    div.style.left = `${rect.left + rect.width / 2}px`;
    document.body.appendChild(div);
    return div;
  }
</script>

<div bind:this={ganttElement} />

<style>
	:global(.border-separator) {
		@apply border-x border-x-sky-50;
	}
</style>
