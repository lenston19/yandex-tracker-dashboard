module.exports = {
	extends: [
		'stylelint-config-standard-scss'
	],
	customSyntax: 'postcss-styled-syntax',
	// add your custom config here
	// https://stylelint.io/user-guide/configuration
	rules: {
		'at-rule-empty-line-before': null,
		'at-rule-no-unknown': null,
		'block-no-empty': null,
		'declaration-empty-line-before': null,
		'no-descending-specificity': null,
		'rule-empty-line-before': null,
		'selector-pseudo-element-colon-notation': null,
		'selector-pseudo-element-no-unknown': [
			true,
			{
				ignorePseudoElements: ['v-deep']
			}
		]
	}
}
