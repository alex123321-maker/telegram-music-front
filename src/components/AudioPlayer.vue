<template>
  <div class="bg-red-400">
    <div class="w-full flex items-center gap-4">
      <button class="bg-red-400 p-6"
        @click="togglePlay"
      >
        <span v-if="!isPlaying" class="h-6 w-6">▶️</span>
        <span v-if="isPlaying" class="h-6 w-6">⏸️</span>

      </button>



      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        v-model.number="volume"
        @input="updateVolume"
        class="w-24"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { Howl } from 'howler';

type Props = {
  src: string;
  autoplay?: boolean;
  loop?: boolean;
};

const props = defineProps<Props>();

const isPlaying = ref<boolean>(false);
const progress = ref<number>(0);
const volume = ref<number>(1);
let sound: Howl | null = null;
let rafId: number | null = null;

function togglePlay(): void {
  if (!sound) return;
  if (isPlaying.value) {
    sound.pause();
  } else {
    sound.play();
  }
}

function updateProgress(): void {
  if (sound) {
    const seeked = sound.seek() as number || 0;
    const duration = sound.duration() || 1;
    progress.value = (seeked / duration) * 100;
  }
}

function updateLoop(): void {
  updateProgress();
  rafId = requestAnimationFrame(updateLoop);
}

function updateVolume(): void {
  if (sound) {
    sound.volume(volume.value);
  }
}

function seek(event: MouseEvent): void {
  if (!sound) return;
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const newProgress = clickX / rect.width;
  sound.seek(sound.duration() * newProgress);
  updateProgress();
}

onMounted(() => {
  sound = new Howl({
    src: [props.src],
    html5: true,
    autoplay: props.autoplay || false,
    loop: props.loop || false,
    volume: volume.value,
    onplay: () => {
      isPlaying.value = true;
      rafId = requestAnimationFrame(updateLoop);
    },
    onpause: () => {
      isPlaying.value = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
    },
    onend: () => {
      isPlaying.value = false;
      progress.value = 0;
      if (rafId !== null) cancelAnimationFrame(rafId);
    }
  });
});

onBeforeUnmount(() => {
  if (sound) {
    sound.unload();
    sound = null;
  }
  if (rafId !== null) cancelAnimationFrame(rafId);
});
</script>

<style scoped>
/* Стили через Tailwind CSS */
</style>
