import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { hashPassword, verifyPassword, signedSessionValue, verifySignedSessionValue } from '../src/auth.js';
import { Store } from '../src/store.js';
import { evaluateContract } from '../src/rules.js';
import { makePdf, snapshotFor } from '../src/pdf.js';

function completePayload(name='Trabajadora Uno') { return {
  legalYear:2026,
  employer:{name:'Patrón Ejemplo',nationality:'Mexicana',rfc:'PEJ260101AA1',address:'Tijuana',legalEntity:false,representative:''},
  worker:{name,address:'Tijuana',birthDate:'1990-01-01',nationality:'Mexicana',sex:'Femenino',civilStatus:'Soltera',curp:'TEST900101MBCXXX01',rfc:'TEST900101AA1',beneficiaries:'Persona Beneficiaria'},
  job:{title:'Auxiliar',description:'Captura pedidos y organiza expedientes administrativos.',workplace:'Tijuana',municipality:'Tijuana',materialWork:false},
  relation:{type:'INDETERMINADO',startDate:'2026-08-24'},
  schedule:{shiftType:'DIURNA',dailyHours:8,weeklyHours:48,workDaysCount:6,weeklyRestDay:'Domingo',startTime:'09:00',endTime:'17:00',breakMinutes:0,plannedOvertimeHours:0},
  salary:{daily:500,zone:'ZLFN',professionalClassification:'NONE',professionalMinimumDaily:0,paymentFrequency:'Semanal',paymentMethod:'Transferencia'},
  benefits:{aguinaldoDays:15,vacationDays:12,vacationPremiumPercent:25},modality:{presential100:false},
  telework:{percent:0,equipmentDefined:false,costsDefined:false,disconnectDefined:false,supervisionDefined:false},imss:{provided:true,waiverAttempted:false},privacy:{noticeStatus:'ENTREGADO'},clauses:{confidentiality:true,postEmploymentNonCompete:false},specialWork:false
}; }

test('complete fixture really passes all finalization gates',()=>{const ev=evaluateContract(completePayload(),new Date('2026-08-24T12:00:00Z'));assert.equal(ev.status,'COMPLETO');assert.equal(ev.finalizable,true)});
test('passwords use salted scrypt and verify safely',()=>{const a=hashPassword('UnaClaveMuySegura1');const b=hashPassword('UnaClaveMuySegura1');assert.notEqual(a,b);assert.equal(verifyPassword('UnaClaveMuySegura1',a),true);assert.equal(verifyPassword('incorrecta',a),false)});
test('signed session rejects tampering',()=>{const secret='x'.repeat(64),signed=signedSessionValue('abc',secret);assert.equal(verifySignedSessionValue(signed,secret),'abc');assert.equal(verifySignedSessionValue(`${signed}x`,secret),null)});
test('store isolates contracts by user and persists atomically',()=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'contrato-'));const store=new Store(path.join(dir,'data.json'));const u1=store.createUser({email:'a@example.com',name:'A',passwordHash:'x'}),u2=store.createUser({email:'b@example.com',name:'B',passwordHash:'x'});const payload=completePayload();const ev=evaluateContract(payload,new Date('2026-08-24T12:00:00Z'));const saved=store.saveContract(u1.id,payload,ev);assert.equal(store.getContract(u2.id,saved.id),null);assert.equal(store.listContracts(u1.id).length,1);assert.equal(fs.existsSync(path.join(dir,'data.json')),true);fs.rmSync(dir,{recursive:true,force:true})});
test('finalized snapshot is immutable to later payload mutation',()=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'contrato-'));const store=new Store(path.join(dir,'data.json'));const u=store.createUser({email:'a@example.com',name:'A',passwordHash:'x'});const payload=completePayload();const ev=evaluateContract(payload,new Date('2026-08-24T12:00:00Z'));const saved=store.saveContract(u.id,payload,ev);const snap=snapshotFor(payload,ev,'2026-08-24T12:00:00.000Z');const final=store.finalizeContract(u.id,saved.id,snap);payload.worker.name='CAMBIADO';assert.equal(final.snapshot.answers.worker.name,'Trabajadora Uno');assert.throws(()=>store.saveContract(u.id,{...payload,id:saved.id},ev),/CONTRACT_FINALIZED/);fs.rmSync(dir,{recursive:true,force:true})});
test('snapshot captures complete identity schedule and beneficiary text',()=>{const payload=completePayload();const ev=evaluateContract(payload,new Date('2026-08-24T12:00:00Z'));const snap=snapshotFor(payload,ev,'2026-08-24T12:00:00.000Z');assert.match(snap.renderedText,/PEJ260101AA1/);assert.match(snap.renderedText,/Persona Beneficiaria/);assert.match(snap.renderedText,/09:00 a 17:00/);assert.equal(snap.rulesVersion,'MX-LFT-2026.2');assert.match(snap.sha256,/^[0-9a-f]{64}$/)});
test('PDF generator emits a valid PDF envelope',()=>{const payload=completePayload();const ev=evaluateContract(payload,new Date('2026-08-24T12:00:00Z'));const snap=snapshotFor(payload,ev);const pdf=makePdf(snap.renderedText);assert.equal(pdf.subarray(0,8).toString('latin1'),'%PDF-1.4');assert.ok(pdf.includes(Buffer.from('%%EOF')));assert.ok(pdf.length>500)});
