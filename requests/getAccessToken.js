import axios from 'axios'

export const getAccessToken = async () => {
	let token = ''

	const config = {
		method: 'post',
		maxBodyLength: Infinity,
		url: 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Accept: 'application/json',
			RqUID: 'd5c6dc02-d79c-4b61-a748-455fba1872aa',
			Authorization:
				`Basic ${process?.env?.AUTH_TOKEN_GIGACHAT}`,
		},
		data: 'scope=GIGACHAT_API_PERS',
	}

	await axios(config)
		.then(res => token = res.data.access_token)
		.catch(error => console.log('Error in the getAccessToken function: ', error))
	return token
}