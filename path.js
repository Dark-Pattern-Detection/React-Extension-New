const fullPath = await import.meta.resolve('axios')
const path = fullPath?.match(/(\/node_modules.*)/)[0]
console.log(path)
