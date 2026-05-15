// Pre-answers the "dev mode" confirmation prompt in payload migrate non-interactively
const prompts = require('prompts')
prompts.override({ confirm: true })
