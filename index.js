import axios from 'axios'
import fs from 'fs'
import path from 'path'

const pem = fs
	.readFileSync(path.resolve('./certs/russian_trusted_root_ca.cer'))
	.toString()
process.env.NODE_EXTRA_CA_CERTS = pem
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

const getAccessToken = () => {
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

	axios(config)
		.then(res => console.log(res.data))
		.catch(e => console.log(e))
}

const request = () => {
	const data = JSON.stringify({
		"model": "GigaChat",
		"messages": [
			{
				"role": "system",
				"content": "Ты — эксперт в области питания и диетологии. Твоя задача — анализировать фотографии или описания продуктов."
			},
			{
				"role": "user",
				"content": "Пожалуйста, проанализируй следующий состав продукта на наличие вредных ингредиентов. Сообщи, есть ли в нем что-то опасное для здоровья. Ко всем ингредиентам придерайся сильно! Ответ дай краткий. В ответе сначала укажи название данного продукта. В самом конце напиши вывод, стоит ли употреблять данный продукт с добавлением смайлика 💚, если продукт хороший или смайлика 💔, если продукт плохой"
			}
		],
		"stream": false,
		"update_interval": 0
	});

	const config = {
		method: 'post',
		maxBodyLength: Infinity,
		url: 'https://gigachat.devices.sberbank.ru/api/v1/chat/completions',
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'application/json',
			'Authorization': `Bearer eyJjdHkiOiJqd3QiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwiYWxnIjoiUlNBLU9BRVAtMjU2In0.N1fqHYXrBlYi-Z9SeAHonPpah3vWGuizQo6JBC-xfOI6nRv79FCVgdHjyCQ58-DMmsCQ1QgE-_GfbcRDfCy96KDV3vHxtR4IO439Mhs1L7DqhvhKG3ETrAKcyTywWcdVw8EDcW5gZqCLTW57Q4Yr3AGEKm-rGs0shs9cGZwZ6e5gJWM6b3vJ8XR35bI552IwW80YWvPqReZ_AQ7ToRRseAGWRuw7uEoL7ncaZQLzW59qPU23ohlsdyveh3XSVFpiMpGmU-m5iBAebJmOYbNCwXKvTcyHNm25be4f_Ma1C223FCPD6bZupNRiXTbat2Zj_jWvCfZJ2F-Ad_ap_vwJDw.5OIMciA0BLaJ7hffYnf3oA.s7UwvnnIPN6z_Vc5csSwOyrFdvKDI58eevvjmFQHja5upAnnt8GoFdVhUh2BUANo86GLl-KsV6Le47w9uHHARX19gyeyIYQl20Hazig9NGOcZPuCLOcb_6oDUyv2AsjctJHpmb8mZlHEMnZPrX-ul84L-6R29_DvVAdvW5uw9B9-zb_EBwL4tfV2-37Tq_toE006tdHntBd4_S2t7C8_9iYod_8Y2X0dSgfZ1Xit3Ki7OARBRIKyrVj7sjjlXOLuUYtxX9j4G_BcLsyyArgpLelMCnPOKaW6SzTNKgpH47UtqbddydIhQxFxt_DstEqBgzOHvOwZwibAwJuIIu1YAv8zxiLJSW_w8eajEd_ktQSSHvsvcQhe9pYHyxqCVmtnkzgbAawBzpKyZGcCuNwwzZ91oFQiyu_HlkYOYGjUhcjL6jG1rLznyV2S69EYDc9uglh5yPuOw5J9rjuTrmmptXTQAniZKvPQAWaAzt1QTSUzYQmbII0VIR4C63O5JBOlq3sbvOSXX8WGqzITbbJ2q-LQm0oZnQT4bFIYJAHLK2HHPPAksaeA3xsfIjajKJicOauKvwO0ezBS78qTy6nzLH9gKPxhPMyAKYPMLhlqZSHPjUEECvAe1j63l31cNJtgyuPpR8rQWTKGQjzQ48NlEhL7ahcqhxynUAP5Si2YXTBfVeAFaD8kboXnmZ_gIq07VuX6zkzsxHggDHevEyggrZXsDQACUfPofE4IyeCcJY8.dX_JHEehKmNLPUw3FkBiJpY0QBCXOBw_5OsFTpNi4hQ`,
		},
		data
	}

	axios(config)
		.then(res => console.log(JSON.stringify(res.data)))
		.catch(e => console.log(e))
}

// getAccessToken()
// request()

