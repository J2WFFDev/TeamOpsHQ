const fs = require('fs')
const path = require('path')
const pdf = require('pdf-parse')

const input = path.join(__dirname, '..', 'docs', 'prd', 'TeamOpsHQ PRD - Mobile-First Implementation Strategy.pdf')
const output = path.join(__dirname, '..', 'docs', 'prd', 'TeamOpsHQ_PRD_text.txt')

if (!fs.existsSync(input)) {
  console.error('PDF not found at', input)
  process.exit(2)
}

const data = fs.readFileSync(input)

pdf(data).then(function (data) {
  // data.text holds the text
  fs.writeFileSync(output, data.text, 'utf8')
  console.log('Extracted text written to', output)
}).catch(function (err) {
  console.error('Failed to parse PDF:', err)
  process.exit(1)
})
