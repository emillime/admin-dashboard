<script lang="ts">
  import { tokenStore } from "../utils/tokenStore";
  import Redirect from "./Redirect.svelte";

  export let location;

  console.log('tokenStore: ' + $tokenStore);
  console.log($tokenStore != null);
</script>

{#if $tokenStore != null}
  <slot {...$$restProps} />
{:else}
  <Redirect to="/" state={{ from: location }} />
{/if}
