<script>
  export let openTab = 1;

  function toggleTabs(tabNumber) {
    openTab = tabNumber;
  }
</script>

<div class="flex flex-wrap justify-center">
  <div class="w-11/12">
    <ul class="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row">
      <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
        <a
          href="#1"
          class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal {openTab ===
          1
            ? 'text-white bg-lightBlue-600'
            : 'text-lightBlue-600 bg-white'}"
          on:click={() => toggleTabs(1)}
        >
          <i class="fas fa-chart-line text-base mr-1" /> Statistik
        </a>
      </li>
      <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
        <a
          href="#2"
          class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal {openTab ===
          2
            ? 'text-white bg-lightBlue-600'
            : 'text-lightBlue-600 bg-white'}"
          on:click={() => toggleTabs(2)}
        >
          <i class="fas fa-list-ul text-base mr-1" /> Idag
        </a>
      </li>
      <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
        <a
          href="#3"
          class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal {openTab ===
          3
            ? 'text-white bg-lightBlue-600'
            : 'text-lightBlue-600 bg-white'}"
          on:click={() => toggleTabs(3)}
        >
          <i class="fas fa-briefcase text-base mr-1" /> Options
        </a>
      </li>
    </ul>
  </div>
</div>
