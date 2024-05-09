<script lang="ts">
  import { getTransactions } from "$lib/api";
  import { localDb } from "$lib/localDb";
  import { DateTime } from "luxon";
  import { getTokenFromCookie } from "../../../utils/jwtUtils";
  import {
    bookingToBookingReport,
    filterUniqueBookings,
    hasNewTransactions,
  } from "$lib/utils";
  import { writable } from "svelte/store";
  import { Render, Subscribe, createTable } from "svelte-headless-table";

  let month = DateTime.now().minus({ month: 1 }).toFormat("yyyy-MM");

  const data = writable<BookingReport[]>([]);

  const table = createTable(data);
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

  const { headerRows, rows, tableAttrs, tableBodyAttrs } =
    table.createViewModel(columns);

  // USE: booking.bookingId.paidAmount
  async function generate() {
    let start = DateTime.fromFormat(month, "yyyy-MM")
      .startOf("month")
      .toJSDate();
    let end = DateTime.fromFormat(month, "yyyy-MM").endOf("month").toJSDate();
    let bookings = await localDb.bookings
      .where("bookingId.completedAt")
      .between(start, end, true, true)
      .toArray();

    let uniqueBookings = filterUniqueBookings(bookings);

    uniqueBookings = await Promise.all(
      uniqueBookings.map(async (booking) => {
        if (!hasNewTransactions(booking)) {
          console.log("No new transactions for booking: ", booking);
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

    data.set(rows);
  }
</script>

<input
  type="month"
  bind:value={month}
  class="ml-10 p-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
/>
<button
  class="ml-10 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
  on:click={generate}>Generate</button
>
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
                <td class="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left" {...attrs}>
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
