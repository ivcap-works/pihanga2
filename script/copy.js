const fs = require('fs-extra')
const glob = require('globby')

function toDest(file) {
  return file.replace(/^src\//, 'lib/')
}

glob.sync('src/**/!(*.ts|*.tsx|tsconfig.json)').forEach((file) => {
  //console.log(">>>", file, toDest(file))
  fs.copy(file, toDest(file))
})
