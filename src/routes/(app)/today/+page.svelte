<script lang="ts">
  import { liveQuery } from "dexie";
  import { localDb } from "$lib/localDb";
  import { filterUniqueBookings } from "$lib/utils";
  import CardTable from "../../../components/CardTable.svelte";
  import GanttSchedule from "../../../components/GanttSchedule.svelte";
  import { DateTime } from "luxon";
  import { getTokenFromCookie } from "../../../utils/jwtUtils";
  import { getAllBookings, getSuppliers } from "$lib/api";
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
      .and((b) => b.supplierId._id === $currentSupplier?._id)
      .toArray();
  });

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

  async function initCurrentSupplier() {
    if ($currentSupplier == null) {
      const token = getTokenFromCookie() ?? "";
      const stations = await getSuppliers(token);
      if ($currentSupplier == null) {
        console.log("No current supplier set, initializing with first station: ", stations[0]);
        $currentSupplier = stations[0];
      }
    }
  }

  onMount(() => {
    // Not needed because we update all bookings on page reload
    // fetchTodaysBookings();
    initCurrentSupplier();
  });
</script>

{#if $bookings}
  <GanttSchedule bind:date={start} bookings={activeBookings} />
  <CardTable bind:date={start} bookings={uniqueBookings} />
  <Cleaning />
{/if}
