const NS_IN_MILLISECOND = 1000 * 1000
const NS_IN_SECOND = NS_IN_MILLISECOND * 1000
const NS_IN_MINUTE = NS_IN_SECOND * 60
const NS_IN_HOUR = NS_IN_MINUTE * 60

export function nsToHumanTime(ns: number) {
	let timeStr = ''

	const hours = Math.floor(ns / NS_IN_HOUR)
	if (hours >= 1) {
		timeStr += hours + 'h '
		ns = ns % NS_IN_HOUR
	}

	const minutes = Math.floor(ns / NS_IN_MINUTE)
	if (minutes >= 1) {
		timeStr += minutes + 'm '
		ns = ns % NS_IN_MINUTE
	}

	const seconds = Math.floor(ns / NS_IN_SECOND)
	if (seconds >= 1) {
		timeStr += seconds + 's '
		ns = ns % NS_IN_SECOND
	}

	if (seconds === 0 && minutes === 0 && hours === 0) {
		const milliseconds = Math.floor(ns / NS_IN_MILLISECOND)
		if (milliseconds >= 1) {
			timeStr += milliseconds + 'ms '
		}
	}

	if (timeStr.length === 0) {
		timeStr = '<1ms'
	}

	return timeStr
}
