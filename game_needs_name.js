var superDuper = this;
var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0, -10, 80)
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
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

function newCurve(start, end) {
  return new THREE.QuadraticBezierCurve3(
    start,
    new THREE.Vector3( (Math.random() * 20.0) - 10, Math.random() * 20, -20 ),
    end
  );
}

setInterval(function(){
  var cube = Math.random() > 0.5 ? slowCube() : fastCube();

  cubes.push(cube);
  scene.add( cube.mesh );
  console.log(cubes.length);
}, 1000)


function Cube() {
  var self = this;

  var geometry = new THREE.BoxGeometry( 1.2, 1.2, 1.2 );
  var color = '#' + (function co(lor){   return (lor +=
[0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
&& (lor.length == 6) ?  lor : co(lor); })('');

  var material = new THREE.MeshBasicMaterial( { color: color } );

  this.mesh = new THREE.Mesh( geometry, material );

  this.x = Math.random();
  this.y = Math.random();

  var startPoint = new THREE.Vector3( (Math.random() * 10) - 5, -3, 0 ); //change this start point to the tip of the gun
  var endPoint = new THREE.Vector3( 4.0, -3, -100 ); // change this to the target position

  this.curve = newCurve(startPoint, endPoint);

  domEvents.addEventListener(
    this.mesh,
    'click',
    function() {
      goBoom(self.mesh)
      loc = cubes.indexOf(self)
      self.mesh.material.color = 0;
      self.velocity = 0.1; //make it go fast and disappear from the scene
    }, false);

  this.curveLocation = 0;
}

function slowCube() {
  var cube = new Cube();
  cube.velocity = 0.0005;
  return cube;
}

function fastCube() {
  var cube = new Cube();
  cube.velocity = 0.01;
  return cube;
}

camera.position.z = 5;

var point;
var render = function () {
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
  }
  renderer.render(scene, camera);
};
render();