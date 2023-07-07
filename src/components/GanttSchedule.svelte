<script lang="ts">
	import { getSlots } from '$lib/api';
	import type { Observable } from 'dexie';
	import { onMount } from 'svelte';
	import { getTokenFromCookie } from '../utils/jwtUtils';
	import { DateTime } from 'luxon';
	import type { SvelteGanttOptions } from 'svelte-gantt/types/gantt';
	import type { RowModel } from 'svelte-gantt/types/core/row';
	import type { TaskModel } from 'svelte-gantt/types/core/task';

	export let date: Date;
	export let bookings: Observable<Booking[]>;
	let SvelteGantt;
	let SvelteGanttTable;

	let ganttElement: HTMLElement;

	onMount(async () => {
		SvelteGantt = (await import('svelte-gantt')).SvelteGantt;
		SvelteGanttTable = (await import('svelte-gantt')).SvelteGanttTable;

		const data = await generate();

		let currentTime = DateTime.now().toMillis();
		let options: SvelteGanttOptions = {
			headers: [
				{ unit: 'day', format: 'dd/MM/yyyy' },
				{ unit: 'hour', format: 'hh:mm' }
			],
			rows: data.rows,
			tasks: data.tasks,
			timeRanges: [
				{
					id: 0,
					from: currentTime,
					to: currentTime + 60000,
					label: 'Nu',
					enableResizing: false
				}
			],
            columnUnit: 'hour',
			columnOffset: 1,
            magnetOffset: 0,
			rowHeight: 50,
			rowPadding: 6,
			fitWidth: true,
			minWidth: 2500,
			from: DateTime.fromJSDate(date).startOf('day').toMillis(),
			to: DateTime.fromJSDate(date).endOf('day').toMillis(),
			tableWidth: 75,
			tableHeaders: [{ title: '', property: 'label', width: 100, type: 'tree' }],
			ganttTableModules: [SvelteGanttTable],
		};
		const gantt = new SvelteGantt({
			target: ganttElement,
			props: options
		});
        setTimeout(() => {
            gantt.scrollToTask(3, 'smooth');
        }, 5000);
	});

	async function generate() {
		const token = getTokenFromCookie() ?? '';
		const slots = await getSlots(token);
		const rows: RowModel[] = slots.map((slot) => {
			return {
				id: Number(slot.slot),
				enableDragging: false,
				label: `Slot ${slot.slot}`,
				height: 50,
				expanded: false
			};
		});
		let id = 0;
		const tasks: TaskModel[] = $bookings?.map((booking) => {
			return {
				id: id++,
				amountDone: 50,
				from: booking.startTime,
				to: booking.endTime,
				label: `${booking.bookingId.customerInfo.firstName} ${booking.bookingId.customerInfo.lastName}`,
				showButton: false,
				enableDragging: false,
				resourceId: Number(booking.productSlotId.slot)
			};
		});

		return { rows, tasks };
	}
</script>

<div bind:this={ganttElement} />
