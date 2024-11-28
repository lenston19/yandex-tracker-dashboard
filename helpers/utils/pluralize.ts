/**
 * Формы множественного числа русских слов.
 * @param count Количество
 * @param words Список из слов. Пример: ['час', 'часа', 'часов', 'ч.']
 * @return Количество + множественная форма
 */
export const pluralize = (count: number, words: string[]) => {
	let cases = [2, 0, 1, 1, 1, 2]

	let result = count + ' '
	// Если дробное число
	if (count % 1 !== 0) {
		return result + words[words.length - 1]  // Для дробных чисел используем последнюю форму (например, 'ч.')
	}

	// Для целых чисел
	let mod100 = Math.abs(count) % 100
	let mod10 = Math.abs(count) % 10

	return result + words[(mod100 > 4 && mod100 < 20) ? 2 : cases[Math.min(mod10, 5)]]
}
