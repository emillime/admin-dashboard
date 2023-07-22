<script lang="ts">
  import { formatChartData } from "../utils/chartHelper";
  import CardLineChart from "./CardLineChart.svelte";

  // Todo: Remove auto and import only parts needed to reduce size
  //Chart.register(DoughnutController, ArcElement);

  export let bookings: Booking[] = [];

  $: chartData = formatChartData(bookings, "day") ?? [];
</script>

{@debug chartData}

{#if chartData.length > 0}
  <CardLineChart bind:data={chartData} />
{/if}
