<script lang="ts">
    import { animate, hover } from 'motion';
    import { onMount } from 'svelte';
    import { scrambleText } from './utils';
    let {scramble = false  } = $props();

    let pills: HTMLElement[];
    let mul = $state(0);

    function getTransformValues(element: Element) {
        const style = window.getComputedStyle(element);
        const matrix = new WebKitCSSMatrix(style.transform); // Works in modern browsers

        return {
            x: matrix.m41, // translateX
            y: matrix.m42, // translateY
            z: matrix.m43  // translateZ (only if 3D transform applied)
        };
    }
    

    function handleMouseMove(event: MouseEvent) {
        const { clientX: mouseX, clientY: mouseY } = event;

        pills.forEach((pill) => {
            const rect = pill.getBoundingClientRect();
            const pillX = rect.left + rect.width / 2;
            const pillY = rect.top + rect.height / 2;

            const distance = Math.sqrt(
                Math.pow(mouseX - pillX, 2) + Math.pow(mouseY - pillY, 2)
            );

            const maxDistance = 500; // Maximum distance to consider
            const maxTransformZ = 100; // Maximum transformZ value

            const transformZ = Math.max(
                0,
                maxTransformZ - (distance / maxDistance) * maxTransformZ
            );
            const transformX = (mouseX - pillX) * -0.2;
            const transformY = (mouseY - pillY) * -0.2;

            pill.style.transform = `translateX(${transformX*mul}px) translateY(${transformY*mul}px) translateZ(${transformZ*mul}px)`;
            // Debug Z
            // pill.innerText = String(Math.round(transformZ-60)).padStart(3, '0')
        });
    }
    
    onMount(() => {
        
        pills = Array.from(document.querySelectorAll('#pills .pill'));

        // Scramble continuado
        if (scramble){
            requestAnimationFrame(desdibuja)
        }
        function desdibuja(){
            pills.forEach(pill => {
                pill.innerText = scrambleText(pill.innerText)
            })
            requestAnimationFrame(desdibuja)
        }
        
        hover('#pills', (element) => {
            const ele = element as HTMLElement
            pills.forEach(pill => {
                animate(pill, { x: 0, y: 0, z: 0 }, { duration: 0 });
            })
            ele.addEventListener('mousemove', handleMouseMove);
            animate(0, 1, {onUpdate: latest => mul = latest})

            return () => {
                ele.removeEventListener('mousemove', handleMouseMove);
                pills.forEach((pill) => {
                    const {x: posx, y: posy, z: posz } = getTransformValues(pill)
                    animate(pill, {x: [posx, 0], y: [posy, 0], z: [posz, 0]}, {duration: 0.5, ease: 'easeInOut'})
                })
            };
        });
    });
</script>

<div>
    <div class="mt-40"></div>
    <div id="pills" class="flex flex-col items-center transform-3d rotate-x-6 text-white font-bold mx-auto w-fit px-28 py-56 my-[-20rem]">
        <div class="flex gap-x-1 mb-2 transform-3d">
            <div class="pill bg-cyan-700 web">CSS</div>
            <div class="pill bg-cyan-900 web">PHP</div>
            <div class="pill bg-cyan-900 web">Sass</div>
            <div class="pill bg-cyan-900 web">React</div>
        </div>
        <div class="flex gap-x-1 mb-2 transform-3d">
            <div class="pill bg-cyan-700 web">tailwind</div>
            <div class="pill bg-cyan-900 web">wordpress</div>
            <div class="pill bg-cyan-700 web">Typescript</div>
            <div class="pill bg-cyan-900 web">Svelte</div>
        </div>
        <div class="flex gap-x-1 mb-2 transform-3d">
            <div class="pill bg-cyan-950 py">Python</div>
            <div class="pill bg-cyan-900 py">Selenium</div>
            <div class="pill bg-cyan-900 py">BeautifulSoup</div>
            <div class="pill bg-cyan-900 py">Requests</div>
        </div>
        <div class="flex gap-x-1 mb-2 transform-3d">
            <div class="pill bg-cyan-700 game">Godot</div>
            <div class="pill bg-cyan-900 game">Unity</div>
            <div class="pill bg-cyan-900 game">C#</div>
            <div class="pill bg-cyan-900 py">Pandas</div>
            <div class="pill bg-cyan-900 py">Matplotlib</div>
            <div class="pill bg-cyan-900 py web">Flask</div>
        </div>
        <div class="flex gap-x-1 mb-2 transform-3d">
            <div class="pill bg-cyan-900 web">Javascript</div>
            <div class="pill bg-cyan-900 web">Hugo</div>
            <div class="pill bg-cyan-700 misc">LLMs APIs</div>
            <div class="pill bg-cyan-900 misc">Powershell</div>
            <div class="pill bg-cyan-950 misc">Bash</div>
        </div>
        <div class="flex gap-x-1 mb-2 transform-3d">
            <div class="pill bg-cyan-950 misc">Linux</div>
            <div class="pill bg-cyan-900 misc">MAC</div>
            <div class="pill bg-cyan-950 misc">Windows</div>
            <div class="pill bg-cyan-900 web">JSON</div>
            <div class="pill bg-cyan-900 misc">CSV</div>
        </div>
        <div class="flex gap-x-1 mb-2 transform-3d">
            <div class="pill bg-cyan-900 misc">Git</div>
            <div class="pill bg-cyan-900 web">Node</div>
            <div class="pill bg-cyan-950 game">Blender</div>
            <div class="pill bg-cyan-700 game">3DS Max</div>
        </div>
    </div>
</div>

<style>
    #pills{
        perspective: 400px;
    }
    :root{
        --pill-on: 1;
        --pill-off: .3;
    }
    #pills .pill{
        transition: .3s opacity ease-in-out;
    }
    #pills:has(.py:hover) .pill:not(.py){
        opacity: var(--pill-off);
    }
    #pills:has(.py:hover) .pill.py{
        opacity: var(--pill-on);
    }
    #pills:has(.web:hover) .pill:not(.web){
        opacity: var(--pill-off);
    }
    #pills:has(.web:hover) .pill.web{
        opacity: var(--pill-on);
    }
    #pills:has(.misc:hover) .pill:not(.misc){
        opacity: var(--pill-off);
    }
    #pills:has(.misc:hover) .pill.misc{
        opacity: var(--pill-on);
    }
    #pills:has(.game:hover) .pill:not(.game){
        opacity: var(--pill-off);
    }
    #pills:has(.game:hover) .pill.game{
        opacity: var(--pill-on);
    }
</style>