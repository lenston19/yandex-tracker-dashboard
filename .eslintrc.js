module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	extends: [
		'@nuxtjs/eslint-config-typescript',
		'plugin:nuxt/recommended'
	],
	plugins: [],
	// add your custom rules here
	rules: {
		indent: ['error', 'tab', {
			SwitchCase: 1
		}],
		'vue/html-indent': ['error', 'tab'],
		'vue/no-multiple-template-root': 0,
		'no-tabs': 0,
		'import/no-mutable-exports': 0,
		camelcase: 0,
		'import/named': 0
	}
}
