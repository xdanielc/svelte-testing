<script lang="ts">
    import { onMount } from "svelte";
    import { animate, inView, hover } from "motion";
    import { scrambleText } from "./utils";
    let uniqueClass = generateUniqueId();  
    let slotContainer: HTMLElement
    let {children, className, interaction = 'enter', speed = 2 } :
    { children?: any, className? : string, interaction? : 'enter' | 'hover', speed? : number} = $props()

    let txtFrame : number = $state(0)
    let txtFrameHalf = $derived(Math.floor(txtFrame/speed))

    function generateUniqueId() {
        if (typeof crypto !== "undefined" && crypto.randomUUID) {
            return `entra-${crypto.randomUUID()}`;
        }
        return `entra-${Math.random().toString(36).substring(2)}`;
    }

    onMount(() => {
        const initialText = slotContainer.innerText

        function appear(){
            let strArr = initialText.split('');
            let rnd = scrambleText(initialText); // Scramble only the original text
            strArr = strArr.map((char, j) => {
                return j < txtFrameHalf ? initialText[j] : rnd[j]; // Reveal progressively
            });
            slotContainer.innerText = strArr.join('');
            if (txtFrameHalf < strArr.length){
                txtFrame++
                requestAnimationFrame(appear)
            }
        }

        if (interaction == 'enter'){
            slotContainer.innerText = scrambleText(slotContainer.innerText)
            inView(`.${uniqueClass}`, () => { requestAnimationFrame(appear)}, { margin: "0px 0px -200px 0px"})

            inView(`.${uniqueClass}`, () => {
                animate(`.${uniqueClass}`, { opacity: [0, 1] }, { duration: 0.5 })}, { margin: "0px 0px -200px 0px" })

        } else if (interaction == 'hover') {
            inView(`.${uniqueClass}`, () => {
                animate(`.${uniqueClass}`, { opacity: [0, 1] }, { duration: 0.5 })}, { margin: "0px 0px -200px 0px" })

            hover(`.${uniqueClass}`, () => {
                requestAnimationFrame(appear)

                return () => {
                    txtFrame = 0
                }
            })
        }
    })

    
</script>

<div class="{uniqueClass} {className} {interaction ? 'opacity-0' : ''}" bind:this={slotContainer}>
    {@render children?.()}
</div>