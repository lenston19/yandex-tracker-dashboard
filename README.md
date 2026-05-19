# Yandex Tracker Dashboard

[![Release](https://img.shields.io/github/v/release/lenston19/yandex-tracker-dashboard)](https://github.com/lenston19/yandex-tracker-dashboard/releases)
[![Docker Pulls](https://img.shields.io/docker/pulls/lenston19/yandex-tracker-dashboard)](https://hub.docker.com/r/lenston19/yandex-tracker-dashboard)
[![Node](https://img.shields.io/badge/node-%3E%3D24-brightgreen)](https://nodejs.org/)
[![License](https://img.shields.io/github/license/lenston19/yandex-tracker-dashboard)](LICENSE)

Клиентская панель для работы с API Яндекс Трекера. Позволяет отслеживать трудозатраты, управлять задачами и формировать отчёты через удобный интерфейс.

[English version](README.en.md)

|                  Светлая тема                   |               Тёмная тема                |
| :---------------------------------------------: | :--------------------------------------: |
| ![Light](./docs/screenshot-dashboard-light.png) | ![Dark](./docs/screenshot-dashboard.png) |

## Функциональность

- **Дашборд** — виджеты за текущий день, неделю и месяц. При указании ставки отображается накопленная зарплата.
- **Недельный виджет** — клик по дню открывает детализацию списанного времени по задачам.
- **Тепловая карта** — визуализация активности по дням за выбранный период.
- **Таймер** — запуск трекинга прямо из интерфейса с автосписанием при остановке.
- **Мои задачи** — список активных задач с поиском по названию и фильтрацией по очередям.
- **Проекты** — карточки очередей, в которых сотрудник работал и списывал время.
- **Месячный отчёт** — график списания за месяц со средним значением.
- **Настройки** — ставка, плановые часы в день, часовой пояс, отображение.

## Быстрый старт

### Требования

- Node.js >= 24
- PNPM >= 10

### Локально

1. Клонируйте репозиторий:
    ```sh
    git clone https://github.com/lenston19/yandex-tracker-dashboard.git
    cd yandex-tracker-dashboard
    ```

2. Установите зависимости:
    ```sh
    pnpm install
    ```

3. Создайте `.env` из `.env.example`:
    ```sh
    cp .env.example .env
    ```

4. Запустите dev-сервер:
    ```sh
    pnpm dev
    ```

### Docker

```sh
docker pull lenston19/yandex-tracker-dashboard:latest
docker run -p 3000:3000 \
  -e NUXT_PUBLIC_YANDEX_CLIENT_ID=YOUR_CODE \
  lenston19/yandex-tracker-dashboard:latest
```

Доступны теги: `latest` (стабильная), `unstable` (dev-сборка).

## Настройка

### Авторизация

Получите ID организации по [ссылке](https://center.yandex.cloud/) и выполните вход через Yandex OAuth.

Укажите `NUXT_PUBLIC_YANDEX_CLIENT_ID` — получить можно в [Yandex OAuth](https://oauth.yandex.ru/client/new/).

> Для локальной авторизации получите ACCESS_TOKEN и откройте `http://localhost:3000/auth#access_token=<TOKEN>`

### Переменные окружения

| Переменная                         | Описание                               |
| ---------------------------------- | -------------------------------------- |
| `NUXT_PUBLIC_YANDEX_TRACKER_API`   | URL API Яндекс Трекера                 |
| `NUXT_PUBLIC_YANDEX_CLIENT_ID`     | OAuth Client ID                        |
| `NUXT_PUBLIC_ORGANIZATION_ID_LINK` | Ссылка на получение ID организации     |
| `NUXT_PUBLIC_THEME_TYPE`           | Сезонная тема: `halloween`, `new-year` |

## Стек

- [Nuxt 4](https://nuxt.com/)
- [Nuxt UI 4](https://ui.nuxt.com/)
- [Pinia](https://pinia.vuejs.org/)
- [VueUse](https://vueuse.org/)
- [Apexcharts](https://apexcharts.com/)
- [date-fns](https://date-fns.org/)
- [Vue Final Modal](https://vue-final-modal.org/)

---

> Если проект запускается, но постоянно висит лоадер Nuxt — проверьте проксирование доменов (актуально для РФ):
> `*.fontshare.com`, `*.fontsource.org`, `*.bunny.net`
