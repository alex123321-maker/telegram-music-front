<template>
  <div class="audio-player-skeleton animate-pulse">
    <!-- полоска прогресса -->
    <div class="skeleton-progress mb-2" />

    <!-- основная линия управления -->
    <div class="skeleton-controls">
      <div class="skeleton-btn-group">
        <div class="skeleton-circle-small" />
        <div class="skeleton-circle-medium" />
        <div class="skeleton-circle-small" />
      </div>

      <div class="skeleton-cover" />

      <div class="skeleton-text flex-1 space-y-1">
        <div class="skeleton-line w-2/3" />
        <div class="skeleton-line w-1/3" />
      </div>

      <div class="skeleton-circle-small" />
    </div>
  </div>
</template>

<script setup lang="ts">
// purely visual skeleton
</script>

<style scoped>
.audio-player-skeleton {
  width: 100%;
  padding: .5rem 1rem;
  background: var(--bg-section);
}

/* ===== элементы-плейсхолдеры ===== */
.skeleton-progress,
.skeleton-circle-small,
.skeleton-circle-medium,
.skeleton-cover,
.skeleton-line {
  background: var(--border);     /* едва заметный серый */
}

.skeleton-progress {
  height: .375rem;
  border-radius: .375rem;
}

.skeleton-controls {
  display: flex;
  align-items: center;
  gap: .75rem;
}

.skeleton-btn-group {
  display: flex;
  gap: .5rem;
}

.skeleton-circle-small {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
}

.skeleton-circle-medium {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
}

.skeleton-cover {
  width: 3rem;
  height: 3rem;
  border-radius: .375rem;
}

.skeleton-text .skeleton-line {
  height: .875rem;
  border-radius: .375rem;
}

/* если нужен плавный пульс, а utility-класс отсутствует */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: .4; }
}
.animate-pulse {
  animation: pulse 1.5s infinite;
}
</style>
