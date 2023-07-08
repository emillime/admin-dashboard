<script lang="ts">
	import Dashboard from '../../../components/Dashboard.svelte';
	import FriendList from '$lib/components/FriendList.svelte';
	import CardStats from '../../../components/CardStats.svelte';
	import { liveQuery } from 'dexie';
	import { localDb } from '$lib/localDb';
	import { filterUniqueBookings } from '$lib/utils';
	import { easepick } from '@easepick/core';
	import { RangePlugin } from '@easepick/range-plugin';
	import { PresetPlugin } from '@easepick/preset-plugin';
	import { TimePlugin } from '@easepick/time-plugin';
	import { onMount } from 'svelte';

	let datePicker: HTMLElement;
	let datePickerEnd: HTMLElement;
	let startDate: Date = new Date();
	let endDate: Date = new Date();

	$: bookings = liveQuery(async () => {
		const bookings = await localDb.bookings
			.where('startTime')
			.between(startDate, endDate)
			.toArray();
		return filterUniqueBookings(bookings);
	});

	onMount(async () => {
		const picker = new easepick.create({
			element: datePicker,
			css: ['https://cdn.jsdelivr.net/npm/@easepick/bundle@1.2.1/dist/index.css'],
			zIndex: 10,
			format: 'YYYY/MM/DD: HH:mm',
			inline: false,
			header: '',
			RangePlugin: {
				repick: false,
				strict: true
			},
			TimePlugin: {
				stepMinutes: 60
			},
			plugins: [RangePlugin, PresetPlugin, TimePlugin]
		});

		picker.on('select', (event: CustomEvent) => {
			const { start, end } = event.detail;
			startDate = start;
			endDate = end;
		});
	});
</script>

<div class="flex justify-center align-middle">
	<input
		bind:this={datePicker}
		placeholder="Datum"
		class="w-64 h-10 px-3 mb-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
	/>
</div>
{#if $bookings}
	<CardStats statSubtitle="Ordrar" statTitle={$bookings.length.toString()} />
{/if}
<Dashboard />
<FriendList />
