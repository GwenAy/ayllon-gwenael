// ===== VIEWERS HOME — Fournaise, B12, Merch | Three.js r165 ES modules =====
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function createViewer({ canvasId, modelPath, cameraPos, scale, offsetY, fov = 75, onLoaded }) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(fov, canvas.offsetWidth / canvas.offsetHeight, 0.1, 1000);
    camera.position.set(...cameraPos);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;

    const loader = new GLTFLoader();
    loader.load(
        modelPath,
        (gltf) => {
            const model = gltf.scene;
            model.traverse((child) => {
                if (child.isMesh && child.material) {
                    const mats = Array.isArray(child.material) ? child.material : [child.material];
                    mats.forEach(mat => {
                        mat.transparent = true;
                        mat.alphaTest = 0;
                        mat.side = THREE.DoubleSide;
                        mat.depthWrite = true;
                        if (mat.map) { mat.map.colorSpace = THREE.SRGBColorSpace; mat.map.needsUpdate = true; mat.needsUpdate = true; }
                    });
                }
            });
            scene.add(model);

            if (onLoaded) {
                onLoaded(model);
            } else {
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                model.position.sub(center);
                if (offsetY) model.position.y += offsetY;
                if (scale) model.scale.set(scale, scale, scale);
            }
        },
        (p) => console.log(canvasId + ' — Chargement: ' + Math.round(p.loaded / p.total * 100) + '%'),
        (e) => console.error('❌ Erreur ' + canvasId + ':', e)
    );

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
    });
}

// FOURNAISE — bouteille
createViewer({
    canvasId: 'canvas-fournaise',
    modelPath: './assets/3D/bouteille-fournaise.glb',
    cameraPos: [0, 0, 30],
    scale: 0.4
});

// B12 — présentoir affiche
createViewer({
    canvasId: 'canvas-b12',
    modelPath: './assets/3D/presentoir-affiche-B12-v3.glb',
    cameraPos: [5, 0, 7],
    scale: 6,
    offsetY: -3
});

// MERCH — pull (logique de cadrage différente : fit automatique par taille de bounding box)
createViewer({
    canvasId: 'canvas-merch',
    modelPath: './assets/3D/pull_val.glb',
    cameraPos: [0, 1.5, 5],
    fov: 50,
    onLoaded: (model) => {
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        model.position.set(-center.x, -center.y, -center.z);
        const scale = 4 / Math.max(size.x, size.y, size.z);
        model.scale.set(scale, scale, scale);
    }
});