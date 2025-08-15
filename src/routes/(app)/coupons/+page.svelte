<script lang="ts">
  import { createCoupon } from "$lib/api";
  import { getTokenFromCookie } from "../../../utils/jwtUtils";

  let name = '';
  let verification = '';
  let code = '';
  let sum = '';
  let templateMessage = '';

  const generateMessage = () => {
    if (!name || !verification || !sum) {
      alert('All fields are required!');
      return;
    }

    code = `EP${verification}`;

    templateMessage = `Hej ${name}!\n\nTack för att du köpt ett klippkort på KAYAKOMAT Gröndal.\n\nMed ditt klippkort kan du boka för upp till ${sum} kr till 31 december 2025. Du kan använda hela beloppet på en gång, eller dela upp det.\n\nNär du vill boka paddling går du in på www.kayakomat.com och klickar dig vidare till rätt station (Kayakomat Gröndal).\n\nI bokningsflödet anger du rabattkod ${code} så dras summan av i kassan. Om din vara kostar mer än klippkortets belopp kan betala mellanskillnaden när du bekräftar bokningen.\n\nHar du frågor? Tveka inte att höra av dig direkt till mig.\n\nJag önskar dig en trevlig paddling!\n\nHälsningar, \nEmil - Operatör KAYAKOMAT Gröndal`;

    sendToApi(code, sum);
  };

  async function sendToApi(code: string, sum: string) {
    try {
      const token = getTokenFromCookie() ?? ""
      const response = createCoupon(token, code, 'giftCard', sum, '2024-12-01', '2025-12-31')

      if (response == null) {
        throw new Error('Failed to send the code to the server');
      }
      console.log('Response:', response);
      console.log('Code successfully sent to the server!');
    } catch (error) {
      console.error('Error sending code:', error);
      console.log('Failed to send the code to the server. Please try again.');
    }
  };
</script>

<style>
  .container {
    max-width: 400px;
    margin: 0 auto;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
  input {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  button {
    display: block;
    width: 100%;
    padding: 0.5rem;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
  textarea {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
</style>

<div class="container">
  <h2>Skapa kod</h2>
  <label for="name">Namn</label>
  <input id="name" type="text" bind:value={name} placeholder="Namn" />

  <label for="verification">Verifikation</label>
  <input id="verification" type="text" bind:value={verification} placeholder="Verifikation" />

  <label for="sum">Summa</label>
  <input id="sum" type="text" bind:value={sum} placeholder="Summa" />

  <button on:click={generateMessage}>Skapa kod</button>

  {#if templateMessage}
    <div>
      <h3>Meddelande</h3>
      <textarea readonly rows="10">{templateMessage}</textarea>
    </div>
  {/if}
</div>