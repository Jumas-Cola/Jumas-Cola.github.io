import * as THREE from 'https://cdn.skypack.dev/three'
import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js"
import { VRButton } from "https://threejs.org/examples/jsm/webxr/VRButton.js"
import { XRControllerModelFactory } from "https://threejs.org/examples/jsm/webxr/XRControllerModelFactory.js"
import { XRHandModelFactory } from "https://threejs.org/examples/jsm/webxr/XRHandModelFactory.js"
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js'
import { TextGeometry } from 'https://threejs.org/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'https://threejs.org/examples/jsm/loaders/FontLoader.js'


class App {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      60,
      innerWidth / innerHeight,
      0.1,
      100
    )
    this.camera.position.set(-2, 1.8, 5)
    this.initRenderer()
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target = new THREE.Vector3(0, 1.08, 0)
    this.controls.update()

    //Text Mesh
    this.text = 'Hello'

    this.scene = new THREE.Scene()
    this.scene.add(new THREE.GridHelper(10, 10))

    this.sceneSetup()

    this.render()

    this.initVR()

    document.body.appendChild(this.vrButton)

    document.addEventListener('keydown', this.onTyping.bind(this))
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(innerWidth, innerHeight)
    this.renderer.setClearColor(0x444444)
    this.renderer.setAnimationLoop((e) => this.update(e))
    this.renderer.setPixelRatio(devicePixelRatio)
    this.renderer.xr.enabled = true
    this.renderer.shadowMap.enabled = true
    document.body.appendChild(this.renderer.domElement)
  }

  initVR() {
    const controllerModelFactory = new XRControllerModelFactory()
    const handModelFactory = new XRHandModelFactory().setPath(
      "https://threejs.org/examples/models/fbx/"
    )

    const addControls = (number) => {
      const controller = this.renderer.xr.getController(number)
      this.scene.add(controller)
      const grip = this.renderer.xr.getControllerGrip(number)
      grip.add(controllerModelFactory.createControllerModel(grip))
      this.scene.add(grip)
      const hand = this.renderer.xr.getHand(number)
      hand.add(handModelFactory.createHandModel(hand))

      this.scene.add(hand)
      return { controller, grip, hand }
    }
    this.zero = addControls(0)
    this.one = addControls(1)
    this.one.hand.addEventListener("pinchstart", (e) => {
      this.scene.background = new THREE.Color(
        Math.floor(Math.random() * 0xffffff)
      )
    })
    this.zero.hand.addEventListener("pinchstart", (e) => {
      this.scene.background = new THREE.Color(0)
    })
    this.vrButton = VRButton.createButton(this.renderer)
  }

  update(e) {
    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  sceneSetup() {
    // Important for view textures
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5))
  }

  render() {
    const scene = this.scene

    const gltfLoader = new GLTFLoader()

    gltfLoader.load( 'src/models/a_class_room.glb', ( gltf ) => {

      gltf.scene.scale.set(5, 5, 5)

      scene.add( gltf.scene )

    }, 
    function ( xhr ) {

      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    function ( error ) {

      console.error( error )

    } )


    //Hello Text
    const textLoader = new FontLoader()
    const text = this.text

    textLoader.load('src/fonts/Roboto_Regular.json', function (font) {
        const geometry = new TextGeometry(text, {
            font: font,
            size: 0.2,
            height: 0.1,
            curveSegments: 10,
            bevelEnabled: false,
            bevelOffset: 0,
            bevelSegments: 1,
            bevelSize: 0.3,
            bevelThickness: 1
        });

        const materials = [
            new THREE.MeshPhongMaterial({ color: 0xff6600 }), // front
            new THREE.MeshPhongMaterial({ color: 0x0000ff }) // side
        ];

        const textMesh = new THREE.Mesh(geometry, materials);

        textMesh.castShadow = true
        textMesh.position.y = 1.3
        textMesh.position.x = -1.2
        textMesh.position.z = 1
        textMesh.rotation.y = 0

        scene.textMesh = textMesh

        scene.add(textMesh)
    })
  }

  onTyping(e) {
    this.scene.textMesh.geometry.dispose();
    this.scene.remove( this.scene.textMesh );

    const scene = this.scene

    if (e.key === 'Enter') {
      this.text = ''
    } else {
      this.text += e.key
    }

    const text = this.text
    const textLoader = new FontLoader()

    textLoader.load('src/fonts/Roboto_Regular.json', function (font) {
        const geometry = new TextGeometry(text, {
            font: font,
            size: 0.2,
            height: 0.1,
            curveSegments: 10,
            bevelEnabled: false,
            bevelOffset: 0,
            bevelSegments: 1,
            bevelSize: 0.3,
            bevelThickness: 1
        });

        const materials = [
            new THREE.MeshPhongMaterial({ color: 0xff6600 }), // front
            new THREE.MeshPhongMaterial({ color: 0x0000ff }) // side
        ];

        const textMesh = new THREE.Mesh(geometry, materials);

        textMesh.castShadow = true
        textMesh.position.y = 1.3
        textMesh.position.x = -1.2
        textMesh.position.z = 1
        textMesh.rotation.y = 0

        scene.textMesh = textMesh

        scene.add(textMesh)
    })
  }

  print(text, position = {x: 0, y: 0, z: 0, rot: 0}) {
    const scene = this.scene

    const loader = new FontLoader()

    loader.load('src/fonts/Roboto_Regular.json', function (font) {
        const geometry = new TextGeometry(text, {
            font: font,
            size: 0.2,
            height: 0.1,
            curveSegments: 10,
            bevelEnabled: false,
            bevelOffset: 0,
            bevelSegments: 1,
            bevelSize: 0.3,
            bevelThickness: 1
        });

        const materials = [
            new THREE.MeshPhongMaterial({ color: 0xff6600 }), // front
            new THREE.MeshPhongMaterial({ color: 0x0000ff }) // side
        ];

        const textMesh = new THREE.Mesh(geometry, materials);

        textMesh.castShadow = true
        textMesh.position.y = position.y
        textMesh.position.x = position.x
        textMesh.position.z = position.z
        textMesh.rotation.y = position.rot

        scene.add(textMesh)
    })
  }
}

const app = new App()
