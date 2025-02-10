import TelegramBot from 'node-telegram-bot-api'
import cors from 'cors'
import express from 'express'
// import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import axios from 'axios'

// import { getAccessToken } from './requests/getAccessToken.js'
// import { textRequest } from './requests/textRequest.js'
import { checkCompound } from './features/checkCompound.js'
import { getTextFromOCR } from './features/getTextFromOCR.js'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// const pem = fs
// 	.readFileSync(path.resolve('./certs/russian_trusted_root_ca.cer'))
// 	.toString()
// process.env.NODE_EXTRA_CA_CERTS = pem
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const bot = new TelegramBot(process?.env?.BOT_TOKEN, { polling: true })

const app = express()
app.use(cors())
app.use(express.json())

app.listen(3000, () => {
	console.log(`Server running on port 3000`)
})

bot.on('message', async msg => {
	const chatId = msg.chat.id
	const text = msg.text
	try {
		if (text === '/start') {
			await bot.sendMessage(
				chatId,
				'*Healthier* - бот, который поможет вам с выбором продуктов. Отправь боту состав или его фото. Бот пришлет ответ, стоит ли употреблять данный продукт',
				{
					reply_markup: { remove_keyboard: true },
					parse_mode: 'Markdown',
				}
			)
		} else if (text === '/info') {
			await bot.sendMessage(
				chatId,
				`🤨*Хочешь узнать, вреден ли продукт?* - Отправь фото его состава.
				
🧐*Хочешь узнать про конктреную добавку?* - Просто отправь свой вопрос.

😎*Хочешь более 5 вопросов в день и расширенные ответы?* - /premium`,
				{ reply_markup: { remove_keyboard: true }, parse_mode: 'Markdown' }
			)
		} else if (text === '/premium') {
			await bot.sendMessage(chatId, 'Здесь в будущем будет premium Healthier.')
		} else if (text === '/home') {
			await bot.sendMessage(
				chatId,
				`*Хотите добавить Healthier на рабочий стол?*

*1.* Нажмите кнопку ниже
*2.* В открывшемся окне нажмите на 3 точки в правом верхнем углу
*3.* Нажмите 'Добавить на экран домой'`,
				{
					reply_markup: {
						keyboard: [
							[
								{
									text: 'Добавить домой',
									web_app: { url: 'https://atex-test.vercel.app/' },
								},
							],
						],
						resize_keyboard: true,
					},
					parse_mode: 'Markdown',
				}
			)

			// // Ожидаем следующего сообщения от пользователя
			// bot.once('message', nextMsg => {
			// 	if (nextMsg.chat.id === chatId) {
			// 		// Удаляем клавиатуру
			// 		bot.sendMessage(chatId, 'Клавиатура удалена.', {
			// 			reply_markup: {
			// 				remove_keyboard: true,
			// 			},
			// 		})
			// 	}
			// })
		}
	} catch (error) {
		console.log(error)
	}
})

bot.on('photo', async msg => {
	const chatId = msg.chat.id
	const photo = msg.photo
	const photoId = photo[photo.length - 1].file_id
	try {
		// Сохранение файла
		const photoUrl = await bot.getFileLink(photoId)
		const response = await axios.get(photoUrl, { responseType: 'arraybuffer' })
		const fileName =
			Math.random().toString(36).substr(2, 9) + Date.now().toString(36) + '.jpg'
		const savePath = join(__dirname, 'downloads', fileName)
		fs.writeFileSync(savePath, response.data)

		// Распознавание вредных веществ
		const text = await getTextFromOCR(fileName)
		const result = checkCompound(text)

		// Получение резюмированного ответа от GigaChat
		// const accessToken = await getAccessToken()
		// const finalAnswer = await textRequest(result, accessToken)
		// const photo = await uploadFile(accessToken)
		// const answer = await photoRequest(photo, accessToken)

		// console.log(answer);

		await bot.sendMessage(chatId, result, {
			parse_mode: 'Markdown',
			reply_markup: { remove_keyboard: true },
		})
	} catch (error) {
		console.error('Ошибка при получении файла:', error)
		await bot.sendMessage(chatId, 'Не удалось получить фото.')
	}
})
