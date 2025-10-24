// stores/carStore.ts
import { defineStore } from 'pinia';
import carsData from '~/data/cars.json';

// Интерфейс для Car (используется во всем приложении)
interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  imageUrl?: string;
  imageLoading?: boolean;
}

interface CarStoreState {
  searchQuery: string;
  allCars: Car[];
}

export const useCarStore = defineStore('car', {
  state: (): CarStoreState => ({
    searchQuery: '',
    // Используем 'as Car[]' для типобезопасности
    allCars: carsData as Car[], 
  }),
  
  getters: {
    // Возвращает список автомобилей с добавленным полем загрузки для страницы каталога
    initialCars(state): Car[] {
       return state.allCars.map(c => ({
           ...c,
           imageLoading: true
       }));
    },
    
    // Геттер для фильтрации по марке ИЛИ модели
    filteredCars(state): Car[] {
      const query = state.searchQuery.trim().toLowerCase();
      if (!query) {
        return [];
      }
      return state.allCars.filter(car => 
        car.brand.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query)
      ).slice(0, 10); // Ограничиваем список 10 результатами
    },
  },

  actions: {
    // Действие для обновления поискового запроса из шапки
    setSearchQuery(query: string) {
      this.searchQuery = query;
    },
  },
});