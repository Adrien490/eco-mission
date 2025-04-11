import { motion } from "framer-motion";
import React from "react";

interface GameOverProps {
	score: number;
	isNewHighScore: boolean;
	savedCO2: number;
	totalSorted: number;
	totalCO2Saved: number;
	totalItemsSorted: number;
	onRestart: () => void;
	onReturnToMenu: () => void;
}

const GameOver: React.FC<GameOverProps> = ({
	score,
	isNewHighScore,
	savedCO2,
	totalSorted,
	totalCO2Saved,
	totalItemsSorted,
	onRestart,
	onReturnToMenu,
}) => {
	return (
		<motion.div
			className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<motion.div
				className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4"
				initial={{ scale: 0.8, opacity: 0, y: 20 }}
				animate={{ scale: 1, opacity: 1, y: 0 }}
				transition={{
					type: "spring",
					damping: 25,
					stiffness: 300,
				}}
			>
				<h2 className="text-2xl font-bold text-center mb-4">
					Partie terminée !
				</h2>
				<div className="mb-6">
					<div className="flex justify-center items-center gap-3 mb-4">
						<div className="text-4xl font-bold text-green-600">{score}</div>
						<div className="text-lg text-gray-600 dark:text-gray-400">
							points
						</div>
						{isNewHighScore && (
							<div className="bg-yellow-100 dark:bg-yellow-800/50 text-yellow-800 dark:text-yellow-200 text-xs font-bold px-2 py-1 rounded animate-pulse">
								NOUVEAU RECORD!
							</div>
						)}
					</div>

					<div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/30 dark:to-blue-900/30 rounded-lg">
						<h3 className="font-semibold text-green-700 dark:text-green-400 mb-2">
							Impact environnemental :
						</h3>
						<div className="flex justify-between items-center mb-2 border-b border-green-100 dark:border-green-800 pb-2">
							<span>CO2 économisé</span>
							<span className="font-bold">{savedCO2.toFixed(1)} kg</span>
						</div>
						<div className="flex justify-between items-center mb-3 border-b border-green-100 dark:border-green-800 pb-2">
							<span>Objets correctement triés</span>
							<span className="font-bold">{totalSorted}</span>
						</div>
						<p className="mt-3 text-sm bg-green-100 dark:bg-green-800/40 p-2 rounded">
							{totalSorted > 15
								? "Excellent ! Tu fais partie des 20% de Français les plus efficaces en tri !"
								: totalSorted > 8
								? "Bien joué ! Tu fais mieux que la moyenne des Français."
								: "Continue tes efforts ! Avec de l'entraînement, tu deviendras un expert du tri."}
						</p>
					</div>

					{/* Statistiques globales */}
					<div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm">
						<h3 className="font-semibold text-blue-700 dark:text-blue-400 mb-1">
							Statistiques globales :
						</h3>
						<div className="flex justify-between">
							<span>Total CO2 économisé</span>
							<span className="font-medium">{totalCO2Saved.toFixed(1)} kg</span>
						</div>
						<div className="flex justify-between">
							<span>Total objets triés</span>
							<span className="font-medium">{totalItemsSorted}</span>
						</div>
					</div>
				</div>
				<div className="flex gap-3 justify-center">
					<button
						onClick={onRestart}
						className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-lg shadow transition-colors cursor-pointer"
					>
						Rejouer
					</button>
					<button
						onClick={onReturnToMenu}
						className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold rounded-lg shadow transition-colors cursor-pointer"
					>
						Menu
					</button>
				</div>

				<div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
					<p className="text-center text-sm text-gray-500">
						Partage ton score sur les réseaux pour sensibiliser tes amis !
					</p>
					<div className="flex justify-center gap-3 mt-2">
						<button className="p-2 bg-blue-500 text-white rounded-full cursor-pointer">
							📱
						</button>
						<button className="p-2 bg-green-500 text-white rounded-full cursor-pointer">
							📧
						</button>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
};

export default GameOver;
