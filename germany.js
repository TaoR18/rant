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
	z: 0,
      },
      eye: {
        x:3.,
        y:3.,
        z:20.,
      },
    },
  };

var heights = [];
var colors = [];
function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
	var vert = [];
	var regions = [];	
	var region = [];
	var verts = [];
	var hs = [];
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
			var test = allText.split(';');
			for (i=0; i<test.length-1; i++){
					regions.push(test[i]);
				}
			for (i=0; i<regions.length; i++){
					region.push(regions[i].split(':'));
				}
			for (i=0; i<region.length; i++){
				for(j=0; j<region[i].length; j++){
					verts.push(region[i][j].split(','));
}
}
			for (i=0; i<verts.length; i++){
				vert[i] = [];
				for(j=0; j<verts[i].length; j++){
					vert[i][j] = parseFloat(verts[i][j]);


}
} 
			hs = test[test.length-1].split(',');
			for (i=0; i<hs.length; i++){
				heights.push(parseFloat(hs[i]));
}

			

					}
            }
        }
    
	rawFile.send(null);
	return vert;

}
var test = [];
test = readTextFile("file:///home/sdbv/Desktop/HITS_project/egypt_4.txt");
var DEFAULT_VERT = [];
var stride = 8;
var ptlength = 2;
var num = test.length;
for (var i = 0; i < num/2; i++){
colors[i] = [];
colors[i].push(Math.random());
colors[i].push(Math.random());
colors[i].push(Math.random());
colors[i].push(1);
}
for (var j = 0; j < num; j++){
DEFAULT_VERT[j] = [];
for (var i = 0; i < test[j].length; i = i + ptlength){
	DEFAULT_VERT[j].push(test[j][i]-12);
	DEFAULT_VERT[j].push(test[j][i+1]-51);
	DEFAULT_VERT[j].push(0);
	DEFAULT_VERT[j].push(1);
	DEFAULT_VERT[j].push(colors[Math.floor(j/2)][0]);
	DEFAULT_VERT[j].push(colors[Math.floor(j/2)][1]);
	DEFAULT_VERT[j].push(colors[Math.floor(j/2)][2]);
	DEFAULT_VERT[j].push(colors[Math.floor(j/2)][3]);
}
for (var i = 0; i < test[j].length; i = i + ptlength){
	DEFAULT_VERT[j].push(test[j][i]-12);
	DEFAULT_VERT[j].push(test[j][i+1]-51);
	DEFAULT_VERT[j].push(heights[Math.floor(j/2)]);
	DEFAULT_VERT[j].push(1);
	DEFAULT_VERT[j].push(colors[Math.floor(j/2)][0]);
	DEFAULT_VERT[j].push(colors[Math.floor(j/2)][1]);
	DEFAULT_VERT[j].push(colors[Math.floor(j/2)][2]);
	DEFAULT_VERT[j].push(colors[Math.floor(j/2)][3]);
}

}


//inside first and then border
var DEFAULT_INDICES = [];
for (var j = 0; j < num; j++){
if (j % 2 == 0){
DEFAULT_INDICES[j] = new Uint32Array(test[j].length);
for (var m = 0; m < test[j].length; m++){
	DEFAULT_INDICES[j][m]=m;
}
}
if (j % 2 == 1){
DEFAULT_INDICES[j] = new Uint32Array(3*test[j].length);
for (var m = 0; m < test[j].length/2-1; m++){
	DEFAULT_INDICES[j][(m)*6] = m;
	DEFAULT_INDICES[j][(m)*6 + 1] = m+1;
	DEFAULT_INDICES[j][(m)*6 + 2] = m+test[j].length/2;
	DEFAULT_INDICES[j][(m)*6 + 3] = m+1;
	DEFAULT_INDICES[j][(m)*6 + 4] = m+1+test[j].length/2;
	DEFAULT_INDICES[j][(m)*6 + 5] = m+test[j].length/2;
}
	DEFAULT_INDICES[j][(test[j].length/2-1)*6] = test[j].length/2-1;
	DEFAULT_INDICES[j][(test[j].length/2-1)*6 +1] = 0;
	DEFAULT_INDICES[j][(test[j].length/2-1)*6 +2] =test[j].length-1;
	DEFAULT_INDICES[j][(test[j].length/2-1)*6 +3] = 0;
	DEFAULT_INDICES[j][(test[j].length/2-1)*6 +4] =test[j].length/2;
	DEFAULT_INDICES[j][(test[j].length/2-1)*6 +5] =test[j].length-1;
}
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
      state.gl.clear(state.gl.COLOR_BUFFER_BIT | state.gl.DEPTH_BUFFER_BIT);
  for (k =182; k <184; k++){
    var v = (args && args.v) ? args.v : DEFAULT_VERT[k];
    var vi = (args && args.vi) ? args.vi : DEFAULT_INDICES[k];
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
    mat4.rotateZ(mvp, mvp, state.app.angle.z);

    state.gl.useProgram(state.program);

    state.gl.uniformMatrix4fv(uMVPMatrix, false, mvp);
	var ext = state.gl.getExtension('OES_element_index_uint');
	state.gl.drawElements(state.gl.TRIANGLES, n, state.gl.UNSIGNED_INT, 0);
  }
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
      state.app.angle.z = state.app.angle.z + dx;
	
    }
    // update the last mouse position
    state.ui.mouse.lastX = x;
    state.ui.mouse.lastY = y;
  }
})(window || this);
