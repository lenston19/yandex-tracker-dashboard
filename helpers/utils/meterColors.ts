const meterColors = ['teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink']

export function pickMeterColors(count: number): string[] {
	const step = Math.floor(meterColors.length / count)
	const result: string[] = []

	for (let i = 0; i < count; i++) {
		const index = (i * step) % meterColors.length
		result.push(meterColors[index])
	}

	return result
}
