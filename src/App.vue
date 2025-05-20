<script setup lang="ts">
import {
  onSettingsButtonClick,
  offSettingsButtonClick,
} from '@telegram-apps/sdk';

if (onSettingsButtonClick.isAvailable()) {
  function listenerOn() {
    console.log('Clicked ONNNN!');
  }
  function listenerOff() {
    console.log('Clicked OFFF!');
  }
  onSettingsButtonClick(listenerOn);
  offSettingsButtonClick(listenerOff);
}



</script>

<template>
    <RouterView />
</template>
