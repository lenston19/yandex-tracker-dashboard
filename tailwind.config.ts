// @ts-ignore
import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
	theme: {
		extend: {
			typography: (theme: any) => ({
				DEFAULT: {
					css: {
						color: theme('colors.primary.800'),
						'a.text-primary': {
							color: theme('colors.green.600'),
							'&:hover': {
								color: theme('colors.green.400')
							}
						},
						'span.text-primary': {
							color: theme('colors.green.600')
						}
					}
				}
			})
		}
	},
	content: ['components/**/*.vue', 'layouts/**/*.vue', 'pages/**/*.vue'],
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require('@tailwindcss/typography')]
}
