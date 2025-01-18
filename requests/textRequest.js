import axios from 'axios'

export const textRequest = async (prompt, accessToken) => {
	let answer = ''
	const data = JSON.stringify({
		model: 'GigaChat',
		messages: [
			{
				role: 'system',
				content:
					'Ты — эксперт в области питания и диетологии. Твоя задача — анализировать фотографии или описания продуктов.',
			},
			{
				role: 'user',
				content: `Пожалуйста, проанализируй следующий состав продукта на наличие вредных ингредиентов.

Сообщи, есть ли в нем что-то опасное для здоровья. Ко всем ингредиентам придерайся сильно! Не придерайся сильно только к сахару и подсолнечному маслу. Ответ дай краткий. В ответе сначала укажи название данного продукта. В самом конце напиши вывод, стоит ли употреблять данный продукт с добавлением смайлика 💚, если продукт хороший или смайлика 💔, если продукт плохой. ${prompt}`,
			},
		],
		stream: false,
		update_interval: 0,
	})

	const config = {
		method: 'post',
		maxBodyLength: Infinity,
		url: 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			Authorization: `Bearer ${accessToken}`,
		},
		data,
	}

	await axios(config)
		.then(res => (answer = res.data.choices[0].message.content))
		.catch(error => console.log('Error in the textRequest function: ', error))
	return answer
}
