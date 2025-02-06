import axios from 'axios'

export const getIAMToken = async oauthToken => {
	let token = ''
	await axios
		.post('https://iam.api.cloud.yandex.net/iam/v1/tokens', {
			yandexPassportOauthToken: oauthToken,
		})
		.then(response => {
			token = response.data.iamToken
		})
		.catch(error => {
			console.error(error.response ? error.response.data : error.message)
		})
	return token
}
