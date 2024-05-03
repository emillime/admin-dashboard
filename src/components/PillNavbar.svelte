<script lang="ts">
	import Fa from 'svelte-fa';
	import {
		faListUl,
		faChartLine,
		faBriefcase,
		type IconDefinition
	} from '@fortawesome/free-solid-svg-icons';
	import { page } from '$app/stores';

	const menuItems: { icon: IconDefinition; text: string; path: string }[] = [
		{
			icon: faListUl,
			text: 'Dagens',
			path: '/today'
		},
		{
			icon: faChartLine,
			text: 'Statistik',
			path: '/dashboard'
		},
		{
			icon: faBriefcase,
			text: 'Inställningar',
			path: '/settings'
		}
	];
</script>

<nav class="flex justify-center items-center">
	<ul class="flex flex-wrap justify-start items-center gap-2 list-none w-11/12 m-3">
		{#each menuItems as item (item.path)}
			<li class="flex-auto text-center">
				<a
					href={item.path}
					class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal whitespace-nowrap {$page
						.url.pathname === item.path
						? 'text-white bg-sky-600'
						: 'text-sky-600 bg-white'}"
				>
					<Fa icon={item.icon} class="inline text-center mr-1" />
					{item.text}
				</a>
			</li>
		{/each}
	</ul>
</nav>
