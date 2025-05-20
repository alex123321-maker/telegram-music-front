<!-- src/components/AudioPlayerSkeleton.vue -->
<template>
  <div class="audio-player-skeleton animate-pulse">
    <!-- полоска прогресса -->
    <div class="skeleton-progress mb-2" />

    <!-- основная линия управления -->
    <div class="skeleton-controls flex items-center gap-3">
      <div class="skeleton-btn-group flex items-center gap-2">
        <div class="skeleton-circle-small" />
        <div class="skeleton-circle-medium" />
        <div class="skeleton-circle-small" />
      </div>

      <div class="skeleton-cover rounded" />

      <div class="skeleton-text flex-1 space-y-1">
        <div class="skeleton-line w-2/3" />
        <div class="skeleton-line w-1/3" />
      </div>

      <div class="skeleton-circle-small" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Только визуальный скелетон
</script>

<style scoped>
.audio-player-skeleton {
  width: 100%;
  padding: 0.5rem 1rem;
  background-color: var(--tg-theme-background-color);
}

.skeleton-progress {
  height: 0.375rem;
  width: 100%;
  border-radius: 0.375rem;
  background-color: var(--tg-theme-section-separator-color);
}

.skeleton-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.skeleton-btn-group > div,
.skeleton-circle-small,
.skeleton-circle-medium,
.skeleton-cover,
.skeleton-line {
  background-color: var(--tg-theme-section-separator-color);
}

.skeleton-circle-small {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
}

.skeleton-circle-medium {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
}

.skeleton-cover {
  width: 3rem;
  height: 3rem;
  border-radius: 0.375rem;
}

.skeleton-text .skeleton-line {
  height: 0.875rem;
  border-radius: 0.375rem;
}
</style>
