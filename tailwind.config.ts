/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */

// @ts-ignore
import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
	theme: {
		extend: {
			typography: (theme: any) => ({
				DEFAULT: {
					css: {
						color: theme('colors.primary.800')
					}
				}
			})
		}
	},
	content: ['components/**/*.vue', 'layouts/**/*.vue', 'pages/**/*.vue'],
	plugins: [require('@tailwindcss/typography')]
}
