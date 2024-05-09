<script lang="ts">
  import { getTransactions } from "$lib/api";
  import { localDb } from "$lib/localDb";
  import { DateTime } from "luxon";
  import { getTokenFromCookie } from "../../../utils/jwtUtils";
  import {
    bookingToBookingReport,
    filterUniqueBookings,
    formatNumber,
    hasNewTransactions,
  } from "$lib/utils";
  import { writable } from "svelte/store";
  import { addHiddenColumns } from "svelte-headless-table/plugins";
  import { Render, Subscribe, createTable } from "svelte-headless-table";
  import { liveQuery } from "dexie";

  let month = DateTime.now().minus({ month: 1 }).toFormat("yyyy-MM");

  $: start = DateTime.fromFormat(month, "yyyy-MM").startOf("month").toJSDate();
  $: end = DateTime.fromFormat(month, "yyyy-MM").endOf("month").toJSDate();

  $: bookings = liveQuery(async () => {
    return localDb.bookings
      .where("bookingId.completedAt")
      .between(start, end, true, true)
      .toArray();
  });

  $: generateReport($bookings);

  const data = writable<BookingReport[]>([]);

  const table = createTable(data, {
    hiddenCols: addHiddenColumns(),
  });

  const columns = table.createColumns([
    table.column({
      header: "Ordernummer",
      accessor: "orderNumber",
    }),
    table.column({
      header: "Datum",
      accessor: "completedAt",
    }),
    table.column({
      header: "Namn",
      accessor: "customerName",
    }),
    table.column({
      header: "Pris",
      accessor: "totalAmount",
    }),
    table.column({
      header: "Betalat",
      accessor: "paidAmount",
    }),
    table.column({
      header: "Betald Skatt",
      accessor: "paidTax",
    }),
    table.column({
      header: "Återbetalat",
      accessor: "refundAmount",
    }),
    table.column({
      header: "Återbetalad skatt",
      accessor: "refundTax",
    }),
    table.column({
      header: "Efterdebiterat",
      accessor: "extraAmount",
    }),
    table.column({
      header: "Efterdebiterad skatt",
      accessor: "extraTax",
    }),
    table.column({
      header: "Rabatt",
      accessor: "couponAmount",
    }),
    table.column({
      header: "Kupongkod",
      accessor: "coupon",
    }),
    table.column({
      header: "Totalt betalat",
      accessor: "finalPaymentAmount",
    }),
    table.column({
      header: "Total skatt",
      accessor: "finalTaxAmount",
    }),
    table.column({
      header: "Estimerad avgift",
      accessor: "estimadedFee",
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

  async function generateReport(bookings: Booking[]) {
    console.log("Generating report for bookings: ", bookings);

    if (bookings == null || bookings.length === 0) {
      data.set([]);
      return;
    }

    let uniqueBookings = filterUniqueBookings(bookings);

    uniqueBookings = await Promise.all(
      uniqueBookings.map(async (booking) => {
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
        console.log("Updated booking with transactions: ", booking);
        return booking;
      })
    );

    let rows = uniqueBookings.map(bookingToBookingReport);

    let totals = rows.reduce(
      (acc, row) => {
        acc.totalAmount += parseFloat(row.totalAmount) || 0;
        acc.paidAmount += parseFloat(row.paidAmount) || 0;
        acc.paidTax += parseFloat(row.paidTax) || 0;
        acc.refundAmount += parseFloat(row.refundAmount) || 0;
        acc.refundTax += parseFloat(row.refundTax) || 0;
        acc.extraAmount += parseFloat(row.extraAmount) || 0;
        acc.extraTax += parseFloat(row.extraTax) || 0;
        acc.couponAmount += parseFloat(row.couponAmount) || 0;
        acc.finalPaymentAmount += parseFloat(row.finalPaymentAmount) || 0;
        acc.finalTaxAmount += parseFloat(row.finalTaxAmount) || 0;
        acc.estimadedFee += parseFloat(row.estimadedFee) || 0;
        return acc;
      },
      {
        totalAmount: 0,
        paidAmount: 0,
        paidTax: 0,
        refundAmount: 0,
        refundTax: 0,
        extraAmount: 0,
        extraTax: 0,
        couponAmount: 0,
        finalPaymentAmount: 0,
        finalTaxAmount: 0,
        estimadedFee: 0,
      }
    );

    let totalRow: BookingReport = {
      orderNumber: "Totalt",
      completedAt: "",
      customerName: "",
      coupon: "",
      totalAmount: formatNumber(totals.totalAmount),
      paidAmount: formatNumber(totals.paidAmount),
      paidTax: formatNumber(totals.paidTax),
      refundAmount: formatNumber(totals.refundAmount),
      refundTax: formatNumber(totals.refundTax),
      extraAmount: formatNumber(totals.extraAmount),
      extraTax: formatNumber(totals.extraTax),
      couponAmount: formatNumber(totals.couponAmount),
      finalPaymentAmount: formatNumber(totals.finalPaymentAmount),
      finalTaxAmount: formatNumber(totals.finalTaxAmount),
      estimadedFee: formatNumber(totals.estimadedFee),
    };

    rows.push(totalRow);

    data.set(rows);
  }
</script>

<div class="flex justify-center items-center">
<input
  type="month"
  bind:value={month}
  class="p-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
/>
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
