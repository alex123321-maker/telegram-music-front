<template>
  <div class="flex box-border h-dvh bg-gray-100">
    <Sidebar @toggle="isSidebarOpen = $event" />
    <main class="flex-1 h-full transition-all duration-300">
      <YoutubeProxy />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Sidebar from '@/components/SideBar.vue'
import YoutubeProxy from '@/components/YoutubeProxy.vue'

const isSidebarOpen = ref(false)
</script>
