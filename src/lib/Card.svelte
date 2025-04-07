<script lang="ts">
    let { className } : { className?: string } = $props()

</script>

<div class="{className} group aspect-[3/4] overflow-hidden rounded-2xl bg-blue-400 relative">
    <div class="absolute bottom-0 w-full transition-all px-6 py-10 bg-blue-600
    translate-y-[101%] h-[30%] group-hover:translate-y-[1%] text-white"
    >
        <h2 class="text-2xl">El titulo</h2>
        <p class="text-xl">La descripción</p>
    </div>
</div>