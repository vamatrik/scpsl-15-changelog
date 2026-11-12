// Port of ScpWorldMap processMapData('All') -> static layout for the site.
const fs=require('fs');
const raw=fs.readFileSync(__dirname+'/layout_src_14.2.7.json');
let txt=raw[0]===0xFF&&raw[1]===0xFE?raw.slice(2).toString('utf16le'):raw.toString('utf8').replace(/^﻿/,'');
const data=JSON.parse(txt);
const cp=o=>JSON.parse(JSON.stringify(o));
let hcz=cp(data.heavyContainment), ez=cp(data.entrance), lcz=cp(data.lightContainment);
hcz.forEach(r=>{r.zone='hcz';r.interpretation.coords.x*=-1;r.interpretation.coords.y*=-1});
ez.forEach(r=>{r.zone='ez';r.interpretation.coords.x*=-1;r.interpretation.coords.y*=-1});
lcz.forEach(r=>r.zone='lcz');
const rot=(p,a)=>a===90?{x:-p.y,y:p.x}:a===180?{x:-p.x,y:-p.y}:a===270?{x:p.y,y:-p.x}:{x:p.x,y:p.y};
const isCk=r=>r.chosenCandidate.name==='HczCheckpointToEntranceZone';
const H=hcz.filter(isCk), Ez=ez.filter(isCk);
if(H.length===2&&Ez.length===2){
  const [H1,H2]=H.map(r=>r.interpretation.coords),[E1,E2]=Ez.map(r=>r.interpretation.coords);
  let best=null,min=1e9;
  [{h1:H1,h2:H2},{h1:H2,h2:H1}].forEach(p=>{
    const ang=Math.round(((Math.atan2(p.h2.y-p.h1.y,p.h2.x-p.h1.x)-Math.atan2(E2.y-E1.y,E2.x-E1.x))*180/Math.PI+720)%360);
    const r1=rot(E1,ang),bx=p.h1.x-r1.x,by=p.h1.y-r1.y;
    const vert=((H[0].interpretation.rotationY+180)%180===90);
    const shifts=vert?[{dx:0,dy:1},{dx:0,dy:-1}]:[{dx:1,dy:0},{dx:-1,dy:0}];
    let bs=null,lm=1e9;
    shifts.forEach(s=>{const tx=bx+s.dx,ty=by+s.dy;let o=0;ez.forEach(er=>{const q=rot(er.interpretation.coords,ang);const fx=Math.round(q.x+tx),fy=Math.round(q.y+ty);if(hcz.some(hr=>hr.interpretation.coords.x===fx&&hr.interpretation.coords.y===fy))o++});if(o<lm){lm=o;bs={tx,ty}}});
    if(lm<min){min=lm;best={angle:ang,tx:Math.round(bs.tx),ty:Math.round(bs.ty)}}
  });
  ez.forEach(er=>{const q=rot(er.interpretation.coords,best.angle);er.interpretation.coords.x=q.x+best.tx;er.interpretation.coords.y=q.y+best.ty;er.interpretation.rotationY=(er.interpretation.rotationY+best.angle)%360;if(isCk(er))er.chosenCandidate.originalName='EzCheckpoint'});
}
const he=[...hcz,...ez];
{const xs=he.map(r=>r.interpretation.coords.x),ys=he.map(r=>r.interpretation.coords.y);
 const lx=lcz.map(r=>r.interpretation.coords.x),ly=lcz.map(r=>r.interpretation.coords.y);
 const ox=Math.round((Math.min(...xs)+Math.max(...xs))/2-(Math.min(...lx)+Math.max(...lx))/2), oy=Math.round(Math.max(...ys)-Math.min(...ly)+3);
 lcz.forEach(r=>{r.interpretation.coords.x+=ox;r.interpretation.coords.y+=oy});}
const all=[...hcz,...ez,...lcz];
const BaseShapes={Straight:[1,3],Curve:[2,1],TShape:[0,2,3],XShape:[0,1,2,3],Endroom:[3]};
const Over={LczClassDSpawn:[1]};
const TROT={EzGateA:-90,EzGateB:-90,EzCollapsedTunnel:-90,EzOfficeStoried:-90,EzIntercom:-90,EzEvacShelter:-90,EzOfficeSmall:-90,EzOfficeLarge:-90,EzRedRoom:-90,EzRedroom:-90,EzThreeWay:-90,EzStraight:-90,EzCurve:-90,EzCheckpoint:-90};
const TEX={LczCurve:1,LczStraight:1,LczCross:1,LczThreeWay:1,Lcz330:1,Lcz914:1,LczAirlock:1,LczArmory:1,LczCheckpointB:1,LczCheckpointA:1,LczClassDSpawn:1,LczToilets:1,LczComputerRoom:1,LczGlassroom:1,Lcz173:1,LczGreenhouse:1,HczCurve:1,HczStraight:1,HczCross:1,HczThreeWay:1,HczCheckpointA:1,HczCheckpointB:1,HczWarhead:1,HczServers:1,Hcz939:1,HczTestroom:1,HczTesla:1,HczAcroamaticAbatement:1,Hcz106:1,HczRampTunnel:1,Hcz096:1,HczArmory:1,Hcz049:1,HczWaysideIncinerator:1,Hcz079:1,Hcz127:1,HczMicroHID:1,HczCheckpointToEntranceZone:1,HCZ_JunkMain:1,HCZ_PipesMain:1,HCZ_FunnyCorridor:1,EzCurve:1,EzStraight:1,EzCross:1,EzThreeWay:1,EzEvacShelter:1,EzGateA:1,EzGateB:1,EzRedRoom:1,EzRedroom:1,EzOfficeSmall:1,EzOfficeLarge:1,EzOfficeStoried:1,EzCollapsedTunnel:1,EzIntercom:1,EzCheckpoint:1};
const maxY=Math.max(...all.map(r=>r.interpretation.coords.y)), minX=Math.min(...all.map(r=>r.interpretation.coords.x));
const rooms=all.map(r=>{
  const c=r.interpretation.coords, name=r.chosenCandidate.originalName||r.chosenCandidate.name, shape=r.chosenCandidate.shape;
  let eff=r.interpretation.rotationY; if(r.zone!=='lcz') eff=(eff+180)%360;
  let key=name;
  if(name==='Unnamed'||!TEX[key]){const p={lcz:'Lcz',hcz:'Hcz',ez:'Ez'}[r.zone];let s=shape==='XShape'?'Cross':shape==='TShape'?'ThreeWay':shape;key=p+s;}
  const sh=((Math.round(eff/90)%4)+4)%4;
  const doors=(Over[name]||BaseShapes[shape]||[]).map(d=>(d+sh)%4);
  return {z:r.zone,c:c.x-minX,r:maxY-c.y,rot:eff+(TROT[key]||0),key,name,doors};
});
// rotate whole facility 90deg clockwise for a widescreen layout
{const HH=Math.max(...rooms.map(r=>r.r));rooms.forEach(r=>{const c=r.c;r.c=HH-r.r;r.r=c;r.rot=(r.rot+90)%360;r.doors=r.doors.map(d=>(d+1)%4);});}
// turn LCZ 180deg in place so its elevators face Heavy Containment
{const L=rooms.filter(r=>r.z==='lcz');const a=Math.min(...L.map(r=>r.c))+Math.max(...L.map(r=>r.c)),b=Math.min(...L.map(r=>r.r))+Math.max(...L.map(r=>r.r));
 L.forEach(r=>{r.c=a-r.c;r.r=b-r.r;r.rot=(r.rot+180)%360;r.doors=r.doors.map(d=>(d+2)%4);});}
// print ascii
const W=Math.max(...rooms.map(r=>r.c))+1,Hh=Math.max(...rooms.map(r=>r.r))+1;
const g=[...Array(Hh)].map(()=>Array(W).fill(' '));
rooms.forEach(r=>g[r.r][r.c]={lcz:'L',hcz:'H',ez:'E'}[r.z]);
console.log(g.map(x=>x.join('')).join('\n'));
fs.writeFileSync(__dirname+'/../js/layout.js','/* Facility layout: real 14.2.7 map generation sample (via ScpWorldMap), rotated for widescreen. */\nwindow.CL_LAYOUT='+JSON.stringify(rooms)+';\n');
console.log(rooms.length, W, Hh);
console.log(rooms.filter(r=>r.name!=='Unnamed').map(r=>r.z+':'+r.name+'@'+r.c+','+r.r).join(' '));
