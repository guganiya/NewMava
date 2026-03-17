import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

/* ─── Вспомогательные функции ─── */
const latLngToVec3 = (lat, lng, r = 1) => {
	const phi = ((90 - lat) * Math.PI) / 180
	const theta = ((lng + 90) * Math.PI) / 180
	return new THREE.Vector3(
		r * Math.sin(phi) * Math.cos(theta),
		r * Math.cos(phi),
		r * Math.sin(phi) * Math.sin(theta),
	)
}

// Координаты для фокуса камеры при загрузке
const COUNTRY_COORDS = {
	Turkmenistan: { lat: 38.9, lng: 59.5 },
	China: { lat: 35.8, lng: 104.1 },
	'United States of America': { lat: 37.0, lng: -95.7 },
}

// Алиасы имен для точного поиска в GeoJSON
const NAME_MAP = {
	Turkmenistan: ['Turkmenistan'],
	China: ['China'],
	'United States of America': [
		'United States of America',
		'United States',
		'USA',
	],
}

const GEOJSON_URL = '/world.geojson.txt'
const TARGET_COLOR = 0xad1c42 // Ваш красный
const LAND_COLOR = 0xe5e5e5 // Светло-серый
const BORDER_COLOR = 0xd1d1d1 // Цвет границ

export default function Globe3D({
	size = 500,
	targetCountry = 'Turkmenistan',
	interactive = true,
}) {
	const mount = useRef(null)
	const masterRef = useRef(null)
	const rafRef = useRef(null)

	// Для вращения мышкой (если нужно)
	const dragging = useRef(false)
	const lastMouse = useRef({ x: 0, y: 0 })
	const velocity = useRef({ x: 0, y: 0 })

	useEffect(() => {
		const W = size,
			H = size
		const scene = new THREE.Scene()
		const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000)
		camera.position.z = 2.8

		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
		renderer.setSize(W, H)
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
		mount.current?.appendChild(renderer.domElement)

		const master = new THREE.Group()
		masterRef.current = master
		scene.add(master)

		// 1. Авто-поворот к выбранной стране
		const coords = COUNTRY_COORDS[targetCountry] || { lat: 0, lng: 0 }
		master.rotation.y = -coords.lng * (Math.PI / 180)
		master.rotation.x = coords.lat * (Math.PI / 180) * 0.5

		// 2. Основа глобуса
		master.add(
			new THREE.Mesh(
				new THREE.SphereGeometry(1, 64, 64),
				new THREE.MeshPhongMaterial({
					color: 0xffffff,
					transparent: true,
					opacity: 0.1,
					shininess: 5,
				}),
			),
		)

		// 3. Сетка координат (опционально, для красоты)
		const gridMat = new THREE.LineBasicMaterial({
			color: 0xcccccc,
			transparent: true,
			opacity: 0.1,
		})
		for (let lat = -80; lat <= 80; lat += 20) {
			const pts = []
			for (let lng = 0; lng <= 360; lng += 5)
				pts.push(latLngToVec3(lat, lng - 90, 1.001))
			master.add(
				new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat),
			)
		}

		// 4. Отрисовка стран
		const borderMat = new THREE.LineBasicMaterial({
			color: BORDER_COLOR,
			transparent: true,
			opacity: 0.4,
		})
		const normalMat = new THREE.MeshBasicMaterial({
			color: LAND_COLOR,
			side: THREE.DoubleSide,
		})
		const activeMat = new THREE.MeshBasicMaterial({
			color: TARGET_COLOR,
			side: THREE.DoubleSide,
		})

		fetch(GEOJSON_URL)
			.then(r => r.json())
			.then(geojson => {
				geojson.features.forEach(f => {
					const nameInGeo = f.properties.name || f.properties.NAME
					const aliases = NAME_MAP[targetCountry] || [targetCountry]
					const isTarget = aliases.includes(nameInGeo)
					const currentMat = isTarget ? activeMat : normalMat

					const polys =
						f.geometry.type === 'Polygon'
							? [f.geometry.coordinates]
							: f.geometry.type === 'MultiPolygon'
								? f.geometry.coordinates
								: []

					polys.forEach(poly => {
						// Рисуем границы (линии)
						poly.forEach(ring => {
							const pts = ring.map(([lng, lat]) =>
								latLngToVec3(lat, lng, 1.002),
							)
							master.add(
								new THREE.Line(
									new THREE.BufferGeometry().setFromPoints(pts),
									borderMat,
								),
							)
						})

						// Исправленная заливка (ShapeGeometry решает проблему лишних пятен)
						const shape = new THREE.Shape()
						const outerRing = poly[0]
						outerRing.forEach(([lng, lat], i) => {
							if (i === 0) shape.moveTo(lng, lat)
							else shape.lineTo(lng, lat)
						})

						// Обработка внутренних отверстий (дырок)
						for (let i = 1; i < poly.length; i++) {
							const hole = new THREE.Path()
							poly[i].forEach(([lng, lat], j) => {
								if (j === 0) hole.moveTo(lng, lat)
								else hole.lineTo(lng, lat)
							})
							shape.holes.push(hole)
						}

						const geometry = new THREE.ShapeGeometry(shape)
						const posAttr = geometry.getAttribute('position')
						for (let i = 0; i < posAttr.count; i++) {
							const vec = latLngToVec3(posAttr.getY(i), posAttr.getX(i), 1.001)
							posAttr.setXYZ(i, vec.x, vec.y, vec.z)
						}
						posAttr.needsUpdate = true
						master.add(new THREE.Mesh(geometry, currentMat))
					})
				})
			})

		scene.add(new THREE.AmbientLight(0xffffff, 1.2))

		// Интерактив (Drag)
		const onMouseDown = e => {
			dragging.current = true
			lastMouse.current = { x: e.clientX, y: e.clientY }
		}
		const onMouseUp = () => {
			dragging.current = false
		}
		const onMouseMove = e => {
			if (!dragging.current || !interactive) return
			velocity.current.x = (e.clientX - lastMouse.current.x) * 0.005
			velocity.current.y = (e.clientY - lastMouse.current.y) * 0.005
			lastMouse.current = { x: e.clientX, y: e.clientY }
		}

		if (mount.current) {
			mount.current.addEventListener('mousedown', onMouseDown)
			window.addEventListener('mouseup', onMouseUp)
			window.addEventListener('mousemove', onMouseMove)
		}

		// 5. Анимация вращения
		const animate = () => {
			if (dragging.current) {
				master.rotation.y += velocity.current.x
				master.rotation.x += velocity.current.y
			} else {
				velocity.current.x *= 0.95
				velocity.current.y *= 0.95
				// Постоянное вращение
				master.rotation.y += 0.0015 + velocity.current.x
				master.rotation.x += velocity.current.y
			}

			renderer.render(scene, camera)
			rafRef.current = requestAnimationFrame(animate)
		}
		animate()

		return () => {
			cancelAnimationFrame(rafRef.current)
			renderer.dispose()
			if (mount.current) {
				mount.current.removeEventListener('mousedown', onMouseDown)
				window.removeEventListener('mouseup', onMouseUp)
				window.removeEventListener('mousemove', onMouseMove)
				mount.current.innerHTML = ''
			}
		}
	}, [size, targetCountry, interactive])

	return (
		<div
			ref={mount}
			style={{
				width: size,
				height: size,
				cursor: interactive ? 'grab' : 'default',
			}}
		/>
	)
}
