<script lang="ts">
  import { getAllBookings } from '$lib/api';
	import { faCaretRight, faRefresh } from '@fortawesome/free-solid-svg-icons';
	import { DateTime } from 'luxon';
	import Fa from 'svelte-fa';
  import { getTokenFromCookie } from '../utils/jwtUtils';

	export let date: Date;
	export let bookings: Booking[];
	
	let loading = false;

	function previousDay() {
		date.setDate(date.getDate() - 1);
		date = date;
	}

	function nextDay() {
		date.setDate(date.getDate() + 1);
		date = date;
	}

	function fetchNewBookings() {
		const token = getTokenFromCookie() ?? '';
		loading = true;
		getAllBookings(token, date.toISOString()).then((_) => {
			loading = false;
		});
	}

	$: totalUnits = bookings.reduce(
		(units: {[name: string]: number}, booking) => {
			Object.values(booking.bookingId.priceObject.products).forEach(product => {
				units[product.productName] = (units[product.productName] || 0) + product.quantity;
			});
			return units
		}, {});
</script>

<div class="relative flex flex-col min-w-0 break-words w-full pb-4 shadow-lg rounded bg-white">
	<div class="rounded-t mb-0 px-4 py-3 border-0">
		<div class="flex flex-wrap flex-row items-center">
			<h3 class="mr-4 font-semibold text-lg text-slate-700">Bokningar ({bookings?.length})</h3>
			<button class="m-1 text-sky-600 hover:text-sky-900" on:click={previousDay}>
				<Fa icon={faCaretRight} rotate={180} size="1.5x" />
			</button>

			<h3 class="font-semibold text-lg text-slate-700 group relative">
				{`${DateTime.fromJSDate(date).toRelativeCalendar()}`}
				<span
					class="pointer-events-none absolute -top-7 left-0 w-max opacity-0 transition-opacity group-hover:opacity-90 bg-sky-200 rounded-md text-sm"
				>
					{date.toLocaleDateString()}
				</span>
			</h3>
			<button class="m-1 text-sky-600 hover:text-sky-900" on:click={nextDay}>
				<Fa icon={faCaretRight} size="1.5x" />
			</button>
			<div class="flex-grow"></div>
			<button class="m-1 text-sky-600 hover:text-sky-900" on:click={fetchNewBookings}>
				<Fa icon={faRefresh} size="1.5x" pulse={loading}/>
			</button>
		</div>
	</div>
	<div class="block w-full overflow-x-auto">
		<table class="items-center w-full bg-transparent border-collapse">
			<thead>
				<tr>
					<th
						class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-50 text-slate-500 border-slate-100"
					>
						Tid
					</th>
					<th
						class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-50 text-slate-500 border-slate-100"
					>
						Namn
					</th>
					<th
						class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-50 text-slate-500 border-slate-100"
					>
						Telefonnummer
					</th>
					<th
						class="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-slate-50 text-slate-500 border-slate-100"
					>
						Antal
					</th>
				</tr>
			</thead>
			<tbody>
				{#if bookings}
					{#each bookings as booking }
						<tr>
							<td
								class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
							>
								<span class="text-slate-600">
									{`${DateTime.fromJSDate(booking.startTime).toFormat(
										'HH:mm'
									)} - ${DateTime.fromJSDate(booking.endTime).toFormat('HH:mm')}`}
								</span>
							</td>
							<td
								class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
							>
								<span class="font-bold text-slate-600">
									{booking.bookingId.customerInfo.firstName}
									{booking.bookingId.customerInfo.lastName}
								</span>
							</td>
							<td
								class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
							>
								<a href="tel:+{booking.bookingId.customerInfo.mobile}"
									>+{booking.bookingId.customerInfo.mobile}</a
								>
							</td>
							<td
								class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
							>
								{#each Object.values(booking.bookingId.priceObject.products) as product}
									{product.quantity} {product.productName} <br />
								{/each}
							</td>
						</tr>
					{/each}
					<tr>
						<td
							class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
						>

						</td>
						<td
							class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left"
						>
						</td>
						<td
							class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4"
						>
						</td>
						<td
							class="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap text-left"
						>
						<span class="font-bold text-slate-600">
							Totalt:
						</span>
						<br />
						{#each Object.keys(totalUnits) as name}
							{totalUnits[name]} {name} <br />
						{/each}
						</td>
					</tr>
				{/if}
			</tbody>
		</table>
	</div>
</div>
