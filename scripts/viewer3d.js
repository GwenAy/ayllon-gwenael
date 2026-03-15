// ===== VIEWER 3D — Colonnes index | Three.js r165 ES modules =====
import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';

document.querySelectorAll('.canvas-3d').forEach((canvas, index) => {

    const direction = index === 0 ? 1 : -1;
    const modelPath = canvas.dataset.model;

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(1, 2, 3);
    scene.add(dirLight1);
    const dirLight2 = new THREE.DirectionalLight(0x82368c, 0.4);
    dirLight2.position.set(-2, -1, -1);
    scene.add(dirLight2);

    const loader = new STLLoader();
    let mesh;

    loader.load(modelPath, geometry => {
        geometry.computeBoundingBox();
        geometry.center();

        const bbox = new THREE.Box3().setFromObject(new THREE.Mesh(geometry));
        const size = new THREE.Vector3();
        bbox.getSize(size);
        const scale = 3 / Math.max(size.x, size.y, size.z);

        const material = new THREE.MeshStandardMaterial({ color: 0x82368c, metalness: 0.3, roughness: 0.4 });
        mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(scale, scale, scale);
        mesh.rotation.x = -Math.PI / 2;
        scene.add(mesh);
    });

    function resize() {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }

    resize();
    window.addEventListener('resize', resize);

    function animate() {
        requestAnimationFrame(animate);
        if (mesh) mesh.rotation.z += 0.005 * direction;
        renderer.render(scene, camera);
    }
    animate();
});
