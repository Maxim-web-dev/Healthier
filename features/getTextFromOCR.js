import axios from 'axios'
import { getIAMToken } from './getIAMToken.js'
import { encodeUmage } from './encodeImage.js'

export const getTextFromOCR = async (fileName) => {
	const oauthToken = process?.env?.OAUTH_TOKEN_OCR
	const IAM_TOKEN = await getIAMToken(oauthToken)
	const FOLDER_ID = process?.env?.FOLDER_ID
	const MIME_TYPE = 'png'
	const CONTENT = encodeUmage(fileName)

	const data = {
		mimeType: MIME_TYPE,
		languageCodes: ['*'],
		content: CONTENT,
	}

	const url = 'https://ocr.api.cloud.yandex.net/ocr/v1/recognizeText'

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${IAM_TOKEN}`,
		'x-folder-id': FOLDER_ID,
		'x-data-logging-enabled': 'true',
	}

	let text = ''
	await axios
		.post(url, data, { headers: headers })
		.then(response => {
			console.log(response.data.result.textAnnotation.fullText)
			text = response.data.result.textAnnotation.fullText
		})
		.catch(error => {
			console.error(error)
		})
	return text
}
