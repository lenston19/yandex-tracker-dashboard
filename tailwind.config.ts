import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  theme: {},
  content: ['components/**/*.vue', 'layouts/**/*.vue', 'pages/**/*.vue']
}
