import { Duration } from 'luxon'
import type { Yandex } from '~/types/yandex-tracker/yandex-tracker.entity'

const calculateDurationInHours = (duration: string): number => {
	const time = Duration.fromISO(duration)
	let totalHours = 0

	if (time.weeks) {
		totalHours += time.weeks * 40
	}
	if (time.days) {
		totalHours += time.days * 8
	}
	if (time.hours) {
		totalHours += time.hours
	}
	if (time.minutes) {
		totalHours += time.minutes / 60
	}
	if (time.seconds) {
		totalHours += time.seconds / 3600
	}

	return totalHours
}

export const calculateTotalHours = (worklogs: Yandex.Worklog[]): number => {
	return worklogs.reduce((total, worklog) => total + calculateDurationInHours(worklog.duration), 0)
}

export const formatHoursToFixed = (hours: number): number => {
	return +hours.toFixed(2)
}

export const formatHoursToHHMMSS = (hours: number): string => {
	return Duration.fromObject({ hours }).toFormat('hh:mm:ss')
}

export const calculateWorklogTimeByDay = (worklog: Yandex.Worklog): string => {
	return formatHoursToHHMMSS(calculateDurationInHours(worklog.duration))
}
