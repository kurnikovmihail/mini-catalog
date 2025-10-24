<template>
  <div
    class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer 
           transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1"
    @click="goToCar(car)"
  >
    <div class="w-full h-48 bg-gray-200 flex items-center justify-center">
      
      <div v-if="car.imageLoading" class="preloader-sm"></div>

      <img
        v-else-if="car.imageUrl && car.imageUrl !== '/cars/placeholder.jpg'"
        :src="car.imageUrl"
        :alt="`${car.brand} ${car.model}`"
        class="w-full h-full object-cover"
      />

      <svg
        v-else
        class="w-16 h-16 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 14m12 6H6a2 2 0 01-2-2V6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2z"
        ></path>
      </svg>
    </div>

    <div class="p-6">
      <h2
        class="text-xl font-semibold text-gray-900 mb-2 truncate"
        :title="`${car.brand} ${car.model}`"
      >
        {{ car.brand }} {{ car.model }}
      </h2>
      <p class="text-gray-600 mb-1">Год: {{ car.year }}</p>
      <p class="text-2xl font-bold text-blue-600 mt-4">
        {{ car.price.toLocaleString("ru-RU") }} ₽
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

// ------------------------------------
// 1. ПРОПСЫ
// ------------------------------------

// Принимаем объект автомобиля как пропс
interface CarProps {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  imageUrl?: string;
  imageLoading?: boolean;
}

const props = defineProps<{
  car: CarProps;
}>();

// ------------------------------------
// 2. МЕТОДЫ
// ------------------------------------

const router = useRouter();

/**
 * Навигация на страницу деталей автомобиля.
 */
function goToCar(car: CarProps) {
  router.push(`/car/${car.id}`);
}
</script>

<style scoped>
/* Стили прелоадера должны быть здесь или в глобальном CSS */
.preloader-sm {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: #2563eb;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>