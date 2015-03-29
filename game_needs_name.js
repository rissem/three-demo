var superDuper = this;
var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0, -10, 80)

var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 5;

var listener = new THREE.AudioListener();
var renderer = new THREE.WebGLRenderer();

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var domEvents  = new THREEx.DomEvents(camera, renderer.domElement);

Leap.loop(function(frame) {
  frame.hands.forEach(function(hand, index) {
    console.log("hands: ",arguments)
  });
});

var cubes = [];

var pewSound = new THREE.Audio( listener );
pewSound.load( 'sound/pew.mp3' );

var boomSound = new THREE.Audio( superDuper.listener );
boomSound.load( 'sound/boom.mp3' );

var goPew = function(mesh) {
  superDuper.pewSound.play()
}

var goBoom = function(mesh) {
  //LAAAAAAAAAAAAME -- Dan
  if (superDuper.boomSound.isPlaying) {
    superDuper.boomSound.stop()
  }
  superDuper.boomSound.play()
}

setInterval(function(){
  var cube = Math.random() > 0.5 ? slowCube() : fastCube();

  cubes.push(cube);
  scene.add( cube.mesh );
  console.log(cubes.length);
}, 1000)

function Cube(startPoint, endPoint) {
  var self = this;

  var geometry = new THREE.BoxGeometry( 1.2, 1.2, 1.2 );
  var color = '#' + (function co(lor) {
    return (
      lor += [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)]) && 
      (lor.length == 6)  ?  lor : co(lor);
    })('');

  var material = new THREE.MeshBasicMaterial( { color: color } );
  this.mesh = new THREE.Mesh( geometry, material );

  startPoint = startPoint || new THREE.Vector3( (Math.random() * 10) - 5, -3, 0 ); //change this start point to the tip of the gun
  endPoint = endPoint || new THREE.Vector3( 4.0, -3, -100 ); // change this to the target position

  this.curve = newCurve(startPoint, endPoint);
  this.curveLocation = 0;

  function newCurve(start, end) {
    return new THREE.QuadraticBezierCurve3(
      start,
      new THREE.Vector3( (Math.random() * 20.0) - 10, Math.random() * 20, -20 ),
      end
    );
  }

  domEvents.addEventListener(
    this.mesh, 
    'click',
    clickBoom,
    false);

  function clickBoom() {
    goBoom(self.mesh);
    self.explode();
  }

  this.remove = function() {
    domEvents.removeEventListener(
      self.mesh,
      'click',
      clickBoom,
      false
    );

    scene.remove(this.mesh);
    this.mesh.material.dispose();
    this.mesh.material = null;
    this.mesh.geometry.dispose();
    this.mesh.geometry = null;
    this.mesh = null;
  }

  this.explode = function() {
    var c, startPoint;

    this.remove();

    var index = cubes.indexOf(this);
    if(index > -1) cubes.splice(index, 1);

    startPoint = this.curve.getPoint(this.curveLocation);

    for(var i=0; i<4; i++) {
      c = fastCube(startPoint)
      cubes.push(c);
      scene.add(c.mesh);
    }
  }
}

function slowCube() {
  var cube = new Cube();
  cube.velocity = 0.0005;
  return cube;
}

function fastCube(startPoint, endPoint) {
  var cube = new Cube(startPoint, endPoint);
  cube.velocity = 0.01;
  return cube;
}

function render() {
  var point;
  requestAnimationFrame( render );

  for (var i=0; i < cubes.length; i++){
      var cube = cubes[i];
      cube.mesh.rotation.x += 0.1;
      cube.mesh.rotation.y += 0.1;
      cube.mesh.rotation.z += 0.1;

      cube.curveLocation += cube.velocity;
      point = cube.curve.getPoint(cube.curveLocation);

      cube.mesh.position.x = point.x
      cube.mesh.position.y = point.y
      cube.mesh.position.z = point.z

      if(point.z < -50) {
        cubes.splice(i, 1);
        cube.remove();
      }
  }
  renderer.render(scene, camera);
};
render();