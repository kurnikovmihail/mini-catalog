<template>
  <header class="sticky top-0 z-50 bg-white shadow-lg">
    <div class="container mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
      
      <NuxtLink to="/" class="text-2xl font-extrabold text-gray-800 hover:text-blue-600 transition-colors">
        AutoCatalog
      </NuxtLink>

      <div class="relative w-full max-w-md ml-8">
        <input 
          type="text"
          :value="store.searchQuery"
          @input="handleInput"
          placeholder="Поиск по марке или модели..."
          class="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
        />
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>

        <div 
          v-if="store.searchQuery.length > 0" 
          class="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto"
        >
          
          <template v-if="store.filteredCars.length > 0">
            <NuxtLink 
              v-for="car in store.filteredCars" 
              :key="car.id" 
              :to="`/car/${car.id}`"
              @click="clearSearch"
              class="block p-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <span class="font-semibold text-gray-800">{{ car.brand }}</span> 
              <span class="text-gray-600">{{ car.model }}</span>
              <span class="text-sm text-gray-500 ml-2">({{ car.year }})</span>
            </NuxtLink>
          </template>

          <div v-else class="p-4 text-gray-500 text-center">
            Ничего не найдено по запросу "{{ store.searchQuery }}"
          </div>
        </div>
      </div>
    </div>

    <div class="w-full h-1 bg-gray-200"></div>
  </header>
</template>

<script setup lang="ts">
import { useCarStore } from '~/stores/makes';

const store = useCarStore();

function handleInput(event: Event) {
    // Обновляем запрос в Pinia store при каждом вводе
    const target = event.target as HTMLInputElement;
    store.setSearchQuery(target.value);
}

function clearSearch() {
    // Очищаем запрос после перехода по ссылке
    store.setSearchQuery('');
}
</script>