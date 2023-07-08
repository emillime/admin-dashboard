<script lang="ts">
	import { onMount } from 'svelte';
	import CardLineChart from './CardLineChart.svelte';
	import { getAllBookings } from '$lib/api';
	import { formatChartData } from '../utils/chartHelper';
	import { getTokenFromCookie } from '../utils/jwtUtils';
	import { localDb } from '$lib/localDb';

	let chartData: any;

	onMount(async () => {
		let token = getTokenFromCookie();
		if (token == null || token.length === 0) {
			console.error('No token found');
		}

		if (token && token.length > 0 && (await localDb.bookings.count()) === 0) {
      console.log('Fetching bookings');
			const bookings: Booking[] = await getAllBookings(token, '2023-04-05T00:00:19.735Z');
			try {
				const id = await localDb.bookings.bulkPut(bookings);
        console.log(`Added bookings: ${id}`);
			} catch (error) {
				console.log(`Failed to add bookings: ${error}`);
			}
		}
		//const uniqueBookings = filterUniqueBookings(bookings);

		//chartData = formatChartData(uniqueBookings, "day");

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

<CardLineChart bind:data={chartData} />
<!--
  <div class="chart-container">
    <div id="chart" />
  </div>
  <div class="chart-container">
    <div id="barchart" />
  </div>
   Add other chart containers and components as needed -->
