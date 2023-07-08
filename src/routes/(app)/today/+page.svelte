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

  let start = DateTime.now().startOf("day").toJSDate();

  $: end = DateTime.fromJSDate(start).endOf("day").toJSDate();

  $: bookings = liveQuery(async () => {
    return localDb.bookings
      .where("startTime")
      .aboveOrEqual(start)
      .and((booking) => booking.startTime <= end)
      .toArray();
  });

  $: uniqueBookings = $bookings != null ? filterUniqueBookings($bookings) : [];

  function fetchTodaysBookings() {
    const token = getTokenFromCookie() ?? "";
	const today = new Date();
    getAllBookings(token, DateTime.fromJSDate(today).startOf("day").toJSDate().toISOString(), DateTime.fromJSDate(today).endOf("day").toJSDate().toISOString());
  }

  onMount(() => {
	fetchTodaysBookings();
  });
</script>

{#if $bookings}
  <GanttSchedule bind:date={start} {bookings} />
  <CardTable bind:date={start} bookings={uniqueBookings} />
{/if}
