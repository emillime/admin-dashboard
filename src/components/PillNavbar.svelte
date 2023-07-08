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

<nav class="flex flex-nowrap justify-center">
	<ul class="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row w-11/12">
		{#each menuItems as item (item.path)}
			<li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
				<a
					href={item.path}
					class="text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal {$page
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
