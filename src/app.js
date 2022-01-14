import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { VRButton } from "three/examples/jsm/webxr/VRButton.js"
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js"
import { XRHandModelFactory } from "three/examples/jsm/webxr/XRHandModelFactory.js"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'


class App {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      60,
      innerWidth / innerHeight,
      0.1,
      100
    )
    this.camera.position.set(-8, 2.55, 0.66)
    this.initRenderer()
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.target = new THREE.Vector3(0, 1.08, 0)
    this.controls.update()

    this.scene = new THREE.Scene()
    this.scene.add(new THREE.GridHelper(10, 10))

    this.sceneSetup()

    this.render()

    this.initVR()

    document.body.appendChild(this.vrButton)


    const scene = this.scene

    const gltfLoader = new GLTFLoader()

    // Рендеринг учителя
    gltfLoader.load( 'models/teacher/Teacher_01.gltf', ( gltf ) => {

      gltf.scene.position.set(43.45, -11.2, -5)
      gltf.scene.rotation.y = -1.5708

      scene.teacher = gltf.scene

      scene.add( gltf.scene )
    }, 
      function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      function ( error ) {

        console.error( error )

      } )

    document.addEventListener('keydown', this.onTyping.bind(this))
  }

  onTyping(e) {
    var keyCode = e.which

    console.log(keyCode)

    if (keyCode == 38) {
        this.scene.teacher.position.x += 1
        this.scene.teacher.rotation.y = 1.5708
    } else if (keyCode == 40) {
        this.scene.teacher.position.x -= 1
        this.scene.teacher.rotation.y = -1.5708
    } else if (keyCode == 39) {
        this.scene.teacher.position.z += 1
        this.scene.teacher.rotation.y = 0
    } else if (keyCode == 37) {
        this.scene.teacher.position.z -= 1
        this.scene.teacher.rotation.y = 3.1415
    }
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
      "./examples/models/fbx/"
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
    this.renderer.setSize(innerWidth, innerHeight)

    // console.log(this.camera.position)
  }

  sceneSetup() {
    // Important for view textures
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.5))
  }

  render() {
    const scene = this.scene

    const gltfLoader = new GLTFLoader()

    // Рендеринг школьного класса
    gltfLoader.load( 'models/japanese_classroom/scene.gltf', ( gltf ) => {

      // gltf.scene.scale.set(.2, .2, .2)
      // gltf.scene.position.set(28, 0, 26)

      var box = new THREE.Box3().setFromObject( gltf.scene );
      var center = new THREE.Vector3();
      box.getCenter( center );
      gltf.scene.position.sub( center ); // center the model

      scene.add( gltf.scene )

    }, 
      function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      function ( error ) {

        console.error( error )

      } )


    // Рендеринг надписи
    this.print('Здравствуй, школа!', {x: 47.45, y: 2.65, z: -2.55, rot: -1.5708})

  }

  print(text, position = {x: 0, y: 0, z: 0, rot: 0}) {
    const scene = this.scene

    const loader = new FontLoader()

    loader.load('fonts/Roboto_Regular.json', function (font) {
      const geometry = new TextGeometry(text, {
        font: font,
        size: 1.2,
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
