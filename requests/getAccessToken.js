import axios from 'axios'

// УБРАТЬ АВТОРИЗАЦИЯ ТОКЕН

export const getAccessToken = async () => {
	let token = ''

	const config = {
		method: 'post',
		maxBodyLength: Infinity,
		url: 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json',
			RqUID: 'feb2eedd-eb5c-4d62-9637-250f973d4176',
			Authorization:
				'Basic NjM1ZDQ4MGUtZDMwYS00Mzc2LThjNzYtOTQyZTkzZDgyYmYxOjMyNGZmMTA0LTc2ZTMtNGY3Zi05YmM4LTg5ZGQxNWRmNTgxNA==',
		},
		data: 'scope=GIGACHAT_API_PERS',
	}

	await axios(config)
		.then(res => token = res.data.access_token)
		.catch(error => console.log('Error in the getAccessToken function: ', error))
	return token
}