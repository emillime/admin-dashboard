<script lang="ts">
	import { localDb } from "$lib/localDb";

  
    export let defaultAge = 21;
  
    let status = "";
  
    let friendName = "";
    let friendAge = defaultAge;
  
    async function addFriend() {
      try {
  
        // Add the new friend!
        const id = await localDb.friends.add({
          name: friendName,
          age: friendAge
        });
  
        status = `Friend ${friendName} successfully added. Got id ${id}`;
        
        // Reset form:
        friendName = "";
        friendAge = defaultAge;
      } catch (error) {
        status = `Failed to add ${friendName}: ${error}`;
      }
    }
  </script>

  <div>
    <p>{status}</p>
    <fieldset>
      <legend>Add new friend</legend>
      <label>
        Name:
        <input
            type="text"
            bind:value={friendName} />
      </label>
      <br/>
      <label>
        Age:
        <input
          type="number"
          bind:value={friendAge} />
      </label>
      <br />
      <button on:click={addFriend}>Add Friend</button>
    </fieldset>
  </div>