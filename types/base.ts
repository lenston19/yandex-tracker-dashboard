export interface DateDuration {
	from: string
	to: string
}

export interface LineChartData {
	labels: string[]
	datasets: {
		backgroundColor: string
		borderColor: string
		borderWidth: number
		hoverBackgroundColor: string
		hoverBorderColor: string
		data: number[]
	}[]
}

export interface PieChartData {
	labels: string[]
	datasets: {
		backgroundColor: string[]
		data: number[]
	}[]
}

export interface TimeZoneSelectOption {
	id: string
	value: string
}
