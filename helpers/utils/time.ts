import { Duration } from 'luxon';
import { Yandex } from '~/types/yandex';

export const calculateHours = (items: Yandex.Worklog[]) => {
	return items.reduce((acc, item) => {
		const time = Duration.fromISO(item.duration);
		if (time.days) {
			acc += time.days * 8;
		}
		if (!!time.hours) {
			acc += time.hours;
		}
		if (!!time.minutes) {
			acc += time.minutes / 60;
		}
		if (!!time.seconds) {
			acc += time.seconds / 60 / 60;
		}
		return acc;
	}, 0);
};

export const calculateTimeByPeriod = (hours: number) => {
	return +hours.toFixed(2);
};

export const calculateTimeByPeriodLikeDay = (hours: number) => {
	return Duration.fromObject({ hours: hours }).toFormat('hh:mm:ss');
};

export const calculateTimeByDay = (item: Yandex.Worklog) => {
	let accumulator = 0;
	const time = Duration.fromISO(item.duration);
	if (time.days) {
		accumulator += time.days * 8;
	}
	if (!!time.hours) {
		accumulator += time.hours;
	}
	if (!!time.minutes) {
		accumulator += time.minutes / 60;
	}
	if (!!time.seconds) {
		accumulator += time.seconds / 60 / 60;
	}
	return Duration.fromObject({ hours: accumulator }).toFormat('hh:mm:ss');
};
