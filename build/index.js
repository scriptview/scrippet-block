(()=>{"use strict";var n,t={870:()=>{const n=window.wp.blocks,t=window.React,e=window.wp.element,i=window.wp.blockEditor;function o(n){for(var t=[],e=0,i=0;i<n.length;i++){var o=n[i];e+=o.before.length,t.push({nature:o.nature,position:e,content:o.content})}return t}const r=!1;var a=" \f\n\r\t\v",l=new RegExp("[A-Za-z]"),s=["INT","EXT","EST","INT./EXT","INT/EXT","I/E"];function u(n,t){n.lineno++,r&&console.log(`# lineno=${n.lineno} line=${t}`);const e=function(n,t,e){var i,o=n.state,r=!1,a=n.nestedDepth?n.nestedDepth:0,l=-1,s=-1;0===o?(i=void 0,n.blocks=[],n.lineno=e):(i=n.blocks[n.blocks.length-1],s=0);for(let c=0;c<t.length;c++)if(r)r=!1;else{var u=t.charAt(c);if(0===o)l<0&&(l=c),"/"===u?o=1:"["===u&&(o=2);else if(1===o)"*"===u?(i={nature:"comment",before:t.substring(l,c-1),start:{lineno:e,column:c-1},content:[]},n.blocks.push(i),l=-1,s=c+1,o=100):o="["===u?2:0;else if(2===o)"["===u?(i={nature:"note",before:t.substring(l,c-1),start:{lineno:e,column:c-1},content:[]},n.blocks.push(i),l=-1,s=c+1,o=200):o="/"===u?1:0;else if(100===o)"*"===u?o=101:"/"==u&&(o=105);else if(101===o)if("/"===u)if(0===a){if(!i)throw new Error("internal error (1)");i.end={lineno:e,column:c},i.content.push(t.substring(s,c-1).trim()),o=0}else a--,o=100;else o=100;else if(105===o)"*"===u?a++:o=100;else if(200===o)"]"===u?o=201:"["===u&&(o=205);else if(201===o)if("]"===u){if(!i)throw new Error("internal error (2)");0===a?(i.end={lineno:e,column:c},i.content.push(t.substring(s,c-1).trim()),o=0):(a--,o=200)}else o=200;else 205===o&&("["===u?a++:o=200);r="\\"==u}if(1!=o&&2!=o||(o=0),0===o)0===n.blocks.length?(n.line=t,n.lastChunk=""):(n.line="",n.blocks.forEach((function(t,e,i){n.line+=t.before})),l>=0&&(n.lastChunk=t.substring(l),n.line+=n.lastChunk),n.line=n.line.trim()),n.nestedDepth=0;else{if(n.nestedDepth=a,o>=100&&o<200){if(o=100,!i)throw new Error("internal error (3)");i.content.push(t.substring(s).trim())}if(o>=200&&o<300){if(!i)throw new Error("internal error (4)");o=200,i.content.push(t.substring(s).trim())}}return n.state=o,o}(n.blockContext,t,n.lineno);if(r&&console.log(`# parseBlock state=${e}`),0===e){var i={line:t=n.blockContext.line,lineno:n.lineno,blocks:o(n.blockContext.blocks)};if(n.line0?n.line1=i:(n.line0=i,n.line1=void 0),n.line1){n.nextLineBlank=f(n.line1.line);for(var a=!1;!a;)a=h(n,n.line0.line,n.line0.blocks,n.line0.lineno);n.previousLineBlank=f(n.line0.line),n.line0=n.line1,n.line1=void 0}n.blockContext={state:0,nestedDepth:0,line:"",lineno:0,blocks:[],lastChunk:""}}}function c(n,t){for(var e=0;e<n.length;e++)n[e].position=n[e].position+t}function f(n){for(var t=0,e=0;e<n.length;e++){var i=n.charAt(e);if(a.indexOf(i)<0)return!1;t++}return t<2}function g(n,t){var e,i=0,o=0,r=0;for(i=0;i<n.length;i++)if(e=n.charAt(i),a.indexOf(e)<0){o=i;break}for(i=n.length-1;i>=0;i--)if(e=n.charAt(i),a.indexOf(e)<0){r=i;break}return c(t,-o),0===r?"":n.substring(o,r+1)}function h(n,t,e,i){var o,r=g(t,e),a=f(t);if(a&&e.length>0&&n.notif.block(e),0===n.state){if(a)return!0;if((o=t.indexOf(":"))<0)return n.state=10,!1;n.state=2,n.metaInformation={},d(n,t,o)}else if(2==n.state)if("\t"===t.charAt(0)||"   "===t.substring(0,3)){if(!n.currentKey)throw new Error("internal error");n.metaInformation[n.currentKey].push(t.trim())}else{if(!((o=t.indexOf(":"))>0))return n.notif.titlePage(n.metaInformation),n.state=10,!1;d(n,t,o)}else{if(10!=n.state)throw new Error("Invalid state:"+n.state);if(!a){var u=p(r,0,"><");u&&0===u.before.trim().length&&0===u.after.trim().length?(c(e,u.before.length+1),n.notif.action(g(u.between,e),e,{alignment:"centered"})):"="===r.charAt(0)&&r.length>=3&&"="===r.charAt(1)&&"="===r.charAt(2)?n.notif.pageBreak():"#"===r.charAt(0)&&function(n,t,e){var i=0,o=0;for(o=0;o<t.length;o++){var r=t.charAt(o);if("#"==r)i++;else if(" "!=r&&"\t"!=r)break}var a=t.substring(o).trim();return n.notif.section(a,i,e),!0}(n,r,i)||"="===r.charAt(0)&&function(n,t){var e=t.substring(1).trim();return n.notif.synopsis(e),!0}(n,r)||(n.previousLineBlank&&n.nextLineBlank||">"===t.charAt(0))&&function(n,t){var e=!1;return">"==t.charAt(0)?e=t.substring(1).trim():"TO:"===t.substring(t.length-3)&&t.toUpperCase()===t&&(e=t.trim()),!!e&&(n.notif.transition(e),!0)}(n,t)||n.previousLineBlank&&function(n,t,e){var i=!1;if("."===t.charAt(0)&&t.length>1&&"."!==t.charAt(1))i=t.substring(1).trim();else{var o=m(t,0," .");s.indexOf(o.toUpperCase())>=0&&(i=t.trim())}return!!i&&(n.notif.sceneHeading(i,e),!0)}(n,r,i)||n.previousLineBlank&&!n.nextLineBlank&&function(n,t){var e=!1;"^"===t.charAt(t.length-1)&&(e=!0,t=t.substring(0,t.length-1).trim());var i,o=!1;if("@"===t.charAt(0))o=t.substring(1).trim();else{var r=m(t,0,"(").trim();if(r.length>0&&r.toUpperCase()===r)for(var a=0;a<r.length;a++)if(i=r.charAt(a),l.test(i)){o=t;break}}if(o){var s,u=p(o,0,"()");return u&&(o=u.before.trim(),s=u.between.trim()),s?n.notif.character(o,{extension:s,isDualDialogue:e}):n.notif.character(o,{isDualDialogue:e}),!0}return!1}(n,r)||(!n.previousLineBlank&&function(n){return"character"===n.lastElementNature||"dialogue"===n.lastElementNature||"parenthetical"===n.lastElementNature}(n)?function(n,t){if("("===t.charAt(0)){var e=t.indexOf(")");if(e>0){n.notif.parenthetical(t.substring(1,e));var i=t.substring(e+1).trim();i.length>0&&n.notif.dialogue(i)}else n.notif.parenthetical(t.substring(1))}else n.notif.dialogue(t)}(n,r):n.notif.action(r,e,{}))}}return!0}function d(n,t,e){var i=t.substring(0,e).trim();if(n.currentKey=i,n.metaInformation[n.currentKey]=[],e<t.length){var o=t.substring(e+1).trim();o.length>0&&n.metaInformation[n.currentKey].push(o)}}function p(n,t,e){for(var i=0,o={before:"",between:"",after:""},r=t;r<n.length;r++){var a=n.charAt(r);if(0===i&&a===e[0])o.before=n.substring(t,r),i=1;else{if(1===i&&a===e[1]){o.after=n.substring(r+1),i=3;break}1===i&&(o.between=o.between+a)}}return 3===i&&o}function m(n,t,e){for(var i=t;i<n.length;i++){var o=n.charAt(i);if(e.indexOf(o)>=0)return n.substring(t,i)}return n.substring(t)}function b(n,t){var e=function(n){return{state:0,lineno:0,blockContext:{state:0,nestedDepth:0,line:"",lineno:0,blocks:[],lastChunk:""},metaInformation:{},previousLineBlank:!0,nextLineBlank:void 0,notif:n||{startOfDocument:function(){console.log("startOfDocument")},titlePage:function(n){console.log("titlePage:",n)},sceneHeading:function(n,t){console.log("sceneHeading:<"+n+">",t)},action:function(n,t,e){console.log("action:<"+n+"> options:",e)},pageBreak:function(){console.log("pageBreak")},dualDialogueStart:function(){console.log("dualDialogueStart")},dualDialogueEnd:function(){console.log("dualDialogueEnd")},dialogueStart:function(){console.log("dialogueStart")},dialogueEnd:function(){console.log("dialogueEnd")},character:function(n,t){t.extension?console.log("character:<"+n+"> option:",t):console.log("character:<"+n+">")},parenthetical:function(n){console.log("parenthetical:<"+n+">")},dialogue:function(n){console.log("dialogue:<"+n+">")},transition:function(n){console.log("transition:<"+n+">")},section:function(n,t,e){console.log("section:"+t+"<"+n+">",e)},synopsis:function(n){console.log("synopsis:<"+n+">")},block:function(n){console.log("block:<"+n+">")},endOfDocument:function(){console.log("endOfDocument")}}}}();e.notif=function(n,t,e){var i=!1,o=[];function r(){o.length>0&&(t.dialogueStart(),o.forEach((function(n){n()})),t.dialogueEnd()),o.length=0}function a(){r(),i&&(t.dualDialogueEnd(),i=!1)}return{startOfDocument:function(){t.startOfDocument(),n.lastElementNature="startOfDocument"},titlePage:function(e){t.titlePage(e),n.lastElementNature="titlePage"},sceneHeading:function(e,i){a(),t.sceneHeading(e,i),n.lastElementNature="sceneHeading"},action:function(e,i,o){a(),t.action(e,i,o),n.lastElementNature="action"},pageBreak:function(){a(),t.pageBreak(),n.lastElementNature="pageBreak"},character:function(e,a){o.length>0&&(a.isDualDialogue&&!i?(t.dualDialogueStart(),i=!0,r()):(r(),i&&(t.dualDialogueEnd(),i=!1))),o.push((function(){t.character(e,a)})),n.lastElementNature="character"},parenthetical:function(e){o.push((function(){t.parenthetical(e)})),n.lastElementNature="parenthetical"},dialogue:function(e){o.push((function(){t.dialogue(e)})),n.lastElementNature="dialogue"},transition:function(e){a(),t.transition(e),n.lastElementNature="transition"},section:function(e,i,o){a(),t.section(e,i,o),n.lastElementNature="section"},synopsis:function(e){t.synopsis(e),n.lastElementNature="synopsis"},block:function(n){t.block(n)},dialogueStart:function(){t.dialogueStart(),n.lastElementNature="dialogueStart"},dialogueEnd:function(){t.dialogueEnd(),n.lastElementNature="dialogueEnd"},dualDialogueStart:function(){t.dualDialogueStart(),n.lastElementNature="dualDialogueStart"},dualDialogueEnd:function(){t.dualDialogueEnd(),n.lastElementNature="dualDialogueEnd"},endOfDocument:function(){a(),t.endOfDocument(),n.lastElementNature="endOfDocument"}}}(e,t);const i=n.split(/\r?\n/);e.notif.startOfDocument();for(const n of i)u(e,n);u(e,""),2===e.state&&e.notif.titlePage(e.metaInformation),e.notif.endOfDocument()}function v(n){const t=function(){const n=[];function t(t){n.push(t)}function e(t,e){n.push(`${t}||${e}`)}function i(t,e){n.push(`${t}||${JSON.stringify(e)}`)}const o={startOfDocument:function(){t("startOfDocument")},titlePage:function(n){i("titlePage",n)},sceneHeading:function(t,e){var i,o;i=t,o=e,n.push(`sceneHeading||${i}||${o}`)},action:function(t,e,i){var o,r,a;o=t,r=e,a=i,n.push(`action||${o}||${JSON.stringify(r)}||${JSON.stringify(a)}`)},pageBreak:function(){t("pageBreak")},dualDialogueStart:function(){t("dualDialogueStart")},dualDialogueEnd:function(){t("dualDialogueEnd")},dialogueStart:function(){t("dialogueStart")},dialogueEnd:function(){t("dialogueEnd")},character:function(t,e){var i,o;i=t,o=e,n.push(`character||${i}||${JSON.stringify(o)}`)},parenthetical:function(n){e("parenthetical",n)},dialogue:function(n){e("dialogue",n)},transition:function(n){e("transition",n)},section:function(t,e,i){!function(t,e,i,o){n.push(`section||${e}||${i}||${JSON.stringify(o)}`)}(0,t,e,i)},synopsis:function(n){e("synopsis",n)},block:function(n){i("block",n)},endOfDocument:function(){t("endOfDocument")}};return{getNotification:()=>o,getResult:()=>n}}();return b(n,t.getNotification()),console.log(t.getResult()),`<p class="action">${n.replace(/\b\w{6,}\b/g,"<strong>$&</strong>")}</p>`}const k=JSON.parse('{"UU":"scriptview/scrippet-block"}');(0,n.registerBlockType)(k.UU,{edit:function({attributes:n,setAttributes:o,isSelected:r}){const{fountainSource:a=""}=n;var[l,s]=(0,e.useState)(n.fountainHtml||"");const u=(0,i.useBlockProps)();return(0,e.useEffect)((function(){const n=v(a);o({fountainHtml:n}),s(n)}),[]),(0,t.createElement)("div",{...u},r&&(0,t.createElement)(t.Fragment,null,(0,t.createElement)("pre",{className:"mermaid-editor wp-block-code"},(0,t.createElement)(i.PlainText,{onChange:function(n){var t=v(n);o({fountainSource:n,fountainHtml:t}),s(t)},value:a})),(0,t.createElement)("hr",null)),(0,t.createElement)("div",{className:"scrippet-fountain-html",dangerouslySetInnerHTML:{__html:l}}))},save:function(n){const{fountainSource:e,fountainHtml:o}=n.attributes,r=i.useBlockProps.save({className:"scrippet-block"});return(0,t.createElement)("div",{...r},(0,t.createElement)("pre",{className:"scrippet-fountain-source",style:{display:"none"}},e),(0,t.createElement)("div",{className:"scrippet-fountain-html",dangerouslySetInnerHTML:{__html:o}}))}})}},e={};function i(n){var o=e[n];if(void 0!==o)return o.exports;var r=e[n]={exports:{}};return t[n](r,r.exports,i),r.exports}i.m=t,n=[],i.O=(t,e,o,r)=>{if(!e){var a=1/0;for(c=0;c<n.length;c++){for(var[e,o,r]=n[c],l=!0,s=0;s<e.length;s++)(!1&r||a>=r)&&Object.keys(i.O).every((n=>i.O[n](e[s])))?e.splice(s--,1):(l=!1,r<a&&(a=r));if(l){n.splice(c--,1);var u=o();void 0!==u&&(t=u)}}return t}r=r||0;for(var c=n.length;c>0&&n[c-1][2]>r;c--)n[c]=n[c-1];n[c]=[e,o,r]},i.o=(n,t)=>Object.prototype.hasOwnProperty.call(n,t),(()=>{var n={57:0,350:0};i.O.j=t=>0===n[t];var t=(t,e)=>{var o,r,[a,l,s]=e,u=0;if(a.some((t=>0!==n[t]))){for(o in l)i.o(l,o)&&(i.m[o]=l[o]);if(s)var c=s(i)}for(t&&t(e);u<a.length;u++)r=a[u],i.o(n,r)&&n[r]&&n[r][0](),n[r]=0;return i.O(c)},e=globalThis.webpackChunkscrippet_block=globalThis.webpackChunkscrippet_block||[];e.forEach(t.bind(null,0)),e.push=t.bind(null,e.push.bind(e))})();var o=i.O(void 0,[350],(()=>i(870)));o=i.O(o)})();