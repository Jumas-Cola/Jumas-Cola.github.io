import { HDRCubeTextureLoader } from "https://threejs.org/examples/jsm/loaders/HDRCubeTextureLoader.js";
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
import { VRButton } from "https://threejs.org/examples/jsm/webxr/VRButton.js";
import { XRControllerModelFactory } from "https://threejs.org/examples/jsm/webxr/XRControllerModelFactory.js";
import { XRHandModelFactory } from "https://threejs.org/examples/jsm/webxr/XRHandModelFactory.js";
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';

class App {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      60,
      innerWidth / innerHeight,
      0.1,
      100
    );
    this.camera.position.set(4, 1.7, 1);
    this.initRenderer();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target = new THREE.Vector3(0, 1.08, 0);

    this.scene = new THREE.Scene();
    this.scene.add(new THREE.GridHelper(10, 10));

    this.initHDR();

    this.loader = new GLTFLoader();

    this.renderScene();

    this.initVR();

    document.body.appendChild(this.vrButton);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setClearColor(0x444444);
    this.renderer.setAnimationLoop((e) => this.update(e));
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.xr.enabled = true;
    document.body.appendChild(this.renderer.domElement);
  }

  initVR() {
    const controllerModelFactory = new XRControllerModelFactory();
    const handModelFactory = new XRHandModelFactory().setPath(
      "https://threejs.org/examples/models/fbx/"
    );

    const addControls = (number) => {
      const controller = this.renderer.xr.getController(number);
      this.scene.add(controller);
      const grip = this.renderer.xr.getControllerGrip(number);
      grip.add(controllerModelFactory.createControllerModel(grip));
      this.scene.add(grip);
      const hand = this.renderer.xr.getHand(number);
      hand.add(handModelFactory.createHandModel(hand));

      this.scene.add(hand);
      return { controller, grip, hand };
    };
    this.zero = addControls(0);
    this.one = addControls(1);
    this.one.hand.addEventListener("pinchstart", (e) => {
      this.scene.background = new THREE.Color(
        Math.floor(Math.random() * 0xffffff)
      );
    });
    this.zero.hand.addEventListener("pinchstart", (e) => {
      this.scene.background = new THREE.Color(0);
    });
    this.vrButton = VRButton.createButton(this.renderer);
  }

  update(e) {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  initHDR() {
    this.renderer.physicallyCorrectLights = true;
    this.renderer.toneMapping = THREE.LinearToneMapping;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    const hdrUrls = [
      "px.hdr",
      "nx.hdr",
      "py.hdr",
      "ny.hdr",
      "pz.hdr",
      "nz.hdr"
    ];
    this.hdrCubeMap = new HDRCubeTextureLoader()
      .setPath("https://threejs.org/examples/textures/cube/pisaHDR/")
      .setDataType(THREE.UnsignedByteType)
      .load(hdrUrls, () => {
        this.hdrCubeRenderTarget = pmremGenerator.fromCubemap(this.hdrCubeMap);
        this.hdrCubeMap.magFilter = THREE.LinearFilter;
        this.hdrCubeMap.needsUpdate = true;
        this.worldEnvMap = this.hdrCubeRenderTarget.texture;
        this.scene.traverse((el) => {
          if (!el.material || el.material.noEnv) return;
          el.material.envMap = this.hdrCubeRenderTarget.texture;
          el.material.needsUpdate = true;
        });
      });
  }

  renderScene() {
    const scene = this.scene;

    this.loader.load( 'models/a_class_room.glb', function ( gltf ) {

      scene.add( gltf.scene );

    }, undefined, function ( error ) {

      console.error( error );

    } );
  }
}

const app = new App();
