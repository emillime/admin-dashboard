<script lang="ts">
	import { liveQuery } from 'dexie';
	import { localDb } from '$lib/localDb';
	import { filterUniqueBookings } from '$lib/utils';
	import CardTable from '../../../components/CardTable.svelte';
	import GanttSchedule from '../../../components/GanttSchedule.svelte';
	import { DateTime } from 'luxon';

	let start = DateTime.now().startOf('day').toJSDate();
	
	$: end = DateTime.fromJSDate(start).endOf('day').toJSDate();

	$: bookings = liveQuery(async () => {
		return localDb.bookings
			.where('startTime')
			.aboveOrEqual(start)
			.and((booking) => booking.startTime <= end)
			.toArray();
	});

	$: uniqueBookings = $bookings != null ? filterUniqueBookings($bookings) : [];

</script>


{#if $bookings}
	<GanttSchedule bind:date={start} {bookings} />
	<CardTable bind:date={start} bookings={uniqueBookings} />
{/if}
