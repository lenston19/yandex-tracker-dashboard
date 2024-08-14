// @ts-ignore
export default defineNuxtConfig({
	compatibilityDate: '2024-08-09',
  typescript: {
		tsConfig: {
			compilerOptions: {
				verbatimModuleSyntax: false
			}
		}
	},
	vite: {
		optimizeDeps: {
			entries: ['~/components/**/*.vue']
		},
		define: {
			'process.env.DEBUG': false
		}
	},
	components: [
		{
			path: '~/components',
			pathPrefix: false
		}
	],
	runtimeConfig: {
		public: {
			yandexClientId: process.env.YANDEX_CLIENT_ID || '',
		}
	},
	devtools: {
		enabled: true
	},
	modules: [
		'@pinia/nuxt',
		'@pinia-plugin-persistedstate/nuxt',
		'@nuxt-alt/proxy',
		'@nuxt/ui',
	],
	colorMode: {
		preference: 'dark'
	},
	proxy: {
		proxies: {
			'^/yandex/.*': {
				target: process.env.YANDEX_API ?? 'https://api.tracker.yandex.net/v2',
				rewrite: (path: string) => path.replace(/^\/yandex/, '')
			}
		}
	},
	ui: {
		global: true
	},
	pinia: {
		autoImports: [
			['defineStore', 'definePiniaStore']
		]
	}
})
