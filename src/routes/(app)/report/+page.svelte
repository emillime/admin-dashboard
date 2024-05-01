<script lang="ts">
  import { getSuppliers } from "$lib/api";
  import { localDb } from "$lib/localDb";
  import {
    getTokenFromCookie,
    removeTokenCookie,
  } from "../../../utils/jwtUtils";

  function generate() {
    
  }

</script>

<button
  class="ml-10 bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
  on:click={generate}>Generate</button
>


