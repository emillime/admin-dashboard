<!-- FriendList.svelte --> 
<script>
    import { liveQuery } from "dexie";
    import { localDb } from "$lib/localDb";
	import { filterUniqueBookings } from "$lib/utils";
    // Query parameters:
  

    $: bookings = liveQuery(async () => {
      const bookings = await localDb.bookings.toArray();
      return filterUniqueBookings(bookings);
    });
  </script>
  <ul>
    {#if $bookings}
      Total: {$bookings.length}
      {#each $bookings as booking (booking._id)}
        <li>{booking.bookingId.customerInfo.firstName ?? ""}, {booking.bookingId.customerInfo.mobile ?? ""}</li>
      {/each}
    {/if}
  </ul>