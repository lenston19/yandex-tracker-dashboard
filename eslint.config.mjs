import withNuxt from './.nuxt/eslint.config.mjs'
import unusedImports from 'eslint-plugin-unused-imports'
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss'
import pluginPrettier from 'eslint-plugin-prettier'
import configPrettier from 'eslint-config-prettier'

export default withNuxt(
  {
    plugins: {
      'unused-imports': unusedImports,
      'better-tailwindcss': eslintPluginBetterTailwindcss,
      prettier: pluginPrettier
    },
    rules: {
      'prettier/prettier': 'error',
      // enable all recommended rules to report a warning
      ...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
      // enable all recommended rules to report an error
      ...eslintPluginBetterTailwindcss.configs['recommended-error'].rules,

      indent: ['error', 4, { SwitchCase: 1 }],
      'vue/html-indent': ['error', 4],
      'vue/no-multiple-template-root': 0,
      'no-tabs': 0,
      'import/no-mutable-exports': 0,
      camelcase: 0,
      'import/named': 0,
      'no-return-assign': 'off',
      'no-console': 'off',
      'import/no-named-as-default': 'off',
      'func-call-spacing': 'off',
      'vue/valid-v-for': 'off',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/unified-signatures': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-explicit-any': 'off',

      'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],

      'vue/require-default-prop': 'off',
      'vue/no-v-html': 'off',

      'unused-imports/no-unused-imports': 'error',
      // '@stylistic/arrow-parens': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'vue/component-name-in-template-casing': [
        'error',
        'kebab-case',
        {
          registeredComponentsOnly: false
        }
      ],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'any',
            normal: 'any',
            component: 'always'
          },
          svg: 'always',
          math: 'always'
        }
      ],

      'better-tailwindcss/enforce-consistent-line-wrapping': 'off',
      'better-tailwindcss/no-unregistered-classes': 'off'
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: './app/assets/styles/main.css'
      }
    }
  },
  configPrettier
)
