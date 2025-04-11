import { GameItem, PowerUpType } from "../types";

// Configuration de taille uniforme pour les SVG
const SVG_SIZE = "24";
const SVG_VIEWBOX = "0 0 24 24";

// SVG icons uniformisés pour remplacer les emojis
export const itemIcons = {
	bottle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#3498db"><path d="M13 3h-2v2h2V3zm1 3H10c-.55 0-1 .45-1 1v1c0 .55.45 1 1 1v10c0 1.1.9 2 2 2s2-.9 2-2V9c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1z"/></svg>`,
	apple: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#e74c3c"><path d="M18.7 3.7c-1-.5-2.3-.3-3.1.4-1.5 1.2-.8 4.1.7 4.2 1.4 0 3.8-3.5 2.4-4.6M13 7c-4.2 0-5 4-5 4s-.1 5.9 3.2 10c.8 1 1.8 1 2.8 0C17.1 16.9 17 11 17 11s-.7-4-4-4M8.9 2.2C8 3.6 7.5 5.7 8.3 7.1c1.1 2.4 4.6.8 4.8-1.5.2-1.9-3.3-4.8-4.2-3.4z"/>`,
	battery: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#2ecc71"><path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/></svg>`,
	cardboard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#e67e22"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`,
	plasticbag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#bdc3c7"><path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6C4.9 6 4 6.9 4 8v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z"/></svg>`,
	paper: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#f1c40f"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 14h-8v-2h8v2zm0-4h-8v-2h8v2z"/></svg>`,
	eggshell: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#ecf0f1"><path d="M12 4C8.7 4 6 7.5 6 13s2.7 7 6 7 6-1.5 6-7-2.7-9-6-9z"/></svg>`,
	can: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#95a5a6"><path d="M7 3v1h10V3c0-1.1-.9-2-2-2H9C7.9 1 7 1.9 7 3zm13 5H4c-.55 0-1 .45-1 1v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V9c0-.55-.45-1-1-1z"/></svg>`,
	clothes: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#9b59b6"><path d="M16.5 2C15.3 2 14.1 2.5 13 3.2 11.9 2.5 10.7 2 9.5 2 6.5 2 4 4.5 4 7.5c0 2.5 2 5.5 9 11.5 7-6 9-9 9-11.5C22 4.5 19.5 2 16.5 2z"/></svg>`,
	glass: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#1abc9c"><path d="M15.5 21L14 8h-4l-1.5 13h7zM10 3h4v3h-4z"/></svg>`,
	leafs: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#27ae60"><path d="M12 22c4.4 0 8-3.6 8-8 0-3.7-2.5-6.8-6-7.8V3h-4v3.2c-3.5 1-6 4.1-6 7.8 0 4.4 3.6 8 8 8z"/></svg>`,
	lightbulb: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#f39c12"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>`,
	toy: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#e74c3c"><path d="M17 12c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm-15-1c0 1.65 1.35 3 3 3s3-1.35 3-3v-1h-2v1c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1s1 .45 1 1v1h2V7c0-1.65-1.35-3-3-3S2 5.35 2 7v4z"/></svg>`,
	smartphone: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#34495e"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/></svg>`,
	tincans: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#7f8c8d"><path d="M12 2C8.14 2 5 5.14 5 9v12c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V9c0-3.86-3.14-7-7-7zm2 15h-4v-2h4v2zm0-4h-4v-2h4v2z"/></svg>`,

	// Nouveaux objets
	newspaper: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#95a5a6"><path d="M22 3l-1.67 1.67L18.67 3L17 4.67L15.33 3l-1.66 1.67L12 3l-1.67 1.67L8.67 3L7 4.67L5.33 3L3.67 4.67L2 3v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V3zM11 19H4v-6h7v6zm9 0h-7v-2h7v2zm0-4h-7v-2h7v2zm0-4H4V8h16v3z"/></svg>`,
	coffeeCup: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#795548"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3z"/></svg>`,
	banana: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#f1c40f"><path d="M7.4 21c.7-.8 2.7-2.9 5.5-2.9 1.9 0 3.5.8 4.5 1.3.4.2.8.3 1.1.5.2.1.3.2.5.2V4.9c-.2-.1-.5-.2-.8-.4-1-.5-2.6-1.4-4.5-1.4C10.5 3 8.2 5.7 7.4 7l-.1 14z"/></svg>`,
	milk: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#ecf0f1"><path d="M14 3v2H7V3h7m5.9 5H5.1L3 11v9c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2v-9l-2.1-3z"/></svg>`,
	laptop: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#34495e"><path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/></svg>`,

	// Nouvelles icônes
	metalCan: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#95a5a6"><path d="M7 2l2 2h6l2-2v20H7V2z"/></svg>`,
	yogurt: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#ecf0f1"><path d="M8,2.2V4h8V2.2L8,2.2z M16,8.4v9.4l-8,3V8.4H16z M16,6.4H8v1h8V6.4z"/></svg>`,
	cereal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#f39c12"><path d="M4,7V19c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2V7c0-1.1-0.9-2-2-2h-12C4.9,5,4,5.9,4,7z M18,14h-6v-2h6V14z M12,10h6V8h-6V10z M6,8h4v10H6V8z"/></svg>`,
	shoebox: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#d35400"><path d="M21,6H3C1.9,6,1,6.9,1,8v8c0,1.1,0.9,2,2,2h18c1.1,0,2-0.9,2-2V8C23,6.9,22.1,6,21,6z M10,14H4v-4h6V14z M16,14h-4v-4h4V14z M20,14h-2v-4h2V14z"/></svg>`,
	diaper: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#ecf0f1"><path d="M6,6L6,18c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2L18,6c0-1.1-0.9-2-2-2L8,4C6.9,4,6,4.9,6,6z M8,8h8v2h-8V8z"/></svg>`,
	bookMagazine: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#3498db"><path d="M21,5c-1.11-0.35-2.33-0.5-3.5-0.5c-1.95,0-4.05,0.4-5.5,1.5c-1.45-1.1-3.55-1.5-5.5-1.5S2.45,4.9,1,6v14.65c0,0.25,0.25,0.5,0.5,0.5c0.1,0,0.15-0.05,0.25-0.05C3.1,20.45,5.05,20,6.5,20c1.95,0,4.05,0.4,5.5,1.5c1.35-0.85,3.8-1.5,5.5-1.5c1.65,0,3.35,0.3,4.75,1.05c0.1,0.05,0.15,0.05,0.25,0.05c0.25,0,0.5-0.25,0.5-0.5V6C22.4,5.55,21.75,5.25,21,5z M21,18.5c-1.1-0.35-2.3-0.5-3.5-0.5c-1.7,0-4.15,0.65-5.5,1.5V8c1.35-0.85,3.8-1.5,5.5-1.5c1.2,0,2.4,0.15,3.5,0.5V18.5z"/></svg>`,
	toyCar: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#e74c3c"><path d="M18.92,6.01C18.72,5.42,18.16,5,17.5,5h-11c-0.66,0-1.21,0.42-1.42,1.01L3,12v8c0,0.55,0.45,1,1,1h1c0.55,0,1-0.45,1-1v-1h12v1c0,0.55,0.45,1,1,1h1c0.55,0,1-0.45,1-1v-8L18.92,6.01z M6.5,16c-0.83,0-1.5-0.67-1.5-1.5S5.67,13,6.5,13s1.5,0.67,1.5,1.5S7.33,16,6.5,16z M17.5,16c-0.83,0-1.5-0.67-1.5-1.5s0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5S18.33,16,17.5,16z M5,11l1.5-4.5h11L19,11H5z"/></svg>`,
	cookingOil: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#f1c40f"><path d="M6,2L6,4h12v-2L6,2z M15,5H9l-3,6v11h12V11L15,5z"/></svg>`,
	hairbrush: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#9b59b6"><path d="M8.5,2C6.57,2,5,3.57,5,5.5V15c0,2.76,2.24,5,5,5h4c2.76,0,5-2.24,5-5v-2.5c0-1.93-1.57-3.5-3.5-3.5H14v-1.5C14,5.57,12.43,4,10.5,4h-2V2z"/></svg>`,
	facemask: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#3498db"><path d="M19.5,6c-1.31,0-2.37,1.01-2.48,2.3C15.14,7.8,12.83,7,10,7S4.86,7.8,2.98,8.3C2.87,7.02,1.81,6,0.5,6C0.22,6,0,6.22,0,6.5v3C0,9.78,0.22,10,0.5,10c1.31,0,2.37-1.01,2.48-2.3C4.86,8.2,7.17,9,10,9s5.14-0.8,7.02-1.3C17.13,8.99,18.19,10,19.5,10c0.28,0,0.5-0.22,0.5-0.5v-3C20,6.22,19.78,6,19.5,6z"/></svg>`,
	medicinePill: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#e74c3c"><path d="M19,13h-6v6h-2v-6H5v-2h6V5h2v6h6V13z"/></svg>`,
	umbrella: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#3498db"><path d="M13.127,14.56l1.43-1.43L6.44,5.016l-1.43,1.43L13.127,14.56z M19.42,5.016c0.39-0.39,0.39-1.03,0-1.43l-2.13-2.13c-0.39-0.39-1.03-0.39-1.43,0l-1.43,1.43l3.55,3.56L19.42,5.016z M3,17.25V21h3.75L17.81,9.94l-3.75-3.75L3,17.25z"/></svg>`,
	coffeeGrounds: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#795548"><path d="M20,3H4v10c0,2.21,1.79,4,4,4h6c2.21,0,4-1.79,4-4v-3h2c1.11,0,2-0.89,2-2V5C22,3.89,21.11,3,20,3z M16,13.17c0,1.52-1.2,2.83-2.67,2.83H8.67C7.2,16,6,14.7,6,13.17V5h10V13.17z"/></svg>`,
	styrofoam: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#ecf0f1"><path d="M19,3h-4.18C14.4,1.84,13.3,1,12,1c-1.3,0-2.4,0.84-2.82,2H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M12,3c0.55,0,1,0.45,1,1s-0.45,1-1,1s-1-0.45-1-1S11.45,3,12,3z"/></svg>`,
	paint: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#9b59b6"><path d="M18,4V3c0-0.55-0.45-1-1-1H5C4.45,2,4,2.45,4,3v4c0,0.55,0.45,1,1,1h12c0.55,0,1-0.45,1-1V6h1v4H9v10c0,0.55,0.45,1,1,1h2c0.55,0,1-0.45,1-1v-9h8V4H18z"/></svg>`,
};

export const gameItems: GameItem[] = [
	{
		id: "bottle",
		name: "Bouteille plastique",
		emoji: "🍶",
		svgIcon: itemIcons.bottle,
		type: "recycle",
		tip: "Une bouteille plastique met jusqu'à 1000 ans à se décomposer.",
		points: 10,
		co2: 0.5,
	},
	{
		id: "apple",
		name: "Trognon de pomme",
		emoji: "🍎",
		svgIcon: itemIcons.apple,
		type: "trash",
		tip: "Les déchets organiques peuvent être compostés pour créer un engrais naturel.",
		points: 5,
		co2: 0.2,
	},
	{
		id: "battery",
		name: "Pile",
		emoji: "🔋",
		svgIcon: itemIcons.battery,
		type: "recycle",
		tip: "Une pile peut polluer 500 000 litres d'eau si elle n'est pas recyclée correctement.",
		points: 15,
		co2: 2.0,
	},
	{
		id: "cardboard",
		name: "Boîte en carton",
		emoji: "📦",
		svgIcon: itemIcons.cardboard,
		type: "recycle",
		tip: "Recycler une tonne de carton permet d'économiser 2,5 tonnes de bois.",
		points: 10,
		co2: 0.8,
	},
	{
		id: "plasticbag",
		name: "Sac plastique",
		emoji: "🛍️",
		svgIcon: itemIcons.plasticbag,
		type: "reuse",
		tip: "Utilisez des sacs réutilisables pour réduire les déchets plastiques.",
		points: 10,
		co2: 0.3,
	},
	{
		id: "paper",
		name: "Papier",
		emoji: "📃",
		svgIcon: itemIcons.paper,
		type: "recycle",
		tip: "Recycler une tonne de papier permet de sauver 17 arbres.",
		points: 5,
		co2: 0.4,
	},
	{
		id: "eggshell",
		name: "Coquille d'œuf",
		emoji: "🥚",
		svgIcon: itemIcons.eggshell,
		type: "trash",
		tip: "Les coquilles d'œuf sont compostables et apportent du calcium aux plantes.",
		points: 5,
		co2: 0.1,
	},
	{
		id: "can",
		name: "Canette",
		emoji: "🥫",
		svgIcon: itemIcons.can,
		type: "recycle",
		tip: "Une canette d'aluminium peut être recyclée à l'infini.",
		points: 10,
		co2: 0.9,
	},
	{
		id: "clothes",
		name: "Vêtements usagés",
		emoji: "👕",
		svgIcon: itemIcons.clothes,
		type: "reuse",
		tip: "Donner vos vêtements prolonge leur durée de vie et réduit les déchets textiles.",
		points: 15,
		co2: 4.0,
	},
	{
		id: "glass",
		name: "Bouteille en verre",
		emoji: "🍾",
		svgIcon: itemIcons.glass,
		type: "recycle",
		tip: "Le verre est 100% recyclable et peut être refondu à l'infini.",
		points: 10,
		co2: 0.7,
	},
	{
		id: "leafs",
		name: "Feuilles mortes",
		emoji: "🍂",
		svgIcon: itemIcons.leafs,
		type: "trash",
		tip: "Les feuilles mortes font un excellent paillis pour votre jardin.",
		points: 5,
		co2: 0.2,
	},
	{
		id: "lightbulb",
		name: "Ampoule",
		emoji: "💡",
		svgIcon: itemIcons.lightbulb,
		type: "recycle",
		tip: "Les ampoules contiennent des matériaux dangereux qui doivent être recyclés correctement.",
		points: 15,
		co2: 1.0,
	},
	{
		id: "toy",
		name: "Jouet cassé",
		emoji: "🧸",
		svgIcon: itemIcons.toy,
		type: "reuse",
		tip: "Réparer plutôt que jeter permet de réduire les déchets et économiser de l'argent.",
		points: 10,
		co2: 0.6,
	},
	{
		id: "smartphone",
		name: "Smartphone",
		emoji: "📱",
		svgIcon: itemIcons.smartphone,
		type: "reuse",
		tip: "Les smartphones contiennent des métaux rares qui peuvent être recyclés.",
		points: 20,
		co2: 8.0,
	},
	{
		id: "tincans",
		name: "Boîte de conserve",
		emoji: "🥫",
		svgIcon: itemIcons.tincans,
		type: "recycle",
		tip: "L'acier des boîtes de conserve est recyclable à 100%.",
		points: 10,
		co2: 0.8,
	},
	// Nouveaux objets
	{
		id: "newspaper",
		name: "Journal",
		emoji: "📰",
		svgIcon: itemIcons.newspaper,
		type: "recycle",
		tip: "Recycler un journal permet d'économiser 17 arbres et 4000 kW d'énergie.",
		points: 10,
		co2: 0.5,
	},
	{
		id: "coffeeCup",
		name: "Gobelet à café",
		emoji: "☕",
		svgIcon: itemIcons.coffeeCup,
		type: "trash",
		tip: "Les gobelets à café contiennent souvent une couche de plastique les rendant difficiles à recycler.",
		points: 5,
		co2: 0.3,
	},
	{
		id: "banana",
		name: "Peau de banane",
		emoji: "🍌",
		svgIcon: itemIcons.banana,
		type: "trash",
		tip: "Les peaux de banane se décomposent en 2 à 5 semaines dans un compost.",
		points: 5,
		co2: 0.2,
	},
	{
		id: "milk",
		name: "Brique de lait",
		emoji: "🥛",
		svgIcon: itemIcons.milk,
		type: "recycle",
		tip: "Les briques de lait contiennent du carton, du plastique et de l'aluminium.",
		points: 10,
		co2: 0.6,
	},
	{
		id: "laptop",
		name: "Ordinateur portable",
		emoji: "💻",
		svgIcon: itemIcons.laptop,
		type: "reuse",
		tip: "Un ordinateur portable contient des composants toxiques et des métaux rares.",
		points: 25,
		co2: 10.0,
	},
	// Nouveaux objets supplémentaires
	{
		id: "metalCan",
		name: "Conserve métallique",
		emoji: "🥫",
		svgIcon: itemIcons.metalCan,
		type: "recycle",
		tip: "Les conserves métalliques sont recyclables à l'infini sans perte de qualité.",
		points: 12,
		co2: 0.9,
	},
	{
		id: "yogurt",
		name: "Pot de yaourt",
		emoji: "🥛",
		svgIcon: itemIcons.yogurt,
		type: "recycle",
		tip: "Rincez les pots de yaourt avant de les recycler pour éviter les contaminations.",
		points: 8,
		co2: 0.3,
	},
	{
		id: "cereal",
		name: "Boîte de céréales",
		emoji: "📦",
		svgIcon: itemIcons.cereal,
		type: "recycle",
		tip: "Les boîtes de céréales sont faites de carton recyclable.",
		points: 7,
		co2: 0.4,
	},
	{
		id: "shoebox",
		name: "Boîte à chaussures",
		emoji: "👞",
		svgIcon: itemIcons.shoebox,
		type: "reuse",
		tip: "Les boîtes à chaussures peuvent être réutilisées pour le rangement.",
		points: 11,
		co2: 0.6,
	},
	{
		id: "diaper",
		name: "Couche jetable",
		emoji: "👶",
		svgIcon: itemIcons.diaper,
		type: "trash",
		tip: "Les couches jetables mettent 450 ans à se décomposer. Envisagez les couches lavables.",
		points: 8,
		co2: 0.4,
	},
	{
		id: "bookMagazine",
		name: "Magazine",
		emoji: "📰",
		svgIcon: itemIcons.bookMagazine,
		type: "recycle",
		tip: "Les magazines sont entièrement recyclables et peuvent avoir une seconde vie.",
		points: 9,
		co2: 0.5,
	},
	{
		id: "toyCar",
		name: "Jouet en plastique",
		emoji: "🚗",
		svgIcon: itemIcons.toyCar,
		type: "reuse",
		tip: "Donnez vos jouets en bon état plutôt que de les jeter.",
		points: 14,
		co2: 1.2,
	},
	{
		id: "cookingOil",
		name: "Huile de cuisson",
		emoji: "🧴",
		svgIcon: itemIcons.cookingOil,
		type: "recycle",
		tip: "L'huile de cuisson usagée doit être déposée en déchèterie, jamais dans l'évier.",
		points: 16,
		co2: 1.8,
	},
	{
		id: "hairbrush",
		name: "Brosse à cheveux",
		emoji: "🪥",
		svgIcon: itemIcons.hairbrush,
		type: "reuse",
		tip: "Nettoyez et désinfectez vos brosses usagées avant de les donner.",
		points: 13,
		co2: 0.7,
	},
	{
		id: "facemask",
		name: "Masque jetable",
		emoji: "😷",
		svgIcon: itemIcons.facemask,
		type: "trash",
		tip: "Les masques jetables doivent être mis dans des sacs fermés avant d'être jetés.",
		points: 7,
		co2: 0.3,
	},
	{
		id: "medicinePill",
		name: "Médicaments périmés",
		emoji: "💊",
		svgIcon: itemIcons.medicinePill,
		type: "recycle",
		tip: "Rapportez vos médicaments périmés en pharmacie pour un traitement sécurisé.",
		points: 18,
		co2: 2.0,
	},
	{
		id: "umbrella",
		name: "Parapluie cassé",
		emoji: "☂️",
		svgIcon: itemIcons.umbrella,
		type: "trash",
		tip: "Certaines pièces de parapluie peuvent être recyclées, démontez-le avant de le jeter.",
		points: 10,
		co2: 0.5,
	},
	{
		id: "coffeeGrounds",
		name: "Marc de café",
		emoji: "☕",
		svgIcon: itemIcons.coffeeGrounds,
		type: "trash",
		tip: "Le marc de café est excellent pour le compost et peut servir d'engrais naturel.",
		points: 6,
		co2: 0.2,
	},
	{
		id: "styrofoam",
		name: "Polystyrène",
		emoji: "📦",
		svgIcon: itemIcons.styrofoam,
		type: "recycle",
		tip: "Le polystyrène est recyclable mais doit être apporté dans des points de collecte spécifiques.",
		points: 15,
		co2: 1.5,
	},
	{
		id: "paint",
		name: "Pot de peinture",
		emoji: "🎨",
		svgIcon: itemIcons.paint,
		type: "recycle",
		tip: "Les restes de peinture doivent être apportés en déchèterie, jamais jetés à la poubelle.",
		points: 20,
		co2: 3.0,
	},
];

// Power-ups
export const powerUps = [
	{
		id: "slowTime",
		name: "Ralentissement",
		type: "slowTime" as PowerUpType,
		icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#3498db"><path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>`,
		duration: 10000, // 10 secondes
		effect: "Ralentit la chute des objets de 50% pendant 10 secondes",
		rarity: "common",
	},
	{
		id: "magnet",
		name: "Aimant",
		type: "magnet" as PowerUpType,
		icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#e74c3c"><path d="M17 4.14V2h-3v2h-4V2H7v2.14c-1.72.45-3 2-3 3.86v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.86-1.28-3.41-3-3.86zM18 20H6V8c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v12zm-1.5-8v4h-2v-2h-7v-2h9z"/></svg>`,
		duration: 8000, // 8 secondes
		effect: "Attire automatiquement les déchets vers leur bonne poubelle",
		rarity: "rare",
	},
	{
		id: "extraLife",
		name: "Vie Supplémentaire",
		type: "extraLife" as PowerUpType,
		icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#2ecc71"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
		duration: 0, // effet instantané
		effect: "Ajoute une vie supplémentaire",
		rarity: "epic",
	},
	{
		id: "doublePoints",
		name: "Points Doublés",
		type: "doublePoints" as PowerUpType,
		icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#f39c12"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>`,
		duration: 15000, // 15 secondes
		effect: "Double les points gagnés pendant 15 secondes",
		rarity: "rare",
	},
	{
		id: "clearScreen",
		name: "Écran Net",
		type: "clearScreen" as PowerUpType,
		icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#9b59b6"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11H7v-2h10v2zm0-4h-10v-2h10v2zm0-4H7V8h10V6z"/></svg>`,
		duration: 0, // effet instantané
		effect: "Trie correctement tous les déchets à l'écran",
		rarity: "epic",
	},
];

// Types d'événements spéciaux
export const specialEvents = [
	{
		id: "itemRain",
		name: "Pluie d'objets",
		description: "Une pluie d'objets tombe plus rapidement",
		duration: 8000, // 8 secondes
		frequency: "medium", // fréquence d'apparition
	},
	{
		id: "bonusItem",
		name: "Objet bonus",
		description: "Un objet spécial apparaît pour des points bonus",
		duration: 5000, // 5 secondes pour l'attraper
		frequency: "high", // fréquence d'apparition
	},
	{
		id: "mixedItems",
		name: "Objets mélangés",
		description: "Des objets difficiles à identifier apparaissent",
		duration: 12000, // 12 secondes
		frequency: "low", // fréquence d'apparition
	},
];

// Faits écologiques pour interstitiels
export const ecoFacts = [
	"La mer Méditerranée contient 1,25 million de fragments de plastique par km².",
	"Un Français produit en moyenne 590 kg de déchets par an.",
	"Le recyclage d'une tonne de plastique économise 5774 kWh d'énergie.",
	"Un mégot de cigarette peut polluer jusqu'à 500 litres d'eau.",
	"70% du poids d'un smartphone peut être recyclé.",
	"Une bouteille en verre met plus de 4000 ans à se décomposer dans la nature.",
	"33% des déchets ménagers pourraient être compostés.",
	"Le tri sélectif permet de recycler plus de 9 emballages sur 10.",
	"La première étape du recyclage est le geste de tri à la maison.",
	"1 tonne de papier recyclé = 17 arbres préservés.",
	"Chaque année, un Français jette 20kg de nourriture encore consommable.",
	"75% des déchets en mer sont en plastique.",
	"Le recyclage de l'aluminium utilise 95% moins d'énergie que sa production.",
	"L'économie circulaire génère 500 000 emplois en France.",
	"50% des déchets électroniques ne sont pas recyclés correctement.",
];

// Icônes pour les différentes catégories
export const binIcons = {
	recycle: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/></svg>`,
	trash: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`,
	reuse: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%" fill="currentColor"><path d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/></svg>`,
};

// Éléments naturels pour l'arrière-plan
export const backgroundElements = [
	{
		id: "clouds",
		svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#ecf0f1"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>`,
		positions: [
			{ x: 10, y: 20, scale: 0.8, opacity: 0.6 },
			{ x: 70, y: 40, scale: 1.2, opacity: 0.7 },
			{ x: 30, y: 60, scale: 0.7, opacity: 0.5 },
		],
	},
	{
		id: "trees",
		svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#27ae60"><path d="M12 22V16h1v-4c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v4h1v6h4zm6-15h-1v-1c0-1.1-.9-2-2-2h-2c-1.1 0-2 .9-2 2v1h-1c-1.1 0-2 .9-2 2v2h3v1c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2v-1h3V9c0-1.1-.9-2-2-2z"/></svg>`,
		positions: [
			{ x: 5, y: 80, scale: 1.5, opacity: 0.8 },
			{ x: 90, y: 85, scale: 1.3, opacity: 0.7 },
			{ x: 50, y: 82, scale: 1.2, opacity: 0.9 },
		],
	},
	{
		id: "birds",
		svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#3498db"><path d="M12 8.5l3-3 1.5 1.5L15 8.5l3 3L16.5 13 13 9.5 11 12 7.5 7 9 5.5l3 3zm0 7.5l3 3 1.5-1.5L15 15.5l3-3 1.5 1.5-3.5 3.5-2-2.5-3.5 4.5-1.5-1.5 3-3z"/></svg>`,
		positions: [
			{ x: 20, y: 10, scale: 0.5, opacity: 0.6 },
			{ x: 60, y: 5, scale: 0.4, opacity: 0.7 },
			{ x: 40, y: 15, scale: 0.3, opacity: 0.8 },
		],
	},
	// Nouveaux éléments pour forêt
	{
		id: "forest",
		svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#219653"><path d="M12 2L4 9h3v4H5v6h6v-5h2v5h6v-6h-2v-4h3L12 2z"/></svg>`,
		positions: [
			{ x: 15, y: 75, scale: 1.3, opacity: 0.8 },
			{ x: 35, y: 78, scale: 1.5, opacity: 0.9 },
			{ x: 55, y: 76, scale: 1.2, opacity: 0.85 },
			{ x: 75, y: 77, scale: 1.4, opacity: 0.9 },
			{ x: 95, y: 79, scale: 1.3, opacity: 0.8 },
		],
	},
	// Éléments pour océan
	{
		id: "ocean",
		svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#3498db"><path d="M12 22c3.31 0 6-2.69 6-6H6c0 3.31 2.69 6 6 6zm-6-9h12V7H6v6z"/></svg>`,
		positions: [
			{ x: 10, y: 95, scale: 1.4, opacity: 0.7 },
			{ x: 30, y: 93, scale: 1.2, opacity: 0.8 },
			{ x: 50, y: 94, scale: 1.5, opacity: 0.6 },
			{ x: 70, y: 92, scale: 1.3, opacity: 0.75 },
			{ x: 90, y: 95, scale: 1.1, opacity: 0.7 },
		],
	},
	// Éléments pour poissons
	{
		id: "fish",
		svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#f39c12"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
		positions: [
			{ x: 20, y: 89, scale: 0.5, opacity: 0.7 },
			{ x: 40, y: 87, scale: 0.4, opacity: 0.8 },
			{ x: 60, y: 88, scale: 0.6, opacity: 0.7 },
			{ x: 80, y: 86, scale: 0.5, opacity: 0.8 },
		],
	},
	// Éléments pour fleurs
	{
		id: "flowers",
		svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SVG_VIEWBOX}" width="${SVG_SIZE}" height="${SVG_SIZE}" fill="#e84393"><path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zm2.5-9c0-1.38 1.12-2.5 2.5-2.5.28 0 .5-.22.5-.5s-.22-.5-.5-.5c-1.38 0-2.5-1.12-2.5-2.5 0-.28-.22-.5-.5-.5s-.5.22-.5.5c0 1.38-1.12 2.5-2.5 2.5-.28 0-.5.22-.5.5s.22.5.5.5c1.38 0 2.5 1.12 2.5 2.5 0 .28.22.5.5.5s.5-.22.5-.5z"/></svg>`,
		positions: [
			{ x: 25, y: 70, scale: 0.4, opacity: 0.7 },
			{ x: 45, y: 72, scale: 0.5, opacity: 0.8 },
			{ x: 65, y: 71, scale: 0.4, opacity: 0.7 },
			{ x: 85, y: 73, scale: 0.5, opacity: 0.8 },
		],
	},
];

// Effets de particules (remplacés par des halos plus discrets)
export const particleEffects = {
	correctSort: {
		colors: ["#2ecc71", "#27ae60"],
		count: 1, // Réduit pour un effet de halo
		speed: 0,
		size: { min: 80, max: 100 },
		duration: 800,
		type: "halo",
	},
	levelUp: {
		colors: ["#f39c12", "#f1c40f", "#e67e22"],
		count: 10, // Réduit pour un effet plus discret
		speed: 5,
		size: { min: 10, max: 20 },
		duration: 1500,
		type: "stars",
	},
	powerUp: {
		colors: ["#3498db", "#2980b9"],
		count: 1, // Effet de pulsation
		speed: 0,
		size: { min: 40, max: 60 },
		duration: 1000,
		type: "pulse",
	},
};

// Thèmes d'environnement basés sur le CO2 économisé
export const environmentThemes = {
	forest: {
		name: "Forêt",
		description: "Plante des arbres pour capturer le CO2",
		thresholds: [
			{
				co2: 0,
				elements: ["trees"],
				count: 0,
				message: "Plantons des arbres pour réduire le CO2 !",
			},
			{
				co2: 5,
				elements: ["trees", "birds"],
				count: 1,
				message: "Le premier arbre commence à pousser !",
			},
			{
				co2: 10,
				elements: ["trees", "birds"],
				count: 2,
				message: "Votre forêt prend forme !",
			},
			{
				co2: 20,
				elements: ["trees", "birds", "flowers"],
				count: 3,
				message: "Les oiseaux arrivent dans votre forêt !",
			},
			{
				co2: 35,
				elements: ["trees", "birds", "flowers"],
				count: 4,
				message: "Votre forêt est florissante !",
			},
			{
				co2: 50,
				elements: ["trees", "birds", "flowers"],
				count: 5,
				message: "Vous avez créé une forêt dense qui absorbe beaucoup de CO2 !",
			},
		],
	},
	ocean: {
		name: "Océan",
		description: "Préserve les océans de la pollution plastique",
		thresholds: [
			{
				co2: 0,
				elements: ["ocean"],
				count: 0,
				message: "Les océans ont besoin de notre aide !",
			},
			{
				co2: 5,
				elements: ["ocean"],
				count: 1,
				message: "L'eau commence à s'éclaircir.",
			},
			{
				co2: 10,
				elements: ["ocean", "fish"],
				count: 2,
				message: "Les premiers poissons reviennent !",
			},
			{
				co2: 20,
				elements: ["ocean", "fish"],
				count: 3,
				message: "La vie marine se développe.",
			},
			{
				co2: 35,
				elements: ["ocean", "fish"],
				count: 4,
				message: "L'écosystème marin se rétablit !",
			},
			{
				co2: 50,
				elements: ["ocean", "fish"],
				count: 5,
				message:
					"L'océan est maintenant plein de vie et d'une belle couleur bleue !",
			},
		],
	},
};
