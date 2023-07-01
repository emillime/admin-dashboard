<script lang="ts">
  // Import onMount from svelte
  import { onMount } from "svelte";
  import { authorize, getAllBookings } from "./api/api";
  import CardLineChart from "./components/Cards/CardLineChart.svelte";
  import { formatChartData } from "./utils/chartHelper";

  let chartData;

  function filterUniqueBookings(bookings: Booking[]): Booking[] {
    const seenBookings = new Set();
    const uniqueBookings = [];
    bookings.forEach((booking) => {
      if (!seenBookings.has(booking.bookingId.orderNumber)) {
        uniqueBookings.push(booking);
        seenBookings.add(booking.bookingId.orderNumber);
      }
    });
    return uniqueBookings;
  }

  onMount(async () => {
    // Fetch data from API
    const token = await authorize(
      "email",
      "password"
    );

    const bookings = await getAllBookings(token, "2023-04-05T00:00:19.735Z");
    console.log(bookings);
    const uniqueBookings = filterUniqueBookings(bookings);
    console.log(uniqueBookings);
    
    chartData = formatChartData(uniqueBookings, "day");
    console.log(chartData);

    /*
    const lineChartOptions = {
      series: [
        {
          name: "Sales",
          data: chartData,
        },
      ],
    };

    // Create a line chart
    const lineChart = new LineChart("#chart", lineChartOptions, {
      axisX: {
        type: FixedScaleAxis,
        divisor: 12,
        labelInterpolationFnc: (value) =>
          new Date(value).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
          }),
      },
      axisY: {
        type: FixedScaleAxis,
        divisor: 5,
        labelInterpolationFnc: (value) => `${value} kr`,
      },
      chartPadding: {
        left: 50,
      },
      plugins: [
        ChartistTooltip({
          transformTooltipTextFnc: (value: string) => {
            const xy = value.split(",");
            const day = new Date(Number(xy[0])).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
            });
            return `${day}: ${xy[1]} kr`;
          },
        }),
      ],
    });

    const barChart = new BarChart(
      "#barchart",
      {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        series: [
          [800000, 1200000, 1400000, 1300000],
          [200000, 400000, 500000, 300000],
          [100000, 200000, 400000, 600000],
        ],
      },
      {
        stackBars: true,
        axisY: {
          labelInterpolationFnc: (value) => +value / 1000 + "k",
        },
      }
    ).on("draw", (data) => {
      if (data.type === "bar") {
        data.element.attr({
          style: "stroke-width: 30px",
        });
      }*/
  });
</script>

<main>
  <h1>Test</h1>
  <CardLineChart bind:data={chartData} />
  <!--
  <div class="chart-container">
    <div id="chart" />
  </div>
  <div class="chart-container">
    <div id="barchart" />
  </div>
   Add other chart containers and components as needed -->
</main>

