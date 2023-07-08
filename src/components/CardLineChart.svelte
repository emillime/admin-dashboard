<script lang="ts">
  import { onMount } from "svelte";
  import 'chartjs-adapter-luxon';
  import Chart, { type ChartConfiguration } from "chart.js/auto";
  // Todo: Remove auto and import only parts needed to reduce size
  //Chart.register(DoughnutController, ArcElement);

  export let data = undefined;

  let lineChartCanvas;
  let myChart: Chart;
  let startDate: Date;
  let endDate: Date;

  $: if (data != undefined && data.length > 0) {
    startDate = new Date(data[0].x);
    endDate = new Date(data[data.length - 1]?.x);
  }

  let config: ChartConfiguration = {
    type: "line",
    data: {
      datasets: [
        {
          label: "Sales",
          data: data,
          borderColor: "rgb(75, 192, 192)",
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "time",
          time: {
            // Luxon format string
            tooltipFormat: "DD T",
          },
          title: {
            display: true,
            text: "Date",
          },
        },
      },
    },
  };

  $: if (myChart) {
    myChart.data.datasets[0].data = data;
    myChart.update();
  }

  onMount(() => {
    const ctx = lineChartCanvas.getContext("2d");
    // Initialize chart using default config set
    myChart = new Chart(ctx, config);
  });
</script>

<div
  class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-slate-700"
>
  <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full max-w-full flex-grow flex-1">
        <h6 class="uppercase text-slate-100 mb-1 text-xs font-semibold">
          Overview
        </h6>
        <h2 class="text-white text-xl font-semibold">Sales value</h2>
      </div>
    </div>
  </div>
  <div class="p-4 flex-auto">
    <!-- Chart -->
    <div class="relative h-350-px">
      <canvas bind:this={lineChartCanvas} id="line-chart" />
    </div>
  </div>
</div>
