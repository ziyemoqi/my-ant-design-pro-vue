const reqContext = require.context('./svg', false, /.svg$/)
const requireAll = reqContext => reqContext.keys().map(reqContext)
requireAll(reqContext)
