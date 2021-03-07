import React, { useEffect } from 'react';
import { APP_NAME } from '../misc/constants';
import Navbar from './Home/Navbar';
import styles from '../styles/home.module.css';

type Props = {};

export default function Home(props: Props) {
	useEffect(() => {
		document.querySelector('body')!.style.background = '#000';
		setupGlobe();
		return () => {
			document.querySelector('body')!.style.background = '#1E1E2F';
		};
	}, []);

	return (
		<>
			<Navbar />
			<div className={`container ${styles.header}`}>
				<div className='row'>
					<div className='col-6'>
						<h1 className='display-1'>{APP_NAME}</h1>
						<p className='lead'>
							An <code>ad-less</code> anime and manga streaming service.
						</p>
						<a href='https://github.com/nyatto-io' className='btn btn-primary btn-sm mx-1' rel='noreferrer' target='_blank'>
							<i className='fab fa-github mr-1'></i>
							Source
						</a>
						<a href='https://github.com/avidianity' className='btn btn-info btn-sm mx-1' rel='noreferrer' target='_blank'>
							<i className='fas fa-user mr-1'></i>
							Creator
						</a>
					</div>
					<div className={`${styles['globe-container']}`}>
						<div id='globeViz'></div>
					</div>
				</div>
			</div>
		</>
	);
}

const setupGlobe = () => {
	const { THREE, ThreeGlobe } = window;

	// Gen random data
	const N = 20;

	const arcsData = [...Array(N).keys()].map(() => ({
		startLat: (Math.random() - 0.5) * 180,
		startLng: (Math.random() - 0.5) * 360,
		endLat: (Math.random() - 0.5) * 180,
		endLng: (Math.random() - 0.5) * 360,
		color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)],
	}));

	const Globe = new ThreeGlobe()
		.globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
		.arcsData(arcsData)
		.arcColor('color')
		.arcDashLength(0.4)
		.arcDashGap(4)
		.arcDashInitialGap(() => Math.random() * 5)
		.arcDashAnimateTime(1000);

	// Setup renderer
	const renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	const element = renderer.domElement as HTMLCanvasElement;
	document.getElementById('globeViz')!.appendChild(renderer.domElement);

	element.style.height = '100%';
	element.style.width = '100%';
	element.style.cursor = 'grab';

	// Setup scene
	const scene = new THREE.Scene();
	scene.add(Globe);
	scene.add(new THREE.AmbientLight(0xbbbbbb));
	scene.add(new THREE.DirectionalLight(0xffffff, 0.6));

	// Setup camera
	const camera = new THREE.PerspectiveCamera();
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.position.z = 500;
	camera.zoom = window.innerWidth <= 576 ? 1.75 : 2.25;
	camera.updateProjectionMatrix();

	// Add camera controls
	const tbControls = new THREE.TrackballControls(camera, renderer.domElement);
	tbControls.minDistance = 101;
	tbControls.rotateSpeed = 5;
	tbControls.zoomSpeed = 0.8;

	// Kick-off renderer
	(function animate() {
		// IIFE
		// Frame cycle
		tbControls.update();
		renderer.render(scene, camera);
		requestAnimationFrame(animate);
	})();
};
