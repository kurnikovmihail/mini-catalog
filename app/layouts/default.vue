<template>
  <div>
    <AppHeader />
    
    <main>
      <slot />
    </main>
    
    </div>
</template>

<script setup lang="ts">
// Импортируем компонент шапки. 
// В Nuxt 3 это обычно не требуется, так как компоненты импортируются автоматически,
// но явный импорт может быть полезен, если авто-импорт отключен.
import AppHeader from '~/components/AppHeader.vue'; 
</script>