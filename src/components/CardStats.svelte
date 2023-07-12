<script lang="ts">
  import Fa from "svelte-fa";
  import { faChartColumn } from "@fortawesome/free-solid-svg-icons";

  export let statSubtitle = "";
  export let statTitle = "";

  export let statArrow = "";
  export let statPercent = "";

  export let statPercentColor = "text-emerald-500";
  export let statDescripiron = "Since last month";
  export let statIcon = faChartColumn;
  // can be any of the background color utilities
  // from tailwindcss
  export let statIconColor = "bg-sky-600";
</script>

<div
  class="relative flex flex-col min-w-0 break-words bg-white rounded mb-6 xl:mb-0 shadow-lg max-w-max"
>
  <div class="flex-auto p-4 max-w-max">
    <div class="flex flex-nowrap">
      <div class="relative w-full pr-4 max-w-full flex-grow flex-1">
        <h5 class="text-slate-400 uppercase font-bold text-xs">
          {statSubtitle}
        </h5>
        <span class="font-semibold text-xl text-slate-700">
          {statTitle}
        </span>
      </div>
      <div class="relative w-auto pl-4 flex-initial">
        <div
          class="text-white p-3 text-center inline-flex items-center justify-center w-12 h-12 shadow-lg rounded-full {statIconColor}"
        >
          <Fa icon={statIcon} size="1.5x"/>
        </div>
      </div>
    </div>
  </div>
</div>
