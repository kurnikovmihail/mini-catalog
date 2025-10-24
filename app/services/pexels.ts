// services/pexels.ts
import { createClient } from "pexels";

// Определим типы для параметров Pexels, чтобы было удобнее
type PhotoSize =
  | "large"
  | "medium"
  | "small"
  | "original"
  | "large2x"
  | "portrait"
  | "tiny";
type PhotoOrientation = "landscape" | "portrait" | "square";

const client = createClient(
  "jcMYcC80FyknV8oH1F8k2CGjRzmhhIUQCBO0IwZ8MpT40D1iHsOxhaQ5"
); // вставь сюда свой ключ

// services/pexels.ts
// ... (предполагаем, что PexelsPhotoSrc, PhotoSize и client определены выше)

// Тип для безопасного доступа к полю 'src' фотографии Pexels
type PexelsPhotoSrc = Record<PhotoSize, string> & Record<string, string>;

export async function getCarImage(
  brand: string,
  model: string,
  size: PhotoSize = "medium",
  orientation: PhotoOrientation = "landscape"
): Promise<string> {
  try {
    const query = `${brand} ${model}`;
    const response = await client.photos.search({
      query,
      per_page: 1,
      orientation: orientation,
    });

    // 💡 Проверка наличия и длины массива
    if ("photos" in response && response.photos.length > 0) {
      // Создаем локальную константу для первого фото (устраняет ошибку undefined на array[0])
      const photo = response.photos[0]!;

      // 💡 ИСПРАВЛЕНИЕ: Объявляем photoSrc с приведением типа, чтобы его можно было использовать.
      const photoSrc = photo.src as PexelsPhotoSrc;

      return photoSrc[size] || photoSrc.medium; // ✅ Ошибка 'Не удается найти имя "photoSrc"' устранена
    }

    // Если photos не было или массив был пуст
    return "/cars/placeholder.jpg";
  } catch (err) {
    console.error(err);
    return "/cars/placeholder.jpg";
  }
}
