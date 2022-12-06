<script lang="ts">
  import Icon from "svelte-awesome";
  import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
  import { parseISO, formatISO, setMonth } from "date-fns";

  import logo from "./assets/svelte.png";
  import Counter from "./lib/Counter.svelte";
  import { ripple } from "./lib/ripple";
  import "./index.css";

  let value = formatISO(setMonth(new Date(), 2));
  // $: { console.log(parseISO(value)); }

</script>

<main>
  <nav class="p-2">
    <button class="rounded-full" use:ripple>
      <Icon class="w-4 h-4 m-3" data={faArrowLeft} />
    </button>
  </nav>
  <section>
    <div class="flex items-start justify-between p-10">
      <img
        class="rounded-full w-24 h-24"
        src="https://placeimg.com/192/192/tech"
        alt="icon"
      />
      <input class="p-2 ml-10 border rounded-lg" type="text" bind:value />
    </div>
  </section>
  <img src={logo} alt="Svelte Logo" />
  <h1>Hello Typescript!</h1>
  <button use:ripple class="bg-blue-700 px-4 py-2 text-white rounded-lg">
    Test
  </button>
  <Counter />

  <p>
    Visit <a href="https://svelte.dev">svelte.dev</a> to learn how to build Svelte
    apps.
  </p>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme">SvelteKit</a> for
    the officially supported framework, also powered by Vite!
  </p>
</main>
