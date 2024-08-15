/**
 * Формы множественного числа русских слов.
 * @param count Количество
 * @param words Список из слов. Пример: ['час', 'часа', 'часов']
 * @return Количество + множественная форма
 */
export const pluralize = (count: number, words: string[]) => {
	var cases = [2, 0, 1, 1, 1, 2]
	return count + ' ' + words[(count % 100 > 4 && count % 100 < 20) ? 2 : cases[Math.min(count % 10, 5)]]
}
