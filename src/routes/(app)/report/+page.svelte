<script lang="ts">
  import { getSuppliers } from "$lib/api";
  import { localDb } from "$lib/localDb";
  import { DateTime } from "luxon";
  import {
    getTokenFromCookie,
    removeTokenCookie,
  } from "../../../utils/jwtUtils";
  import { filterUniqueBookings } from "$lib/utils";

  let monthStart = DateTime.now().minus({month: 1}).startOf("month");
  $: monthEnd = monthStart.endOf("month");

  async function generate() {
    let x = await localDb.bookings
      .where("bookingId.completedAt")
      .between(monthStart.toJSDate(), monthEnd.toJSDate(), true, true)
      .toArray();

    console.log(monthStart.toJSDate());
    console.log(monthEnd.toJSDate());
    console.log(x);
    //console.log(uniqueBookings);
  }
</script>

<button
  class="ml-10 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
  on:click={generate}>Generate</button
>
