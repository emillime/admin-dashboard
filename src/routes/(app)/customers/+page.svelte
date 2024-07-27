<script lang="ts">
  import { getCoupons, getTransactions } from "$lib/api";
  import { localDb } from "$lib/localDb";
  import { DateTime } from "luxon";
  import { getTokenFromCookie, parseJwt } from "../../../utils/jwtUtils";
  import {
    bookingToBookingReport,
    filterUniqueBookings,
    formatNumber,
    hasNewTransactions,
  } from "$lib/utils";
  import { writable } from "svelte/store";
  import { page } from '$app/stores';
  import { addHiddenColumns } from "svelte-headless-table/plugins";
  import { Render, Subscribe, createTable } from "svelte-headless-table";
  import { liveQuery } from "dexie";

  $: allBookings = liveQuery(async () => {
    return filterUniqueBookings(await localDb.bookings.toArray());
  });

  $: generateCustomerReport($allBookings);

  const data = writable<CustomerReport[]>([]);

  const table = createTable(data, {
    hiddenCols: addHiddenColumns(),
  });

  const columns = table.createColumns([
    table.column({
      header: "Namn",
      accessor: "name",
    }),
    table.column({
      header: "Email",
      accessor: "email",
    }),
    table.column({
      header: "Telefon",
      accessor: "mobile",
    }),
    table.column({
      header: "Antal bokningar",
      accessor: "totalBookings",
    }),
    table.column({
      header: "Totalt betalt",
      accessor: "totalPaid",
    }),
  ]);

  const {
    headerRows,
    rows,
    tableAttrs,
    tableBodyAttrs,
    flatColumns,
    pluginStates,
  } = table.createViewModel(columns);

  const { hiddenColumnIds } = pluginStates.hiddenCols;

  const colIds = flatColumns.map((c) => c.id);
  const colIdName = Object.fromEntries(
    flatColumns.map((c) => [c.id, c.header])
  );

  let showColForId = Object.fromEntries(colIds.map((id) => [id, true]));

  $: $hiddenColumnIds = Object.entries(showColForId)
    .filter(([, show]) => !show)
    .map(([id]) => id);

  let showFilters = false;

  async function generateCustomerReport(bookings?: Booking[]) {

    if (bookings == null || bookings.length === 0) {
      data.set([]);
      return;
    }

    bookings = await Promise.all(
      bookings.map(async (booking) => {
        if (!hasNewTransactions(booking)) {
          return booking;
        }
        let transactions = await getTransactions(
          getTokenFromCookie() ?? "",
          booking.bookingId._id
        );
        // Set the last transaction date as the last updated date to not check it again
        booking.bookingId.transactionLastUpdated =
          booking.bookingId.completedAt;
        booking.bookingId.transactions = transactions;
        localDb.bookings.put(booking);
        return booking;
      })
    );

    // Save all unique customers to a mab and aggregate the bookings
    let customerMap = new Map<string, CustomerReport>();
    bookings.forEach((booking) => {
      let email = booking.bookingId.customerInfo.email.toLocaleLowerCase();
      if (customerMap.has(email)) {
        let customer = customerMap.get(email);
        customer!.totalBookings += 1;
        customer!.totalPaid += customer!.totalPaid;
        customer!.firstBooking = customer!.firstBooking < booking.bookingId.completedAt ? customer!.firstBooking : booking.bookingId.completedAt;
        customerMap.set(email, customer!);
      } else {
        let newCustomer: CustomerReport = {
          ...booking.bookingId.customerInfo,
          totalBookings: 1,
          totalPaid: booking.bookingId.paidAmount,
          firstBooking: booking.bookingId.completedAt,
        };
        customerMap.set(email, newCustomer);
      }
    });

    const customers = [...customerMap.values()].sort((a, b) => b.totalBookings - a.totalBookings);

    console.log(customers.length)

    data.set(customers);
  }
</script>

<div class="flex p-3 justify-center items-center drop-shadow">
  <a href="/report" class="p-3 rounded-l-md {$page.url.pathname === '/report'
  ? 'bg-slate-200'
  : 'bg-slate-100'}">Bokningar</a>
  <a href="/report/coupons" class="p-3 border-l-0 rounded-r-md {$page.url.pathname === '/report/coupons'
    ? 'bg-slate-200'
    : 'bg-slate-100'}">Flexkort</a>
</div>

<div class="flex justify-center items-center">

<button
  class="p-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
  on:click={() => (showFilters = !showFilters)}
>
  {showFilters ? "Dölj filter" : "Visa filter"}
</button>

</div>
<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
{#if showFilters}
  {#each colIds as id}
    <div>
      <input id="hide-{id}" type="checkbox" bind:checked={showColForId[id]} />
      <label for="hide-{id}">{colIdName[id]}</label>
    </div>
  {/each}
{/if}
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
