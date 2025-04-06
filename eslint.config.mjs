import unusedImports from 'eslint-plugin-unused-imports'
import withNuxt from './.nuxt/eslint.config.mjs'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import prettierPlugin from 'eslint-plugin-prettier'
import eslintConfigPrettier from 'eslint-config-prettier'

export default withNuxt([
	{
		files: ['**/*.ts', '**/*.vue'],
		plugins: {
			'unused-imports': unusedImports,
			prettier: prettierPlugin
		},
		rules: {
			...eslintConfigPrettier.rules,
			'vue/multi-word-component-names': 0,
			'vue/require-default-prop': 0,
			'vue/no-v-html': 0,
			'vue/no-multiple-template-root': 0,
			'unused-imports/no-unused-imports': 1,
			'@stylistic/arrow-parens': 0,
			'@typescript-eslint/ban-ts-comment': 0,
			'no-multi-spaces': 2,
			'no-console': [1, { allow: ['warn', 'error', 'info'] }],
			'no-control-regex': 0,
			'@typescript-eslint/no-explicit-any': [0, { ignoreRestArgs: true }],
			'@typescript-eslint/no-namespace': 0,
			'@typescript-eslint/no-empty-object-type': [2, { allowInterfaces: 'with-single-extends' }],
			'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
			'vue/component-name-in-template-casing': [
				'error',
				'PascalCase',
				{
					registeredComponentsOnly: true,
					ignores: []
				}
			]
		}
	},
	eslintPluginPrettierRecommended
])
