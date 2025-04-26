import TelegramBot from 'node-telegram-bot-api'
import cors from 'cors'
import express from 'express'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import axios from 'axios'

import { checkCompound } from './features/checkCompound.js'
import { getTextFromOCR } from './features/getTextFromOCR.js'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const bot = new TelegramBot(process?.env?.BOT_TOKEN, { polling: true })

const app = express()
app.use(cors())
app.use(express.json())

app.listen(3000, () => {
	console.log(`Server running on port 3000`)
})

const messageState = {};

bot.on('message', async msg => {
	const chatId = msg.chat.id
	const text = msg.text
	try {
		if (text === '/start') {
			await bot.sendMessage(
				chatId,
				`*Healthier* - бот, который поможет вам с выбором продуктов. Отправь боту состав или его фото. Бот пришлет ответ, стоит ли употреблять данный продукт.

_Перед началом использования рекомендуем узнать важную информацию /important_`,
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
		} else if (text === '/important') {
			await bot.sendMessage(chatId, `_Информация для пользователя_
				
*Канцерогены* - вещества, вызывающие онкологические заболевания.
*Мутагены* - вещества, негативно влияющие на ДНК. Могут вызывать онкологические заболевания и наследственные изменения у потомства. 

Мы *крайне не рекомендуем* вам употреблять продукты с содержанием какой-либо *вредной* добавки. *Питаться правильно* - это совсем *не трудно*. *Берегите свое здоровье*💚

_Все данные проверены и взяты с сайта Роспотребнадзора и Всемирной Организации Здравоохранения.

По вопросам: @healthierBOSS_`, { reply_markup: { remove_keyboard: true }, parse_mode: 'Markdown' })
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
									web_app: { url: 'https://logo-h.vercel.app/' },
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

// bot.on('photo', async msg => {
// 	const chatId = msg.chat.id
// 	const photo = msg.photo
// 	const photoId = photo[photo.length - 1].file_id
// 	try {
// 		// Сохранение файла
// 		const photoUrl = await bot.getFileLink(photoId)
// 		const response = await axios.get(photoUrl, { responseType: 'arraybuffer' })
// 		const fileName =
// 			Math.random().toString(36).substr(2, 9) + Date.now().toString(36) + '.jpg'
// 		const savePath = join(__dirname, 'downloads', fileName)
// 		fs.writeFileSync(savePath, response.data)

// 		// Распознавание вредных веществ
// 		const text = await getTextFromOCR(fileName)
// 		const result = checkCompound(text)

// 		// Получение резюмированного ответа от GigaChat
// 		// const accessToken = await getAccessToken()
// 		// const finalAnswer = await textRequest(result, accessToken)
// 		// const photo = await uploadFile(accessToken)
// 		// const answer = await photoRequest(photo, accessToken)

// 		// console.log(answer);

// 		await bot.sendMessage(chatId, result, {
// 			parse_mode: 'Markdown',
// 			reply_markup: { remove_keyboard: true, inline_keyboard:  [[{text: 'Расширенный ответ', callback_data: 'smallAnswer' }]]},
// 		}).then((sentMessage) => {
// 			// Сохраняем исходное сообщение в состоянии
// 			messageState[sentMessage.message_id] = {
// 					originalText: result,
// 					chatId: chatId
// 			};
// 	});

// 		// for statistics and moderation
// 		await bot.sendPhoto(7751715825, savePath, { caption: `${result}  


// name: ${msg?.chat?.first_name}
// username: @${msg?.chat?.username}
// id: ${msg?.chat?.id}
// `, parse_mode: 'Markdown' })
// 	} catch (error) {
// 		console.error('Ошибка при получении файла:', error)
// 		await bot.sendMessage(chatId, 'Не удалось получить фото.')
// 	}
// }) 
// выдал дипсик:
bot.on('photo', async msg => {
	const chatId = msg.chat.id;
	const photo = msg.photo;
	const photoId = photo[photo.length - 1].file_id;
	try {
			// Сохранение файла
			const photoUrl = await bot.getFileLink(photoId);
			const response = await axios.get(photoUrl, { responseType: 'arraybuffer' });
			const fileName = Math.random().toString(36).substring(2, 11) + Date.now().toString(36) + '.jpg';
			const savePath = join(__dirname, 'downloads', fileName);
			fs.writeFileSync(savePath, response.data);

			// Распознавание вредных веществ
			const text = await getTextFromOCR(fileName);
			const result = checkCompound(text);

			// Генерируем уникальный ID для этого запроса
			const queryId = Date.now().toString(36);

			// Сохраняем данные в глобальный объект
			messageState[queryId] = {
					originalText: result.shortAnswer,
					detailedText: result.detailedAnswer,
					additives: result.additives,
					chatId: chatId
			};

			await bot.sendMessage(chatId, result.shortAnswer, {
					parse_mode: 'Markdown',
					reply_markup: { 
							inline_keyboard: [[
									{ text: 'Расширенный ответ', callback_data: `detail_${queryId}` }
							]] 
					},
			});

			// Отправка модератору
			await bot.sendPhoto(7751715825, savePath, { 
					caption: `${result.shortAnswer}\n\nname: ${msg?.chat?.first_name}\nusername: @${msg?.chat?.username}\nid: ${msg?.chat?.id}`,
					// parse_mode: 'Markdown' 
			});
	} catch (error) {
			console.error('Ошибка при обработке фото:', error);
			await bot.sendMessage(chatId, 'Произошла ошибка при обработке фото. Пожалуйста, попробуйте ещё раз.');
	}
});



// Обработчик нажатия на inline кнопку
// bot.on('callback_query', (callbackQuery) => {
// 	const messageId = callbackQuery.message.message_id;
// 	const chatId = callbackQuery.message.chat.id;
// 	const data = callbackQuery.data;

// 	if (data === 'smallAnswer') {
// 			// Изменяем текст сообщения
// 			const newText = 'Здесь будет расширенный ответ';
// 			const opts = {
// 					reply_markup: {
// 							inline_keyboard: [
// 									[{ text: 'Краткий ответ', callback_data: 'bigAnswer' }]
// 							]
// 					}
// 			};

// 			bot.editMessageText(newText, {
// 					chat_id: chatId,
// 					message_id: messageId,
// 					reply_markup: opts.reply_markup,
// 					parse_mode: 'Markdown'
// 			});

// 			// Сохраняем измененный текст в состоянии
// 			messageState[messageId].changedText = newText;
// 	} else if (data === 'bigAnswer') {
// 			// Возвращаем исходный текст сообщения
// 			const originalText = messageState[messageId].originalText;
// 			const opts = {
// 					reply_markup: {
// 							inline_keyboard: [
// 									[{ text: 'Расширенный ответ', callback_data: 'smallAnswer' }]
// 							]
// 					}
// 			};

// 			bot.editMessageText(originalText, {
// 					chat_id: chatId,
// 					message_id: messageId,
// 					reply_markup: opts.reply_markup,
// 					parse_mode: 'Markdown'
// 			},);

// 			// Удаляем измененный текст из состояния
// 			delete messageState[messageId].changedText;
// 	}

// 	// Подтверждаем обработку callback_query
// 	bot.answerCallbackQuery(callbackQuery.id);
// });



// DO: РАЗБИТЬ ВСЕ ПО ФАЙЛАМ, ТУТ АНАРХИЯ

// дипсик:
bot.on('callback_query', async (callbackQuery) => {
	const message = callbackQuery.message;
	const messageId = message.message_id;
	const chatId = message.chat.id;
	const data = callbackQuery.data;

	try {
			if (data.startsWith('detail_')) {
					const queryId = data.split('_')[1];
					const state = messageState[queryId];
					
					if (state) {
							await bot.editMessageText(state.detailedText, {
									chat_id: chatId,
									message_id: messageId,
									reply_markup: {
											inline_keyboard: [[
													{ text: 'Краткий ответ', callback_data: `short_${queryId}` }
											]]
									},
									parse_mode: 'Markdown'
							});
					}
			} else if (data.startsWith('short_')) {
					const queryId = data.split('_')[1];
					const state = messageState[queryId];
					
					if (state) {
							await bot.editMessageText(state.originalText, {
									chat_id: chatId,
									message_id: messageId,
									reply_markup: {
											inline_keyboard: [[
													{ text: 'Расширенный ответ', callback_data: `detail_${queryId}` }
											]]
									},
									parse_mode: 'Markdown'
							});
					}
			}

			await bot.answerCallbackQuery(callbackQuery.id);
	} catch (error) {
			console.error('Ошибка в callback_query:', error);
			await bot.answerCallbackQuery(callbackQuery.id, { text: 'Произошла ошибка. Попробуйте ещё раз.' });
	}
});