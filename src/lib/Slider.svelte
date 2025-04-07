<script>
    let cartas = Array(20)
</script>

<div id="carrousel" class="flex">
    <div id="galeria" style="scrollbar-width: none; height: clamp(240px, 25vw, 440px)"
        class="flex overflow-x-scroll 
        snap-x snap-mandatory py-4 w-full
        scroll-pl-9">
        <div class="h-full mr-8 ml-6 aspect-[14/16] flex justify-center flex-col items-start snap-start touch-pan-x text-white">
            <h2 class="text-2xl">Aquí un slider</h2>
            <p class="text-sm">Solo usa css para su scroll. Se ajusta al inicio de cada tarjeta (como tiktok/reels)</p>
            <p class="text-sm">También es responsive gradual usando css moderno con la funcion clamp() y vw</p>
        </div>
        {#each cartas as carta}
            <div class="poster flex h-full aspect-[10/16] mr-4 snap-start touch-pan-x relative outline-2 outline-white/0 rounded-xl outline-offset-2 hover:outline-white transition-colors">
                <img class="absolute object-cover bg-blue-800 rounded-xl w-full h-full" src="https://picsum.photos/200/300" alt="">
            </div>
        {/each}
    </div>
</div>