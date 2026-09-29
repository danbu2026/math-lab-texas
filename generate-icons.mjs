import fs from 'node:fs';
import zlib from 'node:zlib';

const colors={paper:[244,247,248,255],teal:[18,73,75,255],cream:[255,255,244,255],lime:[226,251,139,255]};
const crcTable=Array.from({length:256},(_,n)=>{let c=n;for(let k=0;k<8;k++)c=(c&1)?0xedb88320^(c>>>1):c>>>1;return c>>>0});
function crc32(buf){let c=0xffffffff;for(const b of buf)c=crcTable[(c^b)&255]^(c>>>8);return(c^0xffffffff)>>>0}
function chunk(type,data){const t=Buffer.from(type);const out=Buffer.alloc(data.length+12);out.writeUInt32BE(data.length,0);t.copy(out,4);data.copy(out,8);out.writeUInt32BE(crc32(Buffer.concat([t,data])),8+data.length);return out}
function set(px,size,x,y,c){if(x<0||y<0||x>=size||y>=size)return;const i=(y*size+x)*4;px.set(c,i)}
function rect(px,size,x,y,w,h,c){for(let yy=Math.max(0,y);yy<Math.min(size,y+h);yy++)for(let xx=Math.max(0,x);xx<Math.min(size,x+w);xx++)set(px,size,xx,yy,c)}
function rounded(px,size,x,y,w,h,r,c){for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++){const dx=Math.max(x+r-xx,0,xx-(x+w-r-1)),dy=Math.max(y+r-yy,0,yy-(y+h-r-1));if(dx*dx+dy*dy<=r*r)set(px,size,xx,yy,c)}}
function png(size,maskable=false){const px=new Uint8Array(size*size*4);for(let i=0;i<px.length;i+=4)px.set(maskable?colors.teal:colors.paper,i);const pad=Math.round(size*(maskable?.18:.1));if(!maskable)rounded(px,size,pad,pad,size-pad*2,size-pad*2,Math.round(size*.18),colors.teal);const x=maskable?Math.round(size*.25):Math.round(size*.26),y=Math.round(size*.36),u=Math.round(size*.075),th=Math.max(3,Math.round(size*.055));rect(px,size,x,y,th,u*3,colors.cream);rect(px,size,x+th,y,u,th,colors.cream);rect(px,size,x+th+u-th,y+th,th,u*2,colors.cream);rect(px,size,x+th+u,y,u,th,colors.cream);rect(px,size,x+th+u*2-th,y+th,th,u*2,colors.cream);const cx=Math.round(size*.69),cy=Math.round(size*.27),pl=Math.round(size*.12),pt=Math.max(3,Math.round(size*.032));rect(px,size,Math.round(cx-pl/2),Math.round(cy-pt/2),pl,pt,colors.lime);rect(px,size,Math.round(cx-pt/2),Math.round(cy-pl/2),pt,pl,colors.lime);const raw=Buffer.alloc((size*4+1)*size);for(let row=0;row<size;row++){raw[row*(size*4+1)]=0;Buffer.from(px.buffer,row*size*4,size*4).copy(raw,row*(size*4+1)+1)}const ihdr=Buffer.alloc(13);ihdr.writeUInt32BE(size,0);ihdr.writeUInt32BE(size,4);ihdr[8]=8;ihdr[9]=6;return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',zlib.deflateSync(raw,{level:9})),chunk('IEND',Buffer.alloc(0))])}
fs.writeFileSync('dist/apple-touch-icon.png',png(180));
fs.writeFileSync('dist/icon-192.png',png(192));
fs.writeFileSync('dist/icon-512.png',png(512));
fs.writeFileSync('dist/icon-maskable-512.png',png(512,true));
console.log('iPad and PWA icons generated');
