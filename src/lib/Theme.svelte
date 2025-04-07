<script lang="ts">
    import { onMount } from "svelte";
    onMount(() =>{
        let btnLight   = document.getElementById("light")!
        let btnDark  = document.getElementById("dark")!
        let btnSys = document.getElementById("system")!
        let theme = document.getElementById("theme")!
        let root = document.documentElement
        let systemPreference = window.matchMedia("(prefers-color-scheme: dark)");
        let isSystemMode = true;

        btnLight.addEventListener("click", () => {
            isSystemMode = true
            root.setAttribute('class', 'light')
            theme.setAttribute('content', 'light')
        })
        btnDark.addEventListener("click", () => { 
            isSystemMode = false
            root.setAttribute('class', 'dark')
            theme.setAttribute('content', 'dark')
        })
        btnSys.addEventListener("click", () => { 
            isSystemMode = true
            applySystemTheme();
        })

        function applySystemTheme() {
            if (systemPreference.matches) {
                root.setAttribute("class", "dark");
                theme.setAttribute("content", "dark");
            } else {
                root.setAttribute("class", "light");
                theme.setAttribute("content", "light");
            }
        }

        systemPreference.addEventListener("change", (e) => {
            if (isSystemMode) {
                applySystemTheme();
            }
        });
        applySystemTheme();
    })
</script>

<div class="fixed right-4 bottom-4 z-50">
    <button class="px-4 py-2 rounded-md bg-amber-200 dark:bg-cyan-600 dark:hover:bg-cyan-700" id="light">Light</button>
    <button class="px-4 py-2 rounded-md bg-amber-200 dark:bg-cyan-600 dark:hover:bg-cyan-700" id="dark">Dark</button>
    <button class="px-4 py-2 rounded-md bg-amber-200 dark:bg-cyan-600 dark:hover:bg-cyan-700" id="system">System</button>
</div>