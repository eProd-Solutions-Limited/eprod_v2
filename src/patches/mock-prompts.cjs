// Pre-answers all payload migration prompts non-interactively
const prompts = require('prompts')
prompts.override({ confirm: true })
// Inject queue: 0 = select first option (create table) for any select prompts
prompts.inject([0, 0, 0, 0, 0])
