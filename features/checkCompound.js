// import { foodAdditives } from '../foodAdditives.js';

// // DO: это дефолт ответ, нудно сделать расширенный

// export const checkCompound = (ingredients) => {
// 	const harmfulAdditivesFound = [];
// 	const regex = new RegExp(foodAdditives.join('|'), 'gi');
// 	const matches = ingredients.match(regex);

// 	if (matches) {
// 		const uniqueMatches = [
// 			...new Set(matches.map(additive => additive.toLowerCase())),
// 		];
// 		harmfulAdditivesFound.push(...uniqueMatches);
// 	}

// 	if (harmfulAdditivesFound.length > 0) {
// 		return `Обнаружены *опасные* компоненты: 

// *${harmfulAdditivesFound.join(', ')}.*

// 💔Данные пищевые добавки *опасны для здоровья*, рекомендуем выбрать *другой продукт*, не содержащий их.`;
// 	} else {
// 		return `Проверили состав… 
// И он *безопасен*. Продукт не содержит вредных компонентов. 
// 💚*Можно* смело кушать.`;
// 	}
// };


import { foodAdditives, foodAdditivesList } from '../foodAdditives.js';

export const checkCompound = (ingredients) => {
    const harmfulAdditivesFound = [];
    const regex = new RegExp(foodAdditivesList.join('|'), 'gi');
    const matches = ingredients.match(regex);

    if (matches) {
        const uniqueMatches = [
            ...new Set(matches.map(additive => additive.toLowerCase())),
        ];
        harmfulAdditivesFound.push(...uniqueMatches);
    }

    if (harmfulAdditivesFound.length > 0) {
        const shortAnswer = `Обнаружены *опасные* компоненты:\n\n*${harmfulAdditivesFound.join(', ')}.*\n\n💔Данные пищевые добавки *опасны для здоровья*, рекомендуем выбрать *другой продукт*, не содержащий их.`;

        const detailedAnswer = `Обнаружены *опасные* компоненты:\n\n${
            harmfulAdditivesFound.map(additive => 
                `*${additive}*: ${foodAdditives[additive.toLowerCase()]}`
            ).join('\n\n')
        }\n\n💔Данные пищевые добавки *опасны для здоровья*, рекомендуем выбрать *другой продукт*, не содержащий их.`;

        return {
            shortAnswer,
            detailedAnswer,
            additives: harmfulAdditivesFound
        };
    } else {
        const safeAnswer = `Проверили состав…\nИ он *безопасен*. Продукт не содержит вредных компонентов.\n💚*Можно* смело кушать.`;

        return {
            shortAnswer: safeAnswer,
            detailedAnswer: safeAnswer,
            additives: []
        };
    }
};