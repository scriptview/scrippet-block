(()=>{"use strict";var t,e={258:()=>{const t=window.wp.blocks,e=window.React,n=window.wp.element,r=window.wp.blockEditor;function i(t){for(var e=[],n=0,r=0;r<t.length;r++){var i=t[r];n+=i.before.length,e.push({nature:i.nature,position:n,content:i.content})}return e}const o=!1;var a=" \f\n\r\t\v",l=new RegExp("[A-Za-z]"),s=["INT","EXT","EST","INT./EXT","INT/EXT","I/E"];function c(t,e){t.lineno++,o&&console.log(`# lineno=${t.lineno} line=${e}`);const n=function(t,e,n){var r,i=t.state,o=!1,a=t.nestedDepth?t.nestedDepth:0,l=-1,s=-1;0===i?(r=void 0,t.blocks=[],t.lineno=n):(r=t.blocks[t.blocks.length-1],s=0);for(let u=0;u<e.length;u++)if(o)o=!1;else{var c=e.charAt(u);if(0===i)l<0&&(l=u),"/"===c?i=1:"["===c&&(i=2);else if(1===i)"*"===c?(r={nature:"comment",before:e.substring(l,u-1),start:{lineno:n,column:u-1},content:[]},t.blocks.push(r),l=-1,s=u+1,i=100):i="["===c?2:0;else if(2===i)"["===c?(r={nature:"note",before:e.substring(l,u-1),start:{lineno:n,column:u-1},content:[]},t.blocks.push(r),l=-1,s=u+1,i=200):i="/"===c?1:0;else if(100===i)"*"===c?i=101:"/"==c&&(i=105);else if(101===i)if("/"===c)if(0===a){if(!r)throw new Error("internal error (1)");r.end={lineno:n,column:u},r.content.push(e.substring(s,u-1).trim()),i=0}else a--,i=100;else i=100;else if(105===i)"*"===c?a++:i=100;else if(200===i)"]"===c?i=201:"["===c&&(i=205);else if(201===i)if("]"===c){if(!r)throw new Error("internal error (2)");0===a?(r.end={lineno:n,column:u},r.content.push(e.substring(s,u-1).trim()),i=0):(a--,i=200)}else i=200;else 205===i&&("["===c?a++:i=200);o="\\"==c}if(1!=i&&2!=i||(i=0),0===i)0===t.blocks.length?(t.line=e,t.lastChunk=""):(t.line="",t.blocks.forEach((function(e,n,r){t.line+=e.before})),l>=0&&(t.lastChunk=e.substring(l),t.line+=t.lastChunk),t.line=t.line.trim()),t.nestedDepth=0;else{if(t.nestedDepth=a,i>=100&&i<200){if(i=100,!r)throw new Error("internal error (3)");r.content.push(e.substring(s).trim())}if(i>=200&&i<300){if(!r)throw new Error("internal error (4)");i=200,r.content.push(e.substring(s).trim())}}return t.state=i,i}(t.blockContext,e,t.lineno);if(o&&console.log(`# parseBlock state=${n}`),0===n){var r={line:e=t.blockContext.line,lineno:t.lineno,blocks:i(t.blockContext.blocks)};if(t.line0?t.line1=r:(t.line0=r,t.line1=void 0),t.line1){t.nextLineBlank=f(t.line1.line);for(var a=!1;!a;)a=h(t,t.line0.line,t.line0.blocks,t.line0.lineno);t.previousLineBlank=f(t.line0.line),t.line0=t.line1,t.line1=void 0}t.blockContext={state:0,nestedDepth:0,line:"",lineno:0,blocks:[],lastChunk:""}}}function u(t,e){for(var n=0;n<t.length;n++)t[n].position=t[n].position+e}function f(t){for(var e=0,n=0;n<t.length;n++){var r=t.charAt(n);if(a.indexOf(r)<0)return!1;e++}return e<2}function g(t,e){var n,r=0,i=0,o=0;for(r=0;r<t.length;r++)if(n=t.charAt(r),a.indexOf(n)<0){i=r;break}for(r=t.length-1;r>=0;r--)if(n=t.charAt(r),a.indexOf(n)<0){o=r;break}return u(e,-i),0===o?"":t.substring(i,o+1)}function h(t,e,n,r){var i,o=g(e,n),a=f(e);if(a&&n.length>0&&t.notif.block(n),0===t.state){if(a)return!0;if((i=e.indexOf(":"))<0)return t.state=10,!1;t.state=2,t.metaInformation={},p(t,e,i)}else if(2==t.state)if("\t"===e.charAt(0)||"   "===e.substring(0,3)){if(!t.currentKey)throw new Error("internal error");t.metaInformation[t.currentKey].push(e.trim())}else{if(!((i=e.indexOf(":"))>0))return t.notif.titlePage(t.metaInformation),t.state=10,!1;p(t,e,i)}else{if(10!=t.state)throw new Error("Invalid state:"+t.state);if(!a){var c=d(o,0,"><");c&&0===c.before.trim().length&&0===c.after.trim().length?(u(n,c.before.length+1),t.notif.action(g(c.between,n),n,{alignment:"centered"})):"="===o.charAt(0)&&o.length>=3&&"="===o.charAt(1)&&"="===o.charAt(2)?t.notif.pageBreak():"#"===o.charAt(0)&&function(t,e,n){var r=0,i=0;for(i=0;i<e.length;i++){var o=e.charAt(i);if("#"==o)r++;else if(" "!=o&&"\t"!=o)break}var a=e.substring(i).trim();return t.notif.section(a,r,n),!0}(t,o,r)||"="===o.charAt(0)&&function(t,e){var n=e.substring(1).trim();return t.notif.synopsis(n),!0}(t,o)||(t.previousLineBlank&&t.nextLineBlank||">"===e.charAt(0))&&function(t,e){var n=!1;return">"==e.charAt(0)?n=e.substring(1).trim():"TO:"===e.substring(e.length-3)&&e.toUpperCase()===e&&(n=e.trim()),!!n&&(t.notif.transition(n),!0)}(t,e)||t.previousLineBlank&&function(t,e,n){var r=!1;if("."===e.charAt(0)&&e.length>1&&"."!==e.charAt(1))r=e.substring(1).trim();else{var i=m(e,0," .");s.indexOf(i.toUpperCase())>=0&&(r=e.trim())}return!!r&&(t.notif.sceneHeading(r,n),!0)}(t,o,r)||t.previousLineBlank&&!t.nextLineBlank&&function(t,e){var n=!1;"^"===e.charAt(e.length-1)&&(n=!0,e=e.substring(0,e.length-1).trim());var r,i=!1;if("@"===e.charAt(0))i=e.substring(1).trim();else{var o=m(e,0,"(").trim();if(o.length>0&&o.toUpperCase()===o)for(var a=0;a<o.length;a++)if(r=o.charAt(a),l.test(r)){i=e;break}}if(i){var s,c=d(i,0,"()");return c&&(i=c.before.trim(),s=c.between.trim()),s?t.notif.character(i,{extension:s,isDualDialogue:n}):t.notif.character(i,{isDualDialogue:n}),!0}return!1}(t,o)||(!t.previousLineBlank&&function(t){return"character"===t.lastElementNature||"dialogue"===t.lastElementNature||"parenthetical"===t.lastElementNature}(t)?function(t,e){if("("===e.charAt(0)){var n=e.indexOf(")");if(n>0){t.notif.parenthetical(e.substring(1,n));var r=e.substring(n+1).trim();r.length>0&&t.notif.dialogue(r)}else t.notif.parenthetical(e.substring(1))}else t.notif.dialogue(e)}(t,o):t.notif.action(o,n,{}))}}return!0}function p(t,e,n){var r=e.substring(0,n).trim();if(t.currentKey=r,t.metaInformation[t.currentKey]=[],n<e.length){var i=e.substring(n+1).trim();i.length>0&&t.metaInformation[t.currentKey].push(i)}}function d(t,e,n){for(var r=0,i={before:"",between:"",after:""},o=e;o<t.length;o++){var a=t.charAt(o);if(0===r&&a===n[0])i.before=t.substring(e,o),r=1;else{if(1===r&&a===n[1]){i.after=t.substring(o+1),r=3;break}1===r&&(i.between=i.between+a)}}return 3===r&&i}function m(t,e,n){for(var r=e;r<t.length;r++){var i=t.charAt(r);if(n.indexOf(i)>=0)return t.substring(e,r)}return t.substring(e)}function b(t,e){var n=function(t){return{state:0,lineno:0,blockContext:{state:0,nestedDepth:0,line:"",lineno:0,blocks:[],lastChunk:""},metaInformation:{},previousLineBlank:!0,nextLineBlank:void 0,notif:t||{startOfDocument:function(){console.log("startOfDocument")},titlePage:function(t){console.log("titlePage:",t)},sceneHeading:function(t,e){console.log("sceneHeading:<"+t+">",e)},action:function(t,e,n){console.log("action:<"+t+"> options:",n)},pageBreak:function(){console.log("pageBreak")},dualDialogueStart:function(){console.log("dualDialogueStart")},dualDialogueEnd:function(){console.log("dualDialogueEnd")},dialogueStart:function(){console.log("dialogueStart")},dialogueEnd:function(){console.log("dialogueEnd")},character:function(t,e){e.extension?console.log("character:<"+t+"> option:",e):console.log("character:<"+t+">")},parenthetical:function(t){console.log("parenthetical:<"+t+">")},dialogue:function(t){console.log("dialogue:<"+t+">")},transition:function(t){console.log("transition:<"+t+">")},section:function(t,e,n){console.log("section:"+e+"<"+t+">",n)},synopsis:function(t){console.log("synopsis:<"+t+">")},block:function(t){console.log("block:<"+t+">")},endOfDocument:function(){console.log("endOfDocument")}}}}();n.notif=function(t,e,n){var r=!1,i=[];function o(){i.length>0&&(e.dialogueStart(),i.forEach((function(t){t()})),e.dialogueEnd()),i.length=0}function a(){o(),r&&(e.dualDialogueEnd(),r=!1)}return{startOfDocument:function(){e.startOfDocument(),t.lastElementNature="startOfDocument"},titlePage:function(n){e.titlePage(n),t.lastElementNature="titlePage"},sceneHeading:function(n,r){a(),e.sceneHeading(n,r),t.lastElementNature="sceneHeading"},action:function(n,r,i){a(),e.action(n,r,i),t.lastElementNature="action"},pageBreak:function(){a(),e.pageBreak(),t.lastElementNature="pageBreak"},character:function(n,a){i.length>0&&(a.isDualDialogue&&!r?(e.dualDialogueStart(),r=!0,o()):(o(),r&&(e.dualDialogueEnd(),r=!1))),i.push((function(){e.character(n,a)})),t.lastElementNature="character"},parenthetical:function(n){i.push((function(){e.parenthetical(n)})),t.lastElementNature="parenthetical"},dialogue:function(n){i.push((function(){e.dialogue(n)})),t.lastElementNature="dialogue"},transition:function(n){a(),e.transition(n),t.lastElementNature="transition"},section:function(n,r,i){a(),e.section(n,r,i),t.lastElementNature="section"},synopsis:function(n){e.synopsis(n),t.lastElementNature="synopsis"},block:function(t){e.block(t)},dialogueStart:function(){e.dialogueStart(),t.lastElementNature="dialogueStart"},dialogueEnd:function(){e.dialogueEnd(),t.lastElementNature="dialogueEnd"},dualDialogueStart:function(){e.dualDialogueStart(),t.lastElementNature="dualDialogueStart"},dualDialogueEnd:function(){e.dualDialogueEnd(),t.lastElementNature="dualDialogueEnd"},endOfDocument:function(){a(),e.endOfDocument(),t.lastElementNature="endOfDocument"}}}(n,e);const r=t.split(/\r?\n/);n.notif.startOfDocument();for(const t of r)c(n,t);c(n,""),2===n.state&&n.notif.titlePage(n.metaInformation),n.notif.endOfDocument()}function v(t){var e={type:".",text:"",parts:[]};return E(t,0,e),e}function E(t,e,n){const r=t.length;let i="";const o=n.type,a="."!==o[0];function l(t){i+=t}function s(e,n){return e+n<r?t.charAt(e+n):""}function c(e,r){var o={type:r,text:"",parts:[]},a=E(t,e+r.length,o);return a>=0&&(i.length>0&&(n.parts.push({type:".",text:i,parts:[]}),i=""),n.parts.push(o)),a}var u;for(u=e;u<r;u++){var f=t.charAt(u);if("\\"!==f){if(a&&f===o[0]){for(var g=!0,h=0;h<o.length;h++)if(s(u,h)!==o[h]){g=!1;break}if(g)return n.parts.push({type:".",text:i,parts:[]}),i="",u+o.length-1}if("_"===f){const t=c(u,"_");t<0?l(f):u=t}else if("*"===f)if("*"===s(u,1))if("*"===s(u,2)){const t=c(u,"***");t<0?l(f):u=t}else{const t=c(u,"**");t<0?l(f):u=t}else{const t=c(u,"*");t<0?l(f):u=t}else l(f)}else l(s(u,1)),u++}return a?-1:(i.length>0&&(n.parts.push({type:".",text:i,parts:[]}),i=""),u)}function k(t,e){const n=[];return t.length>0&&n.push(t),e.forEach((t=>{n.push(...D(t))})),n}function D(t){switch(k(t.text,t.parts),t.type){case".":default:return k(t.text,t.parts);case"_":return[(0,e.createElement)("u",{},k(t.text,t.parts))];case"*":return[(0,e.createElement)("em",{},k(t.text,t.parts))];case"**":return[(0,e.createElement)("strong",{},k(t.text,t.parts))];case"***":return[(0,e.createElement)("strong",{},(0,e.createElement)("em",{},k(t.text,t.parts)))]}}function O(t){return D(v(t))}function N(t){const n=function(){const t=[],n=[];function r(e){t.push(e)}function i(e,n){t.push(`${e}||${n}`)}function o(e,n){t.push(`${e}||${JSON.stringify(n)}`)}const a={startOfDocument:function(){r("startOfDocument")},titlePage:function(t){o("titlePage",t)},sceneHeading:function(r,i){var o,a;o=r,a=i,t.push(`sceneHeading||${o}||${a}`),n.push((0,e.createElement)("p",{className:"sceneheader"},r))},action:function(r,i,o){var a,l,s;a=r,l=i,s=o,t.push(`action||${a}||${JSON.stringify(l)}||${JSON.stringify(s)}`),n.push((0,e.createElement)("p",{className:"action"},O(r)))},pageBreak:function(){r("pageBreak")},dualDialogueStart:function(){r("dualDialogueStart")},dualDialogueEnd:function(){r("dualDialogueEnd")},dialogueStart:function(){r("dialogueStart")},dialogueEnd:function(){r("dialogueEnd")},character:function(r,i){var o,a;o=r,a=i,t.push(`character||${o}||${JSON.stringify(a)}`),n.push((0,e.createElement)("p",{className:"character"},r))},parenthetical:function(t){i("parenthetical",t),n.push((0,e.createElement)("p",{className:"parenthetical"},`(${t})`))},dialogue:function(t){i("dialogue",t),n.push((0,e.createElement)("p",{className:"dialogue"},O(t)))},transition:function(t){i("transition",t),n.push((0,e.createElement)("p",{className:"transition"},t))},section:function(e,n,r){!function(e,n,r,i){t.push(`section||${n}||${r}||${JSON.stringify(i)}`)}(0,e,n,r)},synopsis:function(t){i("synopsis",t)},block:function(t){o("block",t)},endOfDocument:function(){r("endOfDocument")}};return{getNotification:()=>a,getResult:t=>(0,e.createElement)("div",{className:"scrippet-fountain-html"},n)}}();b(t,n.getNotification());const r=n.getResult(t);return t.replace(/\b\w{6,}\b/g,"<strong>$&</strong>"),r}const w=JSON.parse('{"UU":"scriptview/scrippet-block"}');(0,t.registerBlockType)(w.UU,{edit:function({attributes:t,setAttributes:i,isSelected:o}){const{fountainSource:a=""}=t,l=(0,r.useBlockProps)();return(0,n.useEffect)((function(){const t=N(a);i({fountainHtml:t})}),[]),(0,e.createElement)("div",{...l},o&&(0,e.createElement)(e.Fragment,null,(0,e.createElement)("pre",{className:"mermaid-editor wp-block-code"},(0,e.createElement)(r.PlainText,{onChange:function(t){i({fountainSource:t})},value:a})),(0,e.createElement)("hr",null)),N(a))},save:function(t){const{fountainSource:n}=t.attributes,i=r.useBlockProps.save({className:"scrippet-block"});return(0,e.createElement)("div",{...i},(0,e.createElement)("pre",{className:"scrippet-fountain-source",style:{display:"none"}},n),N(n))}})}},n={};function r(t){var i=n[t];if(void 0!==i)return i.exports;var o=n[t]={exports:{}};return e[t](o,o.exports,r),o.exports}r.m=e,t=[],r.O=(e,n,i,o)=>{if(!n){var a=1/0;for(u=0;u<t.length;u++){for(var[n,i,o]=t[u],l=!0,s=0;s<n.length;s++)(!1&o||a>=o)&&Object.keys(r.O).every((t=>r.O[t](n[s])))?n.splice(s--,1):(l=!1,o<a&&(a=o));if(l){t.splice(u--,1);var c=i();void 0!==c&&(e=c)}}return e}o=o||0;for(var u=t.length;u>0&&t[u-1][2]>o;u--)t[u]=t[u-1];t[u]=[n,i,o]},r.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),(()=>{var t={57:0,350:0};r.O.j=e=>0===t[e];var e=(e,n)=>{var i,o,[a,l,s]=n,c=0;if(a.some((e=>0!==t[e]))){for(i in l)r.o(l,i)&&(r.m[i]=l[i]);if(s)var u=s(r)}for(e&&e(n);c<a.length;c++)o=a[c],r.o(t,o)&&t[o]&&t[o][0](),t[o]=0;return r.O(u)},n=globalThis.webpackChunkscrippet_block=globalThis.webpackChunkscrippet_block||[];n.forEach(e.bind(null,0)),n.push=e.bind(null,n.push.bind(n))})();var i=r.O(void 0,[350],(()=>r(258)));i=r.O(i)})();