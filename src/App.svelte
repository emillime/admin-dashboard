<!-- App.svelte -->
<script lang="ts">
  import { Router, Route, navigate } from "svelte-routing";

  // Admin Layout
  import Admin from "./layouts/Admin.svelte";
  // Auth Layout
  import Auth from "./layouts/Auth.svelte";
  import PrivateRoute from "./routing/PrivateRoute.svelte";
  import { tokenStore } from "./utils/tokenStore";

  export let url = "";

  if ($tokenStore != null) {
    navigate("/dashboard");
  }
</script>

<Router {url}>
  <!-- admin layout -->
  <PrivateRoute path="dashboard">
    <Admin />
  </PrivateRoute>
  <Route path="/" let:location>
    <Auth {location} />
  </Route>
</Router>
