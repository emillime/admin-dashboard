<script lang="ts">
  import { Router, Route } from "svelte-routing";

  // pages for this layout
  import Login from "../views/auth/Login.svelte";

  const registerBg2 = "../assets/img/register_bg_2.png";
  export const location = undefined;
</script>

<div>
  <main>
    <section class="relative w-full h-full py-40 min-h-screen">
      <div
        class="absolute top-0 w-full h-full bg-slate-100 bg-no-repeat bg-full"
      />
      <Router>
        <Route path="" let:location>
          <Login {location}/>
        </Route>
      </Router>
    </section>
  </main>
</div>
