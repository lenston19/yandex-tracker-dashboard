// @ts-ignore
export default defineNuxtConfig({
	compatibilityDate: '2024-08-09',
	app: {
		head: {
			htmlAttrs: {
				lang: 'ru'
			},
			meta: [
				{ charset: 'utf-8' },
				{
					name: 'viewport',
					content: 'width=device-width, initial-scale=1.0, minimum-scale=1.0'
				},
				{
					name: 'format-detection',
					content: 'telephone=no, date=no, address=no, email=no'
				}
			],
			link: [
				{ rel: 'icon', href: '/favicon.ico' },
				{ rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
				{ rel: 'manifest', href: '/site.webmanifest' }
			],
		}
	},
	typescript: {
		tsConfig: {
			compilerOptions: {
				verbatimModuleSyntax: false
			}
		}
	},
	vite: {
		build: {
			rollupOptions: {
				output: {
					chunkFileNames: 'chunks/[name]-[hash].js',
					entryFileNames: 'entries/[name]-[hash].js',
					assetFileNames: 'assets/[name]-[hash][extname]',
				},
			},
		},
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
			'^/tracker/.*': {
				target: process.env.YANDEX_API ?? 'https://api.tracker.yandex.net/v2',
				rewrite: (path: string) => path.replace(/^\/tracker/, '')
			},
			'^/info/.*': {
				target: 'https://login.yandex.ru/info',
				rewrite: (path: string) => path.replace(/^\/info/, '')
			},
			'^/avatar/.*': {
				target: 'https://avatars.yandex.net/get-yapic',
				rewrite: (path: string) => path.replace(/^\/avatar/, '')
			},
		}
	},
	ui: {
		global: true
	},
	icon: {
		provider: 'iconify'
	},
	piniaPersistedstate: {
		cookieOptions: {
			maxAge: 60 * 60 * 24 * 30 * 12
		}
	}
})
