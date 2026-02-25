# 🧭 Что нового?

### 2026-02-25
::badge
**v1.1.8**
::

::card-group
::card{icon="i-lucide-refresh-ccw" color="info"}
- Обновлена ссылка на получение ID организации
::
::

### 2026-02-01
::badge
**v1.1.7**
::

::card-group
::card{icon="i-lucide-plus" color="primary"}
- Добавлены подсказки в README для локального запуска проекта
::
::card{icon="i-lucide-bug" color="warning"}
- При переключении месяцев в разделе месячного отчёта, если пользователь заходил в февраль (28 дней), все последующие месяцы также показывали 28 дней. Это приводило к некорректному отображению графика и неправильному расчёту общих часов за месяц.
::
::

### 2026-01-30
::badge
**v1.1.6**
::

::card-group
::card{icon="i-lucide-bug" color="warning"}
- Баг с тем, что если много контента в модальном окне, то он выходил за рамки окна
- На мобильном экране модальное окно было во всю ширину экрана
- В модальном окне с дневным отчетом заголовок заходил под кнопку закрытия
::
::

### 2025-12-06
::badge
**v1.1.5**
::

::card-group
::card{icon="i-lucide-plus" color="primary"}
- Новогодняя тема
::
::card{icon="i-lucide-refresh-ccw" color="info"}
- Логотип заменен согласно новой цветовой палитре
::
::

### 2025-11-17
::badge
**v1.1.4**
::

::card-group
::card{icon="i-lucide-refresh-ccw" color="info"}
- Записи учета времени теперь тянутся по ключу "start"
- Переезд на V3 API
::
::card{icon="i-lucide-bug" color="warning"}
- Исправлен визуальный вывод процента в графике на странице <a href="/monthly-report" class="text-primary">Месячный отчет</a>
- Исправлен баг, когда выводились финансы в виджете <b>"Сводка месяца"</b> на <a href="/" class="text-primary">дашборде</a>, даже если параметр в настройках не был добавлен
::
::

### 2025-11-10
::badge
**v1.1.3**
::

::card-group
::card{icon="i-lucide-bug" color="warning"}
- Исправлена ошибка с сохранением темы у пользователя, даже если она отключена в переменных окружения
::
::

### 2025-10-09
::badge
**v1.1.2**
::

::card-group
::card{icon="i-lucide-plus" color="primary"}
- Добавлена страница <a href="/faq" class="text-primary">FAQ</a>
::
::

---

::badge
**v1.1.1**
::

::card-group
::card{icon="i-lucide-plus" color="primary"}
- Сезонная тема Halloween, можно включить на странице <a href="/settings" class="text-primary">настроек</a>
::
::card{icon="i-lucide-bug" color="warning"}
- Поправлена ошибка с запросом данных о пользователе, когда он не авторизован
::
::

---
### 2025-10-08
::badge
**v1.1.0**
::

::card-group
::card{icon="i-lucide-plus" color="primary"}
- Страница 404  
- Добавлен <a href="https://vue-final-modal.org/">Vue Final Modal</a>  
- Реализована модульная структура
::
::card{icon="i-lucide-refresh-ccw" color="info"}
- Обновлен <a href="https://ui.nuxt.com/">Nuxt UI</a> до версии 4  
- Обновлен <a href="https://nuxt.com/">Nuxt</a> до версии 4  
- chart.js заменен на <a href="https://apexcharts.com/">apexcharts</a>
::
::

---

### 2025-04-07
::badge
**v1.0.1**
::

::card-group
::card{icon="i-lucide-plus" color="primary"}
- Отображение потраченного времени на каждый проект в течение недели на <a href="/" class="text-primary">главной</a>
::
::card{icon="i-lucide-sliders-horizontal" color="info"}
- Глобальные настройки объединены в блок <a href="/settings" class="text-primary">"Основные настройки"</a>
::
::

---

### 2025-01-13
::badge
**v1.0.0**
::

::card-group
::card{icon="i-lucide-plus" color="primary"}
- Отображение количества часов за месяц на странице <a href="/monthly-report" class="text-primary">"Месячный отчет"</a>  
- Отображение распределения по проектам в виде кругового графика на странице <a href="/monthly-report" class="text-primary">"Месячный отчет"</a>  
- Реализован <span class="font-bold text-primary">PWA</span>  
- Настройка <a href="/settings" class="text-primary">"Временная зона"</a> для отображения даты/времени согласно временной зоне пользователя  
- Страница <a href="/changelog" class="text-primary">"Что нового?"</a> и уведомление о выходе новой версии приложения
::
::card{icon="i-lucide-bug" color="warning"}
- Исправлена ошибка с трекингом за прошлые дни, из-за которой трек отображался в <a href="/settings" class="text-primary">"Дневном виджете"</a> на главной странице.
::
::card{icon="i-lucide-refresh-ccw" color="info"}
- Новый UI интерфейс на NuxtUI v2  
- Разбросанные настройки виджетов переехали на страницу <a href="/settings" class="text-primary">"Настройки"</a>
::
::
