<script lang="ts">
	import { localDb } from "$lib/localDb";
	import { removeTokenCookie } from "../../../utils/jwtUtils";

    function logout() {
        removeTokenCookie();
        window.location.href = "/";
    }
    function clearDb() {
        localDb.delete();
        window.location.href = "/settings";
    }
</script>

<button class="ml-10 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded" on:click={logout}>Logout</button>
<button class="ml-10 bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded" on:click={clearDb}>Delete Database</button>
