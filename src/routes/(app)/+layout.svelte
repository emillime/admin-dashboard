<script>
	import { navigating } from '$app/stores';
	import PillNavbar from '../../components/PillNavbar.svelte';
	import { getTokenFromCookie } from '../../utils/jwtUtils';

	// Way to redirect to login page if user is not logged in
	$: if($navigating) {
		const token = getTokenFromCookie();
		if(!token) {
			window.location.href = '/';
		}
	}

</script>

<header class="bg-slate-100">
	<PillNavbar />
</header>

<main class="bg-slate-100">
	<slot />
</main>
