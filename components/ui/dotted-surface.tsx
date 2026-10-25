'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'> & {
	dotColor?: 'white' | 'black' | 'green';
};

export function DottedSurface({ className, dotColor = 'white', ...props }: DottedSurfaceProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<{
		scene: THREE.Scene;
		camera: THREE.PerspectiveCamera;
		renderer: THREE.WebGLRenderer;
		particles: THREE.Points[];
		animationId: number;
		count: number;
	} | null>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const SEPARATION = 150;
		const AMOUNTX = 40;
		const AMOUNTY = 60;
		// Wave phase per second: the original 0.1 per frame at 60 fps.
		const WAVE_SPEED = 6;

		// Scene setup
		const scene = new THREE.Scene();
		scene.fog = new THREE.Fog(0x000000, 2000, 10000);

		const camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			1,
			10000,
		);
		camera.position.set(0, 355, 1220);

		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
		});
		// Points look the same above 2x; rendering at 3x on phones only costs GPU time.
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
		renderer.setClearColor(0x000000, 0);

		containerRef.current.appendChild(renderer.domElement);

		// Create particles
		const particles: THREE.Points[] = [];
		const positions: number[] = [];
		const colors: number[] = [];

		// Create geometry for all particles
		const geometry = new THREE.BufferGeometry();

		// Set dot colors based on prop
		let r = 255, g = 255, b = 255; // Default white

		if (dotColor === 'green') {
			r = 0; g = 255; b = 128; // Green accent color
		} else if (dotColor === 'black') {
			r = 0; g = 0; b = 0; // Black
		}

		for (let ix = 0; ix < AMOUNTX; ix++) {
			for (let iy = 0; iy < AMOUNTY; iy++) {
				const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
				const y = 0; // Will be animated
				const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

				positions.push(x, y, z);
				colors.push(r, g, b);
			}
		}

		geometry.setAttribute(
			'position',
			new THREE.Float32BufferAttribute(positions, 3),
		);
		geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

		// Create material
		const material = new THREE.PointsMaterial({
			size: 6,
			vertexColors: true,
			transparent: true,
			opacity: 0.7,
			sizeAttenuation: true,
		});

		// Create points object
		const points = new THREE.Points(geometry, material);
		scene.add(points);

		let count = 0;
		let animationId = 0;
		let visible = false;
		let lastTime: number | null = null;

		// Animation function (runs only while the surface is on screen)
		const animate = (time: number) => {
			if (!visible) return;
			animationId = requestAnimationFrame(animate);

			// Advance by elapsed time rather than per frame, so the wave keeps the same pace on 60 Hz and 120 Hz screens.
			const elapsed = lastTime === null ? 0 : Math.min((time - lastTime) / 1000, 0.1);
			lastTime = time;

			const positionAttribute = geometry.attributes.position;
			const positions = positionAttribute.array as Float32Array;

			let i = 0;
			for (let ix = 0; ix < AMOUNTX; ix++) {
				for (let iy = 0; iy < AMOUNTY; iy++) {
					const index = i * 3;

					// Animate Y position with sine waves
					positions[index + 1] =
						Math.sin((ix + count) * 0.3) * 50 +
						Math.sin((iy + count) * 0.5) * 50;

					i++;
				}
			}

			positionAttribute.needsUpdate = true;
			renderer.render(scene, camera);
			count += elapsed * WAVE_SPEED;
		};

		// Handle window resize
		const handleResize = () => {
			if (!containerRef.current) return;

			// Keep the viewport's shape, as on first render: the view is stretched over the canvas,
			// so the wave always fills the canvas's lower half and the canvas height sets how tall it looks.
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
		};

		window.addEventListener('resize', handleResize);

		// Start animating when the surface scrolls into view, stop when it leaves.
		const visibilityObserver = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			cancelAnimationFrame(animationId);
			if (!visible) return;
			lastTime = null;
			animationId = requestAnimationFrame(animate);
		});
		visibilityObserver.observe(containerRef.current);

		// Store references
		sceneRef.current = {
			scene,
			camera,
			renderer,
			particles: [points],
			animationId,
			count,
		};

		// Cleanup function
		return () => {
			window.removeEventListener('resize', handleResize);
			visibilityObserver.disconnect();
			cancelAnimationFrame(animationId);

			if (sceneRef.current) {

				// Clean up Three.js objects
				sceneRef.current.scene.traverse((object) => {
					if (object instanceof THREE.Points) {
						object.geometry.dispose();
						if (Array.isArray(object.material)) {
							object.material.forEach((material) => material.dispose());
						} else {
							object.material.dispose();
						}
					}
				});

				sceneRef.current.renderer.dispose();

				if (containerRef.current && sceneRef.current.renderer.domElement) {
					containerRef.current.removeChild(
						sceneRef.current.renderer.domElement,
					);
				}
			}
		};
	}, [dotColor]);

	return (
		<div
			ref={containerRef}
			className={cn('pointer-events-none absolute inset-0 z-20', className)}
			{...props}
		/>
	);
}