// Pre-answers all payload migration prompts non-interactively.
// 'prompts' isn't a direct dependency of this project (it's payload's), so
// resolve it via pnpm's hoisted node_modules/.pnpm/node_modules instead of a
// plain require('prompts'), which fails under pnpm's isolated layout.
const path = require('path')
const hoistedNodeModules = path.join(process.cwd(), 'node_modules', '.pnpm', 'node_modules')
const prompts = require(require.resolve('prompts', { paths: [hoistedNodeModules] }))
prompts.override({ confirm: true })
// Inject queue: 0 = select first option (create table) for any select prompts
prompts.inject([0, 0, 0, 0, 0])
