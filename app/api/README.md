# README

## -------------------------------- api.client.js --------------------------------

Данный код , предоставляет функции для работы с маркерами.
Он использует локальное хранилище (`localStorage`) для хранения списка маркеров и хэш-кода последнего обновления.
Основная функция `fetchMarkersIfNeeded` проверяет наличие данных о маркерах в локальном хранилище.
Если данные уже есть и есть также хэш-код, то функция вызывает функцию `fetchMarkers` с переданным хэш-кодом.
В противном случае она вызывает функцию `fetchMarkers` без параметров, чтобы получить новые данные.
Функция `fetchMarkers` выполняет запрос к серверу и сохраняет полученные данные в локальное хранилище, если они были обновлены.
Иначе, она возвращает сохраненные данные из локального хранилища.

### fetchMarkersIfNeeded

```javascript
import { fetchMarkersIfNeeded } from "api.client.js";

async function getData() {
  try {
    const markers = await fetchMarkersIfNeeded();
    console.log(markers);
  } catch (error) {
    console.error(error);
  }
}

getData();
```

Функция `fetchMarkersIfNeeded` проверяет наличие данных в `localStorage`. Если данные отсутствуют, она вызывает функцию `fetchMarkers` для получения данных из API.

### fetchMarkers

```javascript
import { fetchMarkers } from "api.client.js";

async function getData() {
  try {
    const markers = await fetchMarkers();
    console.log(markers);
  } catch (error) {
    console.error(error);
  }
}

getData();
```

Функция `fetchMarkers` получает данные из API. Она просто возвращает `saveDataLocalStorage` передава в неё полученные данные.

### saveDataLocalStorage

```javascript
const markersHash = '12345';
const data = {
  hash: '12345',
  markers: [ ... ],
};

const markers = saveDataLocalStorage({ markersHash, data });
```

Переменная `markers` будет содержать данные маркеров, либо из localStorage, либо из предоставленных данных, в зависимости от сравнения хешей.

**Примечание:** В коде не указано реализации работы с localStorage, однако основная логика сравнения и обновления данных присутствует. Эту функцию можно использовать в составе более обширной программы, управляющей localStorage.

### fetchEvent

```javascript
import { fetchEvent } from "api.client.js";

async function getEvent() {
  try {
    const event = await fetchEvent({ id: "123", collection: "events" });
    console.log(event);
  } catch (error) {
    console.error(error);
  }
}

getEvent();
```

Функция `fetchEvent` получает данные о событии из API, указывая идентификатор и коллекцию события. Возвращает полученные данные.

### fetchSearchEvent

```javascript
import { fetchSearchEvent } from "api.client.js";

async function searchEvent() {
  try {
    const searchResults = await fetchSearchEvent({ text: "search query" });
    console.log(searchResults);
  } catch (error) {
    console.error(error);
  }
}

searchEvent();
```

Функция `fetchSearchEvent` выполняет поиск событий по заданному текстовому запросу в API. Возвращает результаты поиска.

## -------------------------------- api.server.js --------------------------------

### fetchMarkers

Функция `fetchMarkers` предназначена для получения маркеров с сервера. Она принимает один аргумент - хеш маркеров `markersHash`, и асинхронно выполняет следующие шаги:

1. Проверяет наличие кэша маркеров (`markersCache`) и хеша маркеров (`markersHashCache`) в кэше.
2. Если и кэш маркеров, и хеш маркеров присутствуют в кэше, то происходит сравнение `markersHashCache` с переданным в аргументах `markersHash`. Если они совпадают, возвращается объект с ключами `markers` со значением "ok" и `hash` со значением `markersHashCache`. Если не совпадают, возвращается объект с ключами `markers` со значением `markersCache` и `hash` со значением `markersHashCache`.
3. Если кэш маркеров или хеша маркеров отсутствует, происходит отправка запроса на сервер для получения маркеров.
4. Если ответ от сервера не является "ок", выбрасывается ошибка с сообщением "Network response was not ok".
5. Полученные маркеры преобразуются в формат JSON.
6. Вычисляется новый хеш маркеров (`newMarkersHash`) на основе полученных данных.
7. Если полученные маркеры не являются пустыми, они сохраняются в кэш `markersCache` на 10 минут, а также сохраняется новый хеш маркеров `newMarkersHash` в кэш `markersHashCache` на 10 минут.
8. Возвращается объект с ключами `markers` со значением `markersCache` и `hash` со значением `markersHashCache`.
