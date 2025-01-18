// import axios from 'axios'
// import FormData from 'form-data'
// import fs from 'fs'
// import path from 'path'

// let data = new FormData()
// data.append('purpose', 'general')
// data.append('file', fs.createReadStream('/Healthier/downloads/'))

// export const uploadFile = (accessToken) => {
// 	let config = {
// 		method: 'post',
// 		maxBodyLength: Infinity,
// 		url: 'https://gigachat.devices.sberbank.ru/api/v1/files',
// 		headers: {
// 			'Content-Type': 'multipart/form-data',
// 			Accept: 'application/json',
// 			Authorization: `Bearer ${accessToken}`,
// 			...data.getHeaders(),
// 		},
// 		data,
// 	}

// 	axios(config)
// 		.then(res => console.log(JSON.stringify(res.data)))
// 		.catch(e => console.log(e))
// }

import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const uploadFile = async accessToken => {
	const filePath = path.join(__dirname, '..', 'downloads', 'equu.jpg') // Укажите имя вашего файла

	const data = new FormData()
	data.append('purpose', 'general')
	data.append('file', fs.createReadStream(filePath))

	const config = {
		method: 'post',
		maxBodyLength: Infinity,
		url: 'https://gigachat.devices.sberbank.ru/api/v1/files',
		headers: {
			'Content-Type': 'multipart/form-data',
			Accept: 'application/json',
			Authorization: `Bearer ${accessToken}`,
			...data.getHeaders(),
		},
		data,
	}
	
	let photoId = ''
	await axios(config)
		.then(res => photoId = res.data.id)
		.catch(error => console.log('Error in the uploadFile function: ', error))

	return photoId
}
