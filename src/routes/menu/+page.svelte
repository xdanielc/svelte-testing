<script lang="ts">
    import { animate, stagger } from 'motion';
    import { onNavigate } from '$app/navigation';

    function preventDefault(fn : Function) {
		return function (event : any) {
			event.preventDefault();
            // @ts-ignore
			fn.call(this, event);
		};
	}

    //we put this outside to make sure there's only one
    let transitionElement : HTMLElement | null = null;

    async function transiciona(id:string) {
        if(transitionElement){
            transitionElement.remove();
        }
        let elem = document.getElementById(id)
        if (!elem) return
        let top = elem.getBoundingClientRect().top
        let left = elem.getBoundingClientRect().left
        let width = elem.getBoundingClientRect().width
        let height = elem.getBoundingClientRect().height

        let par = document.querySelector('.h-screen')
        if (!par) return
        let nuevo = document.createElement('div')
        if (!nuevo) return

        transitionElement = nuevo
        par.appendChild(nuevo)
        nuevo.style.position = 'fixed'
        nuevo.style.top = `${top}px`
        nuevo.style.left = `${left}px`
        nuevo.style.width = `${width}px`
        nuevo.style.height = `${height}px`
        nuevo.style.background = getComputedStyle(elem).backgroundColor
        nuevo.style.borderRadius = '2rem'

        // use try catch to really make sure it works
        try{
            // for some reason this fails, but I still se an animation?
            await animate([
                [`.seccion:not(#${id})`, { opacity: 0, scale: 0 }, { delay: stagger(0.05) }],
                [nuevo, { width: '100vw', height: '100vh', top: '0px', left: '0px', borderRadius: '0px' }, { duration: 0.7, at: '<', ease: 'circInOut' }]
            ]);
        } catch (error) {
            if (transitionElement){
                transitionElement.remove();
            }
        }
    }

    onNavigate(async (navigation) => {
        if (!navigation.to) return; //another defense
        const targetId = navigation.to?.url.pathname.slice(1);
        //fail (on try block, when using animate)
        await transiciona(targetId);
    });
</script>

<div class="h-screen bg-gray-800 p-2 lg:p-12 flex flex-col gap-y-2 lg:gap-y-12 content-stretch items-stretch">
    <div class="grow flex gap-x-2 lg:gap-x-12 content-stretch items-stretch">
        <a id="a" aria-label="a" href="/a" onclick={() => transiciona('a')} class="seccion w-6 lg:w-32 rounded-4xl border-2 bg-lime-700 border-lime-500 grow"></a>
        <a id="b" aria-label="b" href="/b" onclick={() => transiciona('b')} class="seccion w-6 lg:w-32 rounded-4xl border-2 bg-red-700 border-red-500 grow-[2]"></a>
        <a id="c" aria-label="c" href="/c" onclick={() => transiciona('c')} class="seccion w-6 lg:w-32 rounded-4xl border-2 bg-blue-700 border-blue-500 grow-[3]"></a>
    </div>
    <div class="grow flex gap-x-2 lg:gap-x-12 content-stretch items-stretch">
        <a id="d" aria-label="d" href="/d" onclick={() => transiciona('d')} class="seccion w-6 lg:w-32 rounded-4xl border-2 bg-teal-700 border-teal-500 grow-[2]"></a>
        <a id="e" aria-label="e" href="/e" onclick={() => transiciona('e')} class="seccion w-6 lg:w-32 rounded-4xl border-2 bg-lime-700 border-lime-500 grow-[2]"></a>
        <a id="f" aria-label="f" href="/f" onclick={() => transiciona('f')} class="seccion w-6 lg:w-32 rounded-4xl border-2 bg-green-700 border-green-500 grow"></a>
    </div>
</div>

<svelte:head>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
</svelte:head>

<style>
    :global(:root){
        font-family: "DM Sans", sans-serif !important;
    }
</style>