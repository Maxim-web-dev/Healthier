import axios from 'axios'

export const textRequest = async (prompt, accessToken) => {
	let answer = ''
	const data = JSON.stringify({
		model: 'GigaChat-Max',
		messages: [
			{
				role: 'user',
				content: `Я обнаружил данные пищевые добавки в продукте. Расскажи, почему они так вредны? ${prompt}`,
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
