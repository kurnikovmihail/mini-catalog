<template>
  <div class="min-h-screen bg-gray-50">
    <div
      v-if="pageLoading"
      class="flex items-center justify-center min-h-screen"
    >
      <div class="preloader"></div>
    </div>

    <div v-else-if="car" class="container mx-auto max-w-7xl p-4 md:p-8">
      <div class="grid grid-cols-1 lg:grid-cols-5 lg:gap-8">
        <div class="lg:col-span-2">

          <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2
              class="text-2xl font-semibold mb-4 border-b border-gray-200 pb-2"
            >
              {{ car.brand }} {{ car.model }}
            </h2>
            <div class="space-y-3">
              <p class="text-gray-700 text-lg">
                <span class="font-semibold">Год:</span> {{ car.year }}
              </p>
              <p class="text-3xl font-bold text-blue-600">
                {{ car.price.toLocaleString("ru-RU") }} ₽
              </p>
            </div>
          </div>

          <div
            v-if="otherModels.length"
            class="bg-white rounded-lg shadow-md p-6"
          >
            <h2
              class="text-xl font-semibold mb-4 border-b border-gray-200 pb-2"
            >
              Еще модели <span class="font-normal">{{ car.brand }}</span>
            </h2>
            <ul class="list-disc list-inside space-y-2">
              <li
                v-for="m in otherModels"
                :key="m.Model_ID"
                class="text-gray-700 hover:text-blue-500 transition-colors cursor-pointer"
              >
                {{ m.Model_Name }}
              </li>
            </ul>
          </div>
        </div>

        <div class="lg:col-span-3 mb-6 lg:mb-0">
          <div
            class="w-full aspect-video bg-gray-200 rounded-lg shadow-lg overflow-hidden flex items-center justify-center"
          >
            <div v-if="imageLoading" class="preloader"></div>

            <img
              v-else-if="car.image"
              :src="car.image"
              :alt="`Фото ${car.brand} ${car.model}`"
              class="w-full h-full object-cover"
            />

            <div v-else class="text-gray-500">Фото не доступно</div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="flex flex-col items-center justify-center min-h-screen text-center p-4"
    >
      <h2 class="text-3xl font-semibold text-gray-800 mb-2">Ошибка 404</h2>
      <p class="text-lg text-gray-500">Извините, машина не найдена.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
// Типы из pexels.ts теперь можно импортировать, если они экспортированы
// import type { PhotoSize, PhotoOrientation } from '~/services/pexels';
// Но для данного файла они не нужны, т.к. мы просто передаем строки
import { getCarImage } from "~/services/pexels";
import carsData from "~/data/cars.json";

// --- Интерфейсы ---

// Основной интерфейс для нашей машины
interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  image?: string;
}

// Интерфейс для чистых данных о других моделях
interface OtherModel {
  Model_ID: number;
  Model_Name: string;
}

// --- Интерфейсы для ответа от API (NHTSA) ---

// Описываем "грязный" объект, который может прийти
interface NhtsaApiResult {
  Model_ID?: number;
  Model_Name?: string;
  // Добавляем не-camelCase варианты
  ID_модели?: number;
  Название_модели?: string;
  // Позволяем любые другие свойства, чтобы TS не ругался
  [key: string]: any;
}

// Описываем весь ответ
interface NhtsaApiResponse {
  Count: number;
  Message: string;
  Results: NhtsaApiResult[];
}

// --- Логика компонента ---

const route = useRoute();
const carId = Number(route.params.id);

const pageLoading = ref(true);
const imageLoading = ref(false);

const car = ref<Car | null>(null);
// Типизируем ref с помощью нашего чистого интерфейса
const otherModels = ref<OtherModel[]>([]);

// --- Функции ---

async function fetchCarImage() {
  if (!car.value) return;

  imageLoading.value = true;
  try {
    // Явно передаем 'large' и 'landscape'
    const imageUrl = await getCarImage(
      car.value.brand,
      car.value.model,
      "large",
      "landscape"
    );
    if (car.value) {
      car.value.image = imageUrl;
    }
  } catch (e) {
    console.error("Не удалось загрузить картинку", e);
  } finally {
    imageLoading.value = false;
  }
}

async function fetchOtherModels() {
  if (!car.value) return;

  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMake/${encodeURIComponent(
        car.value.brand
      )}?format=json`
    );
    // Явно типизируем ответ от API
    const data: NhtsaApiResponse = await res.json();

    if (data.Results && Array.isArray(data.Results)) {
      otherModels.value = data.Results
        // 1. Маппинг (с очисткой данных)
        .map((m: NhtsaApiResult): OtherModel | null => {
          // Безопасно получаем ID и Имя, используя ??
          const id = m.Model_ID ?? m["ID_модели"];
          const name = m.Model_Name ?? m["Название_модели"];

          // Проверяем, что данные корректны
          if (typeof id === "number" && typeof name === "string") {
            return { Model_ID: id, Model_Name: name };
          }
          return null; // Возвращаем null, если запись невалидна
        })
        // 2. Фильтрация
        .filter(
          (
            m
          ): m is OtherModel => m !== null && m.Model_Name !== car.value!.model // Используем type guard // Убираем null и текущую модель
        )
        // 3. Ограничение
        .slice(0, 5);
    }
  } catch (e) {
    console.error("Не удалось загрузить модели марки", e);
  }
}

// --- onMounted ---

onMounted(() => {
  car.value = carsData.find((c) => c.id === carId) || null;

  if (!car.value) {
    pageLoading.value = false;
    return;
  }

  pageLoading.value = false;

  // Запускаем обе задачи параллельно в фоне
  fetchCarImage();
  fetchOtherModels();
});
</script>

<style scoped>
.preloader {
  border: 4px solid rgba(0, 0, 0, 0.1);
  /* Используем цвет из Tailwind (blue-600) для единообразия */
  border-left-color: #2563eb;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
