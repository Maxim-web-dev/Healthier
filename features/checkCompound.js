import { foodAdditives } from '../foodAdditives.js';

export const checkCompound = (ingredients) => {
	const harmfulAdditivesFound = [];
	const regex = new RegExp(foodAdditives.join('|'), 'gi');
	const matches = ingredients.match(regex);

	if (matches) {
		const uniqueMatches = [
			...new Set(matches.map(additive => additive.toLowerCase())),
		];
		harmfulAdditivesFound.push(...uniqueMatches);
	}

	if (harmfulAdditivesFound.length > 0) {
		return `Обнаружены опасные компоненты: 

${harmfulAdditivesFound.join(', ')}. 

💔Данные пищевые добавки опасны для здоровья, рекомендуем выбрать другой продукт, не содержащий их.`;
	} else {
		return `Проверили состав… 
И он безопасен. Продукт не содержит вредных компонентов. 
💚Можно смело кушать.`;
	}
};