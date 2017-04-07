var x,y,z;
var canv = document.getElementById("myCanvas");
var ctx = canv.getContext("2d");
var passtart = 5; //16*16
document.getElementById("go").onclick = draw;
document.getElementById("rst").onclick = function rst(){
	document.getElementById('zm').value=0.333;
	document.getElementById('xcoord').value=-0.5;
	document.getElementById('ycoord').value=0;
	draw();
};
function draw(){
	z=parseFloat(document.getElementById('zm').value);
	x=parseFloat(document.getElementById('xcoord').value);
	y=parseFloat(document.getElementById('ycoord').value);
	ctx.clearRect(0, 0, canv.width, canv.height);
	t0 = performance.now();
	setTimeout(render, 10, x,y,z,passtart);
};
function render(ix,iy,z,n){
	document.getElementById("antialias").checked ? nstop = -1 : nstop = 0;
	document.getElementById("fastrend").checked ? nstop = 2 : null;
	info = document.getElementById('status');
	if (n<nstop){
		var t1 = performance.now();
		info.style.color = "black";
		info.innerHTML = "Done"
		document.getElementById("txttime").innerHTML = "[ "+(Math.round(t1-t0-10)/1000)+" s. ]";
		return;
	}
	document.getElementById("txttime").innerHTML =  null;
	info.style.color = "red";
	info.innerHTML = "Rendering - Wait ...";
	sq=Math.pow(2,n);
	ks = Math.max (60, Math.floor(Math.log(z))*100 );
	zr=z*512;
	if (ks>2500) ks=2500;
	if (document.getElementById("fastrend").checked && ks>1000) ks=1000;
	for(pi=0;pi<512;pi+=sq){
		for(pj=0;pj<512;pj+=sq){
			if((pi/sq)%2!=0 || (pj/sq)%2!=0 || n>=passtart){
				a=b=0, k=ks;
				i=ix+(pi-256)/zr;
				j=-iy+(pj-256)/zr;
				for(;k--&&Math.pow(a,2)+Math.pow(b,2)<3;c=Math.pow(a,2)-Math.pow(b,2)+i,b=2*a*b+j,a=c){};
				ctx.fillStyle = `hsl(${k*2},100%,50%)`;
				ctx.fillRect(pi,pj,sq,sq)
			}
		}
	}
	setTimeout(render, 50, x,y,z,n-1);
};
canv.addEventListener('click', function(event) {
	var xclick = event.offsetX,
		yclick = event.offsetY;
	zmbox = document.getElementById('zm');
	zmbox.value *= 4;
	document.getElementById('xcoord').value=(xclick-250)/(z*500)+x;
	document.getElementById('ycoord').value=(250-yclick)/(z*500)+y;
	draw();
}, false);
document.getElementById('antialias').onclick = function() {
	if ( this.checked )
		document.getElementById("fastrend").checked = false;
};
document.getElementById('fastrend').onclick = function() {
	if ( this.checked )
		document.getElementById("antialias").checked = false;
};
document.getElementById('zmback').onclick = function() {
	zmbox = document.getElementById('zm');
	zmbox.value /= 4;
	draw();
};
document.getElementById('saveimg').onclick = function() {
	var dataUrl = canv.toDataURL();
	var a = document.createElement('a');
	a.href = dataUrl;
	a.download = "img.png";
	document.body.appendChild(a);
	a.click();
};
window.onload = function() 
{
	draw();
};