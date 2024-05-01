<script lang="ts">
  import { getSuppliers } from "$lib/api";
  import { localDb } from "$lib/localDb";
  import {
    getTokenFromCookie,
    removeTokenCookie,
  } from "../../../utils/jwtUtils";

  let stationsPromise = getStations();
  function logout() {
    removeTokenCookie();
    window.location.href = "/";
  }

  function clearDb() {
    localStorage.removeItem("lastUpdated");
    localDb.delete();
    window.location.href = "/settings";
  }

  async function getStations() {
    const token = getTokenFromCookie() ?? "";
    const stations = await getSuppliers(token);
    console.log(stations);
    return stations;
  }
</script>

<button
  class="ml-10 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
  on:click={logout}>Logout</button
>
<button
  class="ml-10 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded"
  on:click={clearDb}>Delete Database</button
>

{#await stationsPromise}
  <p>laddar stationer...</p>
{:then stations}
  <label for="station">Visa data från:</label>
  <select name="station" id="station">
    {#each stations as station}
      <option value={station._id}>{station.name}</option>
    {/each}
  </select>
{/await}
