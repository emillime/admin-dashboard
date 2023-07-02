<script lang="ts">
  import { navigate } from "svelte-routing";
  import { authorize } from "../../api/api";
  import { tokenStore } from "../../utils/tokenStore";

  export let location;

  let username = '';
	let password = '';
  let remember = false;
	let error = '';

  async function login() {
    try {
      const token = await authorize(username, password);
      $tokenStore = token;
      if (error) error = '';
      navigate("/dashboard");
    } catch (err) {
      error = 'Felaktigt användarnamn eller lösenord.';
    }
	}

  if ($tokenStore != null) {
    navigate("/dashboard");
  }
</script>

<div class="container mx-auto px-4 h-full">
  <div class="flex content-center items-center justify-center h-full">
    <div class="w-full lg:w-4/12 px-4">
      <div
        class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-xl rounded-lg bg-slate-200 border-0"
      >
        <div class="flex-auto px-4 lg:px-10 py-10">
          <form on:submit|preventDefault={login}>
            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-slate-600 text-xs font-bold mb-2"
                for="grid-email"
              >
                Email
              </label>
              <input
                id="grid-email"
                type="email"
                class="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Email"
                bind:value={username}
              />
            </div>

            <div class="relative w-full mb-3">
              <label
                class="block uppercase text-slate-600 text-xs font-bold mb-2"
                for="grid-password"
              >
                Password
              </label>
              <input
                id="grid-password"
                type="password"
                class="border-0 px-3 py-3 placeholder-slate-300 text-slate-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                placeholder="Password"
                bind:value={password}
              />
            </div>
            <div>
              <label class="inline-flex items-center cursor-pointer">
                <input
                  id="customCheckLogin"
                  type="checkbox"
                  class="form-checkbox border-0 rounded text-slate-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  bind:checked={remember}
                />
                <span class="ml-2 text-sm font-semibold text-slate-600">
                  Remember me
                </span>
              </label>
            </div>

            <div class="text-center mt-6">
              <button
                class="bg-slate-800 text-white active:bg-slate-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                type="submit"
              >
                Sign In
              </button>
              {#if error !== ''}
              <div class="text-xs text-red-500">
                <small>{error}</small>
              </div>
              {/if}
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
