export interface DateDuration {
	from: string,
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
