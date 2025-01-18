import TelegramBot from 'node-telegram-bot-api'
import cors from 'cors'
import express from 'express'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import axios from 'axios'

import { getAccessToken } from './requests/getAccessToken.js'
import { textRequest } from './requests/textRequest.js'
import { uploadFile } from './requests/uploadFile.js'
import { photoRequest } from './requests/photoRequest.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const pem = fs
	.readFileSync(path.resolve('./certs/russian_trusted_root_ca.cer'))
	.toString()
process.env.NODE_EXTRA_CA_CERTS = pem
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

// const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const bot = new TelegramBot('7973135089:AAGXRmUpJjnm3dfz5cr8qxqLS6QvW-zeqhU', {
	polling: true,
})

const app = express()
app.use(cors())
app.use(express.json())

// bot.on('message', async msg => {
// 	const chatId = msg.chat.id
// 	const text = msg.text

// 	if (text === '/start') {
// 		await bot.sendMessage(
// 			chatId,
// 			'Healthier - бот, который поможет вам с выбором продуктов. Отправь боту состав или его фото. Бот пришлет ответ, стоит ли употреблять данный продукт'
// 		)
// 	} else {
// 		// const accessToken = await getAccessToken()
// 		// const answer = await textRequest(text, accessToken)
// 		// await bot.sendMessage(chatId, answer)
// 	}
// })

bot.on('photo', async msg => {
	const chatId = msg.chat.id
	const photo = msg.photo
	const photoId = photo[photo.length - 1].file_id

	try {
		const photoUrl = await bot.getFileLink(photoId)
		// const file = await bot.getFile(photoId)
		// const filePath = file.file_path
		// const photoUrl = `https://api.telegram.org/file/bot${bot.token}/${filePath}`
		const response = await axios.get(photoUrl, { responseType: 'arraybuffer' })
		// const fileName = `${chatId}_${Date.now()}.jpg`
		const fileName = `file.jpg`
		const savePath = join(__dirname, 'downloads', fileName)

		fs.writeFileSync(savePath, response.data)
		await bot.sendMessage(chatId, 'Фото успешно сохранено!')

		const accessToken = await getAccessToken()
		const photo = await uploadFile(accessToken)
		const answer = await photoRequest(photo, accessToken)
		await bot.sendMessage(chatId, answer)
	} catch (error) {
		console.error('Ошибка при получении файла:', error)
		await bot.sendMessage(chatId, 'Не удалось получить фото.')
	}
})
