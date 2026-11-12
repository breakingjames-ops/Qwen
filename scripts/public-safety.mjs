// Conservative check for accidental private identifiers in this PUBLIC repo.
// Not a guarantee; reviewers must inspect all commits, docs, images and PRs.
import {readdirSync,readFileSync} from "node:fs";
import {join,relative} from "node:path";
const root=new URL("../",import.meta.url);
const excluded=new Set([".git","node_modules","dist","coverage"]);
const badNames=/(^|\/)(\.env(?:\..+)?|id_rsa|credentials\.(?:json|pem)|secrets?\.(?:json|pem))$/i;
const patterns=[
  [/\b(?:ghp_|github_pat_|sk-proj-|sk-[A-Za-z0-9_-]{24,})[A-Za-z0-9_-]+\b/g,"credential-like token"],
  [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g,"private key"],
  [/https?:\/\/[^\s\"'<>]+\.workers\.dev\b/g,"private deployment host"],
  [/https?:\/\/docs\.google\.com\/document\/d\//g,"document URL"],
  [/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,"email address"]
];
let errors=[],count=0;
function walk(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){if(excluded.has(entry.name))continue;
 const p=join(dir,entry.name),name=relative(root.pathname,p).replaceAll("\\","/");
 if(entry.isDirectory())walk(p);
 else if(entry.isFile()){
   if(badNames.test("/"+name))errors.push(name+": forbidden filename");
   if(!/\.(?:md|mjs|js|py|json|html|css|yml|yaml|txt)$/.test(entry.name))continue;
   count++;const body=readFileSync(p,"utf8");for(const [regex,reason]of patterns){regex.lastIndex=0;
   if(regex.test(body))errors.push(name+": "+reason);}
 }
}}
walk(root.pathname);
if(errors.length){console.error(errors.join("\n"));process.exitCode=1;}
else console.log("Public safety heuristics passed for "+count+" text files (manual review still required).");
