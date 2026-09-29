import fs from 'node:fs';
import {execFileSync} from 'node:child_process';

for(const file of fs.readdirSync('dist').filter(file=>file.endsWith('.js'))) execFileSync(process.execPath,['--check','dist/'+file]);
for(const file of ['index.html','guide.html','guide-en.html']){
  const html=fs.readFileSync('dist/'+file,'utf8');
  for(const match of html.matchAll(/(?:src|href)="([^"]+)"/g)){
    const target=match[1].split(/[?#]/)[0];
    if(target.startsWith('http')||target==='./'||target.startsWith('#')) continue;
    if(!fs.existsSync('dist/'+target)) throw Error('Missing '+target+' referenced by '+file);
  }
}
const manifest=JSON.parse(fs.readFileSync('dist/manifest.webmanifest','utf8'));
for(const icon of manifest.icons) if(!fs.existsSync('dist/'+icon.src)) throw Error('Missing manifest icon '+icon.src);
console.log('Syntax, local links and install assets: PASS');
