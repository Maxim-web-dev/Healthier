import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

export const encodeUmage = (fileName) => {
	const __filename = fileURLToPath(import.meta.url)
	const __dirname = dirname(__filename)
	const filePath = path.join(__dirname, '..', 'downloads', fileName)
	const file = fs.readFileSync(filePath)
	return Buffer.from(file).toString('base64')
}
