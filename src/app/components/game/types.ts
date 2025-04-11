export type ItemType = "recycle" | "trash" | "reuse";

export type GameItem = {
	id: string;
	name: string;
	emoji: string;
	svgIcon?: string;
	type: ItemType;
	tip: string;
	points: number;
	co2: number;
	effect?: ParticleEffectType;
};

export type PowerUpType =
	| "magnet"
	| "extraLife"
	| "doublePoints"
	| "clearScreen"
	| "scoreBoost";

export type Particle = {
	id: string;
	x: number;
	y: number;
	size: number;
	color: string;
	velocityX: number;
	velocityY: number;
	opacity: number;
	rotation: number;
};

export type EnvironmentState = {
	clouds: number;
	trees: number;
	birds: number;
	forest: number;
	ocean: number;
	fish: number;
	flowers: number;
};

export type EnvironmentThreshold = {
	co2: number;
	elements: string[];
	count: number;
	message: string;
};

export type ParticleEffectType = "confetti" | "sparkle" | "explosion";

export type ParticleEffect = {
	colors: string[];
	count: number;
	speed: number;
	size: { min: number; max: number };
	duration: number;
	type?: ParticleEffectType;
};

export interface GameState {
	score: number;
	lives: number;
	gameOver: boolean;
	gameStarted: boolean;
	isPaused: boolean;
	level: number;
	levelProgress: number;
	savedCO2: number;
	totalSorted: number;
	currentItems: Array<{
		id: string;
		item: GameItem;
		position: number;
		speed: number;
		horizontalPos: number;
		velocityX: number;
		motionValues: {
			animationDuration: number;
			entryDelay: number;
			wobbleAmount: number;
			fallingDuration: number;
			spin?: boolean;
			spinSpeed?: number;
			spinDirection?: number;
			bounceIntensity?: number;
		};
		isSpecial?: boolean;
	}>;
	showTip: boolean;
	tip: string;
	countdown: number;
	isCountingDown: boolean;
	isNewHighScore: boolean;
	pointsMultiplier: number;
	speedModifier: number;
	gameSpeed: number;
}
