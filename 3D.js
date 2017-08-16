(function(global) {

  /*
  * Constants and Main
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  var state = {
    gl: null,
    program: null,
    ui: {
      dragging: false,
      mouse: {
        lastX: -1,
        lastY: -1,
      },
      pressedKeys: {},
    },
    animation: {},
    app: {
      angle: {
        x: 0,
        y: 0,
      },
      eye: {
        x:2.,
        y:2.,
        z:7.,
      },
    },
  };


function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
	var vert = [];
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
				var tests = allText.split(',');
				for (i=0; i<tests.length;i++){
					vert.push(parseFloat(tests[i]));
					}
            }
        }
    }
    rawFile.send(null);
	return vert;
}
var test = [];
test = readTextFile("file:///home/sdbv/Desktop/HITS_project/triangles2.txt");
var test1 = [];
test1 = readTextFile("file:///home/sdbv/Desktop/HITS_project/israel_borders.txt");
var DEFAULT_VERT = [];
var INDICES = [];
var height = 1;
var stride = 8;
var ptlength = 2;
var length = test.length;
var numpt = length/ptlength;
for (var i = 0; i < length; i = i + ptlength){
	DEFAULT_VERT.push(34.5-test[i]);
	DEFAULT_VERT.push(32.5-test[i+1]);
	DEFAULT_VERT.push(0);
	DEFAULT_VERT.push(1);
	DEFAULT_VERT.push(1);
	DEFAULT_VERT.push(0);
	DEFAULT_VERT.push(1);
	DEFAULT_VERT.push(1);
}
for (var i = 0; i < length; i = i + ptlength){
	DEFAULT_VERT.push(34.5-test[i]);
	DEFAULT_VERT.push(32.5-test[i+1]);
	DEFAULT_VERT.push(height);
	DEFAULT_VERT.push(1);
	DEFAULT_VERT.push(1);
	DEFAULT_VERT.push(0);
	DEFAULT_VERT.push(1);
	DEFAULT_VERT.push(1);
}


var blength = test1.length;
var bnumpt = blength/ptlength;
for (var i = 0; i < blength; i = i + ptlength){
	DEFAULT_VERT.push(34.5-test1[i]);
	DEFAULT_VERT.push(32.5-test1[i+1]);
	DEFAULT_VERT.push(0);
	DEFAULT_VERT.push(1);
	DEFAULT_VERT.push(1);
	DEFAULT_VERT.push(0);
	DEFAULT_VERT.push(1);
	DEFAULT_VERT.push(1);
}
for (var j = 0; j < blength; j = j + ptlength){ 
	DEFAULT_VERT.push(34.5-test1[j]);
	DEFAULT_VERT.push(32.5-test1[j+1]);
	DEFAULT_VERT.push(height);
	DEFAULT_VERT.push(1);
	DEFAULT_VERT.push(1);
	DEFAULT_VERT.push(0);
	DEFAULT_VERT.push(1);
	DEFAULT_VERT.push(1);
	
}




for (var m = 0; m < bnumpt-1; m++){
	INDICES.push(m+2*numpt);
	INDICES.push(m+1+2*numpt);
	INDICES.push(m+bnumpt+2*numpt);
	INDICES.push(m+1+2*numpt);
	INDICES.push(m+1+bnumpt+2*numpt);
	INDICES.push(m+bnumpt+2*numpt);
}
	INDICES.push(bnumpt-1+2*numpt);
	INDICES.push(2*numpt);
	INDICES.push(2*bnumpt-1+2*numpt);
	INDICES.push(2*numpt);
	INDICES.push(bnumpt+2*numpt);
	INDICES.push(2*bnumpt-1+2*numpt);

var DEFAULT_INDICES = new Uint32Array(2*numpt+6*bnumpt);
for (var m = 0; m < 2*numpt; m++){
	DEFAULT_INDICES[m]=m;
}
for (var k = 0; k < 6*bnumpt; k++){
	DEFAULT_INDICES[2*numpt+k] = INDICES[k];
}

  glUtils.SL.init({ callback:function() { main(); } });

  function main() {
    state.canvas = document.getElementById("glcanvas");
    state.gl = glUtils.checkWebGL(state.canvas);
    initCallbacks();
    initShaders();
    initGL();
    animate();
  }

  /*
  * Initialization
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function initCallbacks() {
    document.onkeydown = keydown;
    document.onkeyup = keyup;
    state.canvas.onmousedown = mousedown;
    state.canvas.onmouseup = mouseup;
    state.canvas.onmousemove = mousemove;
  }

  function initShaders() {
    var vertexShader = glUtils.getShader(state.gl, state.gl.VERTEX_SHADER, glUtils.SL.Shaders.v1.vertex),
      fragmentShader = glUtils.getShader(state.gl, state.gl.FRAGMENT_SHADER, glUtils.SL.Shaders.v1.fragment);
    state.program = glUtils.createProgram(state.gl, vertexShader, fragmentShader);
  }

  function initGL() {
    state.gl.clearColor(0,0,0,1);
    state.gl.enable(state.gl.DEPTH_TEST);
  }

  /*
  * Rendering / Drawing / Animation
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function animate() {
    state.animation.tick = function() {
      updateState();
      draw();
      requestAnimationFrame(state.animation.tick);
    };
    state.animation.tick();
  }

  function updateState() {
    var speed = 0.2;
    if (state.ui.pressedKeys[37]) {
      // left
      state.app.eye.x += speed;
    } else if (state.ui.pressedKeys[39]) {
      // right
      state.app.eye.x -= speed;
    } else if (state.ui.pressedKeys[40]) {
      // down
      state.app.eye.y += speed;
    } else if (state.ui.pressedKeys[38]) {
      // up
      state.app.eye.y -= speed;
    }
  }

  function draw(args) {
    var v = (args && args.v) ? args.v : DEFAULT_VERT;
    var vi = (args && args.vi) ? args.vi : DEFAULT_INDICES;
    var uMVPMatrix = state.gl.getUniformLocation(state.program, 'uMVPMatrix');
    var n = initVertexBuffers(v, vi).indices.length;
    var mvm = mat4.create();
    var pm = mat4.create();
    var mvp = mat4.create();

    mat4.perspective(pm,
      20, 1/1, 1, 100
    );
    mat4.lookAt(mvm,
      vec3.fromValues(state.app.eye.x,state.app.eye.y,state.app.eye.z),
      vec3.fromValues(0,0,0),
      vec3.fromValues(0,1,0)
    );
    mat4.copy(mvp, pm);
    mat4.multiply(mvp, mvp, mvm);
    mat4.rotateX(mvp, mvp, state.app.angle.x);
    mat4.rotateY(mvp, mvp, state.app.angle.y);

    state.gl.useProgram(state.program);
    state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);
    state.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);
	var ext = state.gl.getExtension('OES_element_index_uint');

	state.gl.drawElements(state.gl.TRIANGLES, n, state.gl.UNSIGNED_INT, 0);
  }

  function initVertexBuffers(v, i) {
    var vertices = new Float32Array(v);
    vertices.stride = 8;
    vertices.attributes = [
      {name:'aPosition', size:4, offset:0},
      {name:'aColor',    size:4, offset:4},
    ];
    vertices.n = vertices.length/vertices.stride;
    vertices.indices = i;
    state.program.renderBuffers(vertices, i);
    return vertices;
  }

  /*
  * UI Events
  * www.programmingtil.com
  * www.codenameparkerllc.com
  */
  function keydown(event) {
    state.ui.pressedKeys[event.keyCode] = true;
  }

  function keyup(event) {
    state.ui.pressedKeys[event.keyCode] = false;
  }

  function mousedown(event) {
    var x = event.clientX;
    var y = event.clientY;
    var rect = event.target.getBoundingClientRect();
    // If we're within the rectangle, mouse is down within canvas.
    if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
      state.ui.mouse.lastX = x;
      state.ui.mouse.lastY = y;
      state.ui.dragging = true;
    }
  }

  function mouseup(event) {
    state.ui.dragging = false;
  }

  function mousemove(event) {
    var x = event.clientX;
    var y = event.clientY;
    if (state.ui.dragging) {
      // The rotation speed factor
      // dx and dy here are how for in the x or y direction the mouse moved
      var factor = 10/state.canvas.height;
      var dx = factor * (x - state.ui.mouse.lastX);
      var dy = factor * (y - state.ui.mouse.lastY);
     
      // update the latest angle
	state.app.angle.x = state.app.angle.x + dy;
      state.app.angle.y = state.app.angle.y + dx;
	
    }
    // update the last mouse position
    state.ui.mouse.lastX = x;
    state.ui.mouse.lastY = y;
  }
})(window || this);
