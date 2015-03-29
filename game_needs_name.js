
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var cubes = [];

function newCurve() {
  return new THREE.QuadraticBezierCurve3(
    new THREE.Vector3( -4.0, -3, 0 ),  //change this start point to the tip of the gun
    new THREE.Vector3( (Math.random() * 20.0) - 10, Math.random() * 20, -20 ),
    new THREE.Vector3( 4.0, -3, -100 ) // change this to the target position
  );
}

setInterval(function(){
    var geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );

    var color = '#' + (function co(lor){   return (lor +=
[0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
&& (lor.length == 6) ?  lor : co(lor); })('');

    var material = new THREE.MeshBasicMaterial( { color: color } );
    var cube = new THREE.Mesh( geometry, material );
    cube.x = Math.random();
    cube.y = Math.random();

    cube.curve = newCurve();
    cube.curveLocation = 0;

    cubes.push(cube);
    scene.add( cube );
    console.log(cubes.length);
}, 100)

camera.position.z = 5;

var point;
var render = function () {
  requestAnimationFrame( render );

  for (var i=0; i < cubes.length; i++){
      var cube = cubes[i];
      cube.rotation.x += 0.1;
      cube.rotation.y += 0.1;
      cube.rotation.z += 0.1;

      cube.curveLocation += 0.001;
      point = cube.curve.getPoint(cube.curveLocation);

      cube.position.x = point.x
      cube.position.y = point.y
      cube.position.z = point.z
  }
  renderer.render(scene, camera);
};
render();