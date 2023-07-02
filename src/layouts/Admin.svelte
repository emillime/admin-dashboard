<script lang="ts">
  import { Router, Route } from "svelte-routing";

  // components for this layout
  //import HeaderStats from "../components/Headers/HeaderStats.svelte";

  // pages for this layout
  import PillNavbar from "../components/Navbars/PillNavbar.svelte";
  import Dashboard from "../Dashboard.svelte";

  let openTab = 1;
</script>

<PillNavbar bind:openTab />
{#if openTab == 2}
  Tab 2
{:else if openTab == 3}
  Tab 3
{:else}
  <Dashboard />
{/if}
