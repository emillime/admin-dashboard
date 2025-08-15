<script>
  import { browser } from "$app/environment";
  import { navigating } from "$app/stores";
  import PillNavbar from "../../components/PillNavbar.svelte";
  import { getTokenFromCookie } from "../../utils/jwtUtils";
  import { getCoupons, updateBookings } from "$lib/api";
  import { getCurrentSupplierId } from "../../utils/supplierHelper";

  // Way to redirect to login page if user is not logged in
  $: if ($navigating) {
    const token = getTokenFromCookie();
    if (!token) {
      window.location.href = `/?redirectTo=${$navigating.to?.url.pathname}${$navigating.to?.url.search}`;
    }
  }

  if (browser) {
    updateDb();
  }
  
  async function updateDb() {
    let token = getTokenFromCookie();
    if (token == null || token.length === 0) {
      console.error("No token found");
    }

    if (token && token.length > 0) {
      updateBookings(token);

      getCoupons(token, getCurrentSupplierId());
    }
  }
</script>

<header class="bg-slate-100">
  <PillNavbar />
</header>

<main class="bg-slate-100">
  <slot />
</main>
