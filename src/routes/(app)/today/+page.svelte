<script lang="ts">
  import { liveQuery } from "dexie";
  import { localDb } from "$lib/localDb";
  import { filterUniqueBookings } from "$lib/utils";
  import CardTable from "../../../components/CardTable.svelte";
  import GanttSchedule from "../../../components/GanttSchedule.svelte";
  import { DateTime } from "luxon";
  import { getTokenFromCookie } from "../../../utils/jwtUtils";
  import { getAllBookings } from "$lib/api";
  import { onMount } from "svelte";
  import Cleaning from "../../../components/Cleaning.svelte";
  import { currentSupplier } from "../../../stores/stores";

  let start = DateTime.now().startOf("day").toJSDate();

  $: end = DateTime.fromJSDate(start).endOf("day").toJSDate();

  $: bookings = liveQuery(async () => {
    return localDb.bookings
      .where("endTime")
      .aboveOrEqual(start)
      .and((b) => b.startTime <= end)
      .and((b) => $currentSupplier != null ? b.supplierId._id === $currentSupplier?._id : true)
      .toArray();
  });

  $: { 
    console.log("Bookings", $bookings); 
    console.log("Current Supplier", $currentSupplier);
    console.log("Filter: ", $currentSupplier != null ? "62babb55bbf1ffbdefe9eb1b" === $currentSupplier?._id : true);
  };

  $: activeBookings = $bookings != null ? $bookings.filter((booking) => !booking.cancelled) : [];
  $: uniqueBookings = $bookings != null ? filterUniqueBookings($bookings) : [];

  function fetchTodaysBookings() {
    const token = getTokenFromCookie() ?? "";
    const today = new Date();
    getAllBookings(
      token,
      DateTime.fromJSDate(today).startOf("day").toJSDate().toISOString(),
      DateTime.fromJSDate(today).endOf("day").toJSDate().toISOString()
    );
  }

  onMount(() => {
    // Not needed because we update all bookings on page reload
    // fetchTodaysBookings();
  });
</script>

{#if $bookings}
  <GanttSchedule bind:date={start} bookings={activeBookings} />
  <CardTable bind:date={start} bookings={uniqueBookings} />
  <Cleaning />
{/if}
