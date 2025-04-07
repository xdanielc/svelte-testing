import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { scroll, animate, progress } from "motion";

export function scrambleText(text: string) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:',.<>?/";
    let scrambled = "";
    const clength = chars.length
    const tlength = text.length

    for (let i = 0; i < tlength; i++) {
        let randomChar = chars[Math.floor(Math.random() * clength)];
        scrambled += text[i] == ' ' ? ' ' : randomChar;
    }
    return scrambled
}
// return text.split('').sort(() => Math.random() - 0.5).join('');


export function cargaCamara(){
        // CAMARA
        // const camera = new THREE.PerspectiveCamera( 75, container.clientWidth / container.clientHeight, 0.1, 100);
        const camera = new THREE.PerspectiveCamera( 75,
            window.innerWidth / window.innerHeight,
            0.1,
            100,
        );
        camera.position.y = 0.5;
        camera.position.z = 4.5;
        return camera
}

export function carga3d(){
    // CAMARA
    // const camera = new THREE.PerspectiveCamera( 75, container.clientWidth / container.clientHeight, 0.1, 100);
    const camera = new THREE.PerspectiveCamera( 75,
        window.innerWidth / window.innerHeight,
        0.1,
        100,
    );
    camera.position.y = 0.5;
    camera.position.z = 4.5;
    
    // ESCENA
    const scene = new THREE.Scene();

    // LUCES
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 2);
    const directionalLight1 = new THREE.DirectionalLight(0xFFFFFF, 1.5)
    directionalLight1.target.position.set(-1.4, -2, 2);

    // MATERIAL
    const softColor = 0xcceeff
    const basicColor = 0x1e293b
    const materialBasicBlue = new THREE.MeshBasicMaterial( { color: basicColor } );
    const materialPhongBlue = new THREE.MeshPhongMaterial( { color: basicColor } );
    const materialBasic = new THREE.MeshBasicMaterial({ color: basicColor });
    const materialGood = new THREE.MeshStandardMaterial({ color: basicColor });
    const materialPBR = new THREE.MeshPhysicalMaterial({ color: softColor, reflectivity: 1, metalness: 1 });
    const matBrilli = new THREE.MeshPhongMaterial({color: 0xffffff, reflectivity: 1})
    // let mBasicoMono = new THREE.MeshPhongMaterial({color: 0x1f94bb, side: THREE.DoubleSide, reflectivity: 1, shininess: 50, specular: 0x222})
    let mBasicoMono = new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide, reflectivity: 1, shininess: 50, specular: 0x222})

    // GEOMETRIA
    const geometry = new THREE.BoxGeometry();

    // OBJETOS
    const cube = new THREE.Mesh(geometry, materialBasic);
    const cube2 = new THREE.Mesh(geometry, materialBasic);
    let tomeLogo : THREE.Object3D, mono : THREE.Object3D;
    
    // OUTLINER
    scene.add(cube);
    scene.add(cube2);
    cube.position.x = 4
    cube2.position.x = -2
    cube2.position.y = -2
    scene.add( directionalLight1 );
    scene.add( ambientLight );
    
    // RENDERER
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, powerPreference: 'low-power'});
    renderer.setPixelRatio(1.5);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    // renderer.setSize(container.clientWidth, container.clientHeight);
    // CAMBIAR TAMAÑO
    window.addEventListener( 'resize', onWindowResize );

    // CARGA OBJECTO
    const obj_loader = new OBJLoader();
    const rgbeLoader = new RGBELoader();
    const tx_loader = new THREE.TextureLoader()

    tx_loader.load('base_mono_2.png', (tx) => {
        tx.colorSpace = THREE.SRGBColorSpace;
        mBasicoMono.map = tx
    })

    async function loadObject() {
        const loader = new OBJLoader();
        try {
            const obj = await loader.loadAsync('mono.obj');
            obj.traverse((node) => {
                if (node instanceof THREE.Mesh) {
                    node.material = mBasicoMono;
                }
            });
            mono = obj;
            scene.add(obj);
        } catch (error) {
            console.error('Error loading object:', error);
        }
    }
    loadObject();

    async function cargaLogo() {
        try {
            // loadAsync returns the texture directly, not via callback
            const texture = await rgbeLoader.loadAsync('rosendal_plains_2_1k.hdr');
            
            // Now you can modify the texture directly
            texture.mapping = THREE.EquirectangularReflectionMapping;
            texture.generateMipmaps = true;
            texture.minFilter = THREE.LinearMipMapLinearFilter;
            
            obj_loader.load('tome_lp.obj',
                (object) => {
                    let mat = new THREE.MeshPhongMaterial({
                        color: 0xffffff, 
                        reflectivity: 1, 
                        envMap: texture
                    });
                    
                    object.traverse((child) => {
                        if (child instanceof THREE.Mesh) {
                            child.material = mat;
                        }
                    });
                    
                    tomeLogo = object;
                    scene.add(tomeLogo);
                    object.position.z = 3;
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
                },
                (error) => {
                    console.error('An error occurred:', error);
                }
            );
            } catch (error) {
                console.error('Error loading HDR texture:', error);
            }
        }
        cargaLogo()

        const clock = new THREE.Clock();
        
        function animateLoop() {
            requestAnimationFrame(animateLoop);
            const elapsedTime = clock.getElapsedTime();
            cube.rotation.x += 0.01;
            cube.position.y = Math.sin(elapsedTime)+2
            cube.rotation.z += 0.01;
            if (tomeLogo){
                tomeLogo.position.y = Math.sin(elapsedTime)*0.7
                tomeLogo.rotation.y = Math.sin(elapsedTime/2)*0.5
            }
            if(mono){
                mono.rotation.y = elapsedTime
            }
            cube2.position.x = (timelineCubo/961*4)-2
            cube2.position.y = -(timelineCubo/961*4)+2
            cube2.rotation.x = (timelineCubo/961*8)-2
            cube2.rotation.y = (timelineCubo/961*3)-2 + elapsedTime
            directionalLight1.position.setX(control.light_Infinite.x)
            directionalLight1.position.setY(control.light_Infinite.y)
            directionalLight1.position.setZ(control.light_Infinite.z)
            ambientLight.intensity = control.light_ambient.intensity
            renderer.render(scene, camera);
        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
        }

        animateLoop();

        scroll((progress, info) => {
            timelineCubo = info.y.current
        })

        return renderer

        // Esto en el archivo actual
        return () => {
            renderer.dispose();
        };
}