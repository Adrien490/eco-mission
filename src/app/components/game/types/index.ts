export type ItemType = "recycle" | "trash" | "reuse";
export type PowerUpType =
	| "slowTime"
	| "magnet"
	| "extraLife"
	| "doublePoints"
	| "clearScreen";

export interface GameItem {
	id: string;
	name: string;
	emoji: string;
	svgIcon: string;
	type: ItemType;
	tip: string;
	points: number;
	co2: number;
}

export interface PowerUp {
	id: string;
	name: string;
	type: PowerUpType;
	icon: string;
	duration: number;
	effect: string;
	rarity: "common" | "rare" | "epic";
}

export interface Particle {
	id: string;
	x: number;
	y: number;
	size: number;
	color: string;
	velocityX: number;
	velocityY: number;
	opacity: number;
	rotation: number;
}

export interface BackgroundElement {
	id: string;
	svg: string;
	positions: {
		x: number;
		y: number;
		scale: number;
		opacity: number;
	}[];
}

export interface UserProgress {
	highScore: number;
	totalCO2Saved: number;
	totalItemsSorted: number;
	level: number;
	completedTutorial: boolean;
}
