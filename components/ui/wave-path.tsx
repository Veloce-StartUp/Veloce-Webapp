'use client';
import React from 'react';
import { cn } from '@/lib/utils';
import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

type WWavePathProps = React.ComponentProps<'div'>;

/** How hard the page can set the line ringing: any more and it would leave its 300px canvas. */
const MAX_SCROLL_PULL = 200;
/** How far a tap plucks the line. */
const TAP_PLUCK = 110;

const isTouchOnly = () => ScrollTrigger.isTouch === 1;

export function WavePath({ className, ...props }: WWavePathProps) {
	const container = useRef<HTMLDivElement>(null);
	const path = useRef<SVGPathElement>(null);
	let progress = 0;
	let x = 0.2;
	let time = Math.PI / 2;
	let reqId: number | null = null;
	let width = 0;

	useEffect(() => {
		// The curve spans the full width of the line's own container. Measured only when that changes:
		// reading it on every frame of the wobble would force the whole page to lay out each time.
		const observer = new ResizeObserver(([entry]) => {
			width = entry.contentRect.width;
			setPath(progress);
		});
		observer.observe(container.current!);
		return () => observer.disconnect();
	}, []);

	// Phones have no cursor to bend the line, so it rings as the page moves past instead.
	useGSAP(
		() => {
			if (!isTouchOnly() || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

			x = 0.5;
			ScrollTrigger.create({
				trigger: container.current,
				start: 'top bottom',
				end: 'bottom top',
				onUpdate: (self) => {
					if (!self.isActive) return;
					progress = gsap.utils.clamp(-MAX_SCROLL_PULL, MAX_SCROLL_PULL, progress + self.getVelocity() / 130);
					if (!reqId) animateOut();
				},
				onToggle: (self) => {
					// Nobody can see it ringing once it has left the screen.
					if (self.isActive || !reqId) return;
					cancelAnimationFrame(reqId);
					resetAnimation();
					setPath(0);
				},
			});
		},
		{ scope: container },
	);

	const setPath = (progress: number) => {
		if (path.current) {
			path.current.setAttributeNS(
				null,
				'd',
				`M0 100 Q${width * x} ${100 + progress * 0.6}, ${width} 100`,
			);
		}
	};

	const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

	// A tap also fires stray mouse events, which would stop the line ringing or make it jump.
	const manageMouseEnter = () => {
		if (isTouchOnly()) return;
		if (reqId) {
			cancelAnimationFrame(reqId);
			resetAnimation();
		}
	};

	const manageMouseMove = (e: React.MouseEvent) => {
		if (isTouchOnly()) return;
		const { movementY, clientX } = e;
		if (path.current) {
			const pathBound = path.current.getBoundingClientRect();
			x = (clientX - pathBound.left) / pathBound.width;
			progress += movementY;
			setPath(progress);
		}
	};

	const manageMouseLeave = () => {
		if (isTouchOnly()) return;
		animateOut();
	};

	const manageTap = (e: React.TouchEvent) => {
		if (!path.current) return;
		const pathBound = path.current.getBoundingClientRect();
		x = (e.touches[0].clientX - pathBound.left) / pathBound.width;
		progress = TAP_PLUCK;
		// From the start of the swing, so the line rises out of rest rather than jumping to full height.
		time = 0;
		if (!reqId) animateOut();
	};

	const animateOut = () => {
		const newProgress = progress * Math.sin(time);
		progress = lerp(progress, 0, 0.025);
		time += 0.2;
		setPath(newProgress);
		if (Math.abs(progress) > 0.75) {
			reqId = requestAnimationFrame(animateOut);
		} else {
			resetAnimation();
		}
	};

	const resetAnimation = () => {
		time = Math.PI / 2;
		progress = 0;
		reqId = null;
	};

	return (
		<div ref={container} className={cn('relative h-px w-full', className)} {...props}>
			<div
				onMouseEnter={manageMouseEnter}
				onMouseMove={manageMouseMove}
				onMouseLeave={manageMouseLeave}
				onTouchStart={manageTap}
				className="relative -top-5 z-10 h-10 w-full hover:-top-[150px] hover:h-[300px]"
			/>
			<svg className="absolute -top-[100px] h-[300px] w-full">
				<path ref={path} className="fill-none stroke-current" strokeWidth={2} />
			</svg>
		</div>
	);
}
