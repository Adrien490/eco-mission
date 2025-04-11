"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Particle } from "../types";

interface ParticlesProps {
	effect: "correctSort" | "levelUp" | "powerUp";
	x: number;
	y: number;
	colors: string[];
	count: number;
	speed: number;
	size: { min: number; max: number };
	duration: number;
	type?: "halo" | "stars" | "pulse";
	onComplete?: () => void;
}

export function Particles({
	effect,
	x,
	y,
	colors,
	count,
	speed,
	size,
	duration,
	type = "stars",
	onComplete,
}: ParticlesProps) {
	const [particles, setParticles] = useState<Particle[]>([]);
	const animationRef = useRef<number | null>(null);
	const startTimeRef = useRef<number>(Date.now());

	useEffect(() => {
		// Générer les particules initiales
		const initialParticles: Particle[] = [];

		if (type === "stars") {
			// Particules traditionnelles (étoiles, confettis)
			for (let i = 0; i < count; i++) {
				initialParticles.push({
					id: `particle-${i}`,
					x: x,
					y: y,
					size: Math.random() * (size.max - size.min) + size.min,
					color: colors[Math.floor(Math.random() * colors.length)],
					velocityX: (Math.random() - 0.5) * speed,
					velocityY: (Math.random() - 0.5) * speed,
					opacity: 1,
					rotation: Math.random() * 360,
				});
			}
		} else if (type === "halo" || type === "pulse") {
			// Pour les halos et pulsations, on n'a besoin que d'une particule centrale
			initialParticles.push({
				id: `halo-0`,
				x: x,
				y: y,
				size: size.min, // Commencer petit
				color: colors[0], // Couleur principale
				velocityX: 0,
				velocityY: 0,
				opacity: 0.5,
				rotation: 0,
			});
		}

		setParticles(initialParticles);
		startTimeRef.current = Date.now();

		// Fonction d'animation
		const animate = () => {
			const currentTime = Date.now();
			const elapsed = currentTime - startTimeRef.current;
			const progress = Math.min(elapsed / duration, 1);

			// Si la durée est dépassée, arrêter l'animation
			if (elapsed >= duration) {
				if (animationRef.current) {
					cancelAnimationFrame(animationRef.current);
					animationRef.current = null;
				}
				setParticles([]);
				if (onComplete) onComplete();
				return;
			}

			// Mettre à jour les particules selon le type d'effet
			setParticles((prevParticles) => {
				if (type === "stars") {
					// Animation traditionnelle pour les étoiles/particules
					return prevParticles.map((p) => {
						const opacity = 1 - progress;
						return {
							...p,
							x: p.x + p.velocityX,
							y: p.y + p.velocityY,
							velocityY: p.velocityY + 0.05, // Gravité
							rotation: p.rotation + 2,
							opacity: opacity > 0 ? opacity : 0,
						};
					});
				} else if (type === "halo") {
					// Animation de halo : grandit puis disparaît progressivement
					return prevParticles.map((p) => ({
						...p,
						size: p.size + (size.max - size.min) * (progress * 0.5), // Grandit graduellement
						opacity: 0.6 * (1 - progress), // Diminue l'opacité progressivement
					}));
				} else if (type === "pulse") {
					// Animation de pulsation : grandit puis rétrécit avec opacité variable
					const pulseProgress = (Math.sin(progress * Math.PI * 2) + 1) / 2; // Oscillation sinusoïdale
					return prevParticles.map((p) => ({
						...p,
						size: size.min + (size.max - size.min) * pulseProgress,
						opacity: 0.7 * (1 - progress * 0.5), // Diminue l'opacité graduellement mais moins vite
					}));
				}
				return prevParticles;
			});

			// Continuer l'animation
			animationRef.current = requestAnimationFrame(animate);
		};

		// Démarrer l'animation
		animationRef.current = requestAnimationFrame(animate);

		// Nettoyer l'animation à la fin
		return () => {
			if (animationRef.current) {
				cancelAnimationFrame(animationRef.current);
			}
		};
	}, [x, y, colors, count, speed, size, duration, type, onComplete]);

	return (
		<AnimatePresence>
			{type === "halo" || type === "pulse"
				? // Rendu pour halos et pulsations
				  particles.map((particle) => (
						<motion.div
							key={particle.id}
							className="absolute pointer-events-none rounded-full"
							style={{
								left: 0,
								top: 0,
								x: particle.x - particle.size / 2,
								y: particle.y - particle.size / 2,
								width: particle.size,
								height: particle.size,
								background: `radial-gradient(circle, ${particle.color}80 0%, ${particle.color}00 70%)`,
								opacity: particle.opacity,
								zIndex: 5,
							}}
							initial={{ scale: 0.2 }}
							animate={{ scale: 1 }}
							exit={{ scale: 1.5, opacity: 0 }}
						/>
				  ))
				: // Rendu pour les particules traditionnelles (étoiles, confettis)
				  particles.map((particle) => (
						<motion.div
							key={particle.id}
							className="absolute pointer-events-none"
							style={{
								left: 0,
								top: 0,
								x: particle.x,
								y: particle.y,
								rotate: particle.rotation,
								opacity: particle.opacity,
							}}
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							exit={{ scale: 0 }}
						>
							{effect === "correctSort" ? (
								<svg
									width={particle.size}
									height={particle.size}
									viewBox="0 0 24 24"
									fill={particle.color}
								>
									<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
								</svg>
							) : effect === "levelUp" ? (
								<svg
									width={particle.size}
									height={particle.size}
									viewBox="0 0 24 24"
									fill={particle.color}
								>
									<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
								</svg>
							) : (
								<div
									style={{
										width: particle.size,
										height: particle.size,
										backgroundColor: particle.color,
										borderRadius: "50%",
									}}
								/>
							)}
						</motion.div>
				  ))}
		</AnimatePresence>
	);
}

export default Particles;
