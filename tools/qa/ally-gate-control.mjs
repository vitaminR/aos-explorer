import { isAllyOrigin } from '/tmp/tip-gate.mjs';
const MUST_DENY = ['China','CN','PRC','P.R.C.','Russia','RU','Russian Federation','Iran','IR','Iranian',
  'Iran, Islamic Republic of','North Korea','KP','DPRK','Korea, Democratic Peoples Republic of',
  '', '  ', null, undefined, 42, {}, 'X', 'A'.repeat(200)];
const MUST_ALLOW = ['United States','US','U.S.','united states','Germany','Japan','Taiwan','Israel',
  'Canada','Australia','United-Kingdom','new_zealand','  France  '];
let leaks=[], falsePos=[];
for (const v of MUST_DENY) { let r; try { r = isAllyOrigin(v); } catch(e) { r = 'THREW: '+e.message; } if (r===true) leaks.push(JSON.stringify(v)); }
for (const v of MUST_ALLOW) { let r; try { r = isAllyOrigin(v); } catch(e) { r = 'THREW: '+e.message; } if (r!==true) falsePos.push(JSON.stringify(v)+' -> '+r); }
console.log('TIP 3cec81a CLIENT GATE');
console.log('  MUST-DENY leaked  : ' + leaks.length + '/' + MUST_DENY.length + (leaks.length?'  '+leaks.join(', '):''));
console.log('  MUST-ALLOW blocked: ' + falsePos.length + '/' + MUST_ALLOW.length + (falsePos.length?'\n     '+falsePos.join('\n     '):''));
console.log('  RESULT: ' + (leaks.length===0 && falsePos.length===0 ? 'PASS' : 'REVIEW'));
process.exit(0);
