!function(e,t){function n(e){return e.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function r(e){return e.replace(/-+(.)?/g,function(){return arguments[1].toUpperCase()})}function i(e,t){return T.isNumber(t)&&!h[n(e)]?t+"px":t}function a(e,t){return c.getComputedStyle(e,null).getPropertyValue(t)}var o,u,c=e,s=e.document,l="addEventListener",f="removeEventListener";o=function(e,t){return new u(e,t)},u=function(e,t){var n;return this.length=0,e?"string"==typeof e?(e=e.trim(),"body"===e&&!t&&s.body?(this[0]=s.body,this.length=1,this):(n=o.selector(e,t),o.makeArray(n,this))):e.nodeType||"object"==typeof e&&"setInterval"in e?(this[0]=e,this.length=1,this):"number"==typeof e.length?o.makeArray(e,this):void 0:this},u.prototype=o.prototype,o.mix=function(e,n,r,i){if(e&&n){r===t&&(r=!0);var a,o,u,c=function(t){r!==!0&&t in e||(e[t]=n[t])};if(i&&(o=i.length))for(u=o;u;)a=i[--u],a in n&&c(a);else for(a in n)c(a);return e}},o.mix(o,{version:"1.1.2",__uuid__:2,guid:function(e){return(e||"tvYun_")+ +new Date+(Math.random()+"").slice(-8)}}),e.TVYUN=e.T=o,T.mix(T,{id:function(e){return s.getElementById(e)},"class":function(e){return s.getElementsByClassName(e)},tag:function(e){return s.getElementsByTagName(e)},query:function(e){return s.querySelector(e)},queryAll:function(e){return s.querySelectorAll(e)},selector:function(e,t){t=t||s;var n,r,i,a,o=[],u=T.contains,c=T.makeArray;try{for(t=c(t),i=t.length,n=t[0],a=0;i>a;a++)r=t[a],u(n,r)||(n=r,o=c(r.querySelectorAll(e),o));return n=r=t=null,o}catch(l){}}}),["Array","Function","Object","RegExp"].forEach(function(e){T["is"+e]=function(t){return t&&{}.toString.call(t)==="[object "+e+"]"}}),["Boolean","Number","String"].forEach(function(e){T["is"+e]=function(t){return typeof t===e.toLowerCase()}}),Array.isArray&&(T.isArray=Array.isArray),T.mix(T,{isEmptyObject:function(e){var t;for(t in e)return!1;return!0},isWindow:function(e){return e&&"object"==typeof e&&"setInterval"in e},each:function(e,n,r){var i,a=e.length===t||"function"==typeof e;if(a)for(i in e)if(n.call(r,i,e[i])===!1)break;return e},makeArray:function(n,r){r=r||[];var i=0,a=n.length;if(null!==n&&n!==t){if(T.isArray(n)&&T.isArray(r)&&!r.length)return n;if("number"!=typeof a||"string"==typeof n||T.isFunction(n)||T.isRegExp(n)||n===e||n.tagName&&rSelectForm.test(n.tagName))r[r.length++]=n;else for(;a>i;i++)r[r.length++]=n[i]}return r},contains:function(e,t){return e.compareDocumentPosition?!!(16&e.compareDocumentPosition(t)):e.contains?e!==t&&e.contains(t):!1}});var h={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1};T.mix(T.prototype,{css:function(e,o){var u,c="";if(o==t){if(T.isString(e)){var s=this[0];return console.log(s),s?s.style[r(e)]||a(s,e):""}if(T.isObject(e))for(u in e)c+=n(u)+":"+i(u,e[u])+";"}else c=n(e)+":"+i(e,o)+";";return T.each(this,function(e){e.style.cssText+=";"+c})},addClass:function(e){e+="";var t=e.split(" "),n=t.length;return this.forEach(function(){if(1===this.nodeType){var r,i=this.className,a=i,o=0;if(i){for(i=" "+i+" ";n>o;o++)r=t[o],~i.indexOf(" "+r+" ")||(a+=" "+r);this.className=a}else this.className=e}})},removeClass:function(e){var t,n,r;return T.isString(e)?(t=e.split(" "),n=t.length):r=!0,this.forEach(function(){if(1===this.nodeType){var e=this.className,i=0;if(e)if(r)this.className="";else{for(e=" "+e+" ";n>i;i++)e=e.replace(" "+t[i]+" "," ");this.className=e.trim()}}})}}),T.mix(T.prototype,{forEach:function(e){for(var t=this.length,n=0;t>n;n++)e.call(this[n],n,this);return this}}),T.cache={},T.euid=T.guid();var m={getCacheIndex:function(e,t){if(1===e.nodeType){var n=T.euid;return!t||n in e?e[n]:e[n]=++T.__uuid__}return T.isWindow(e)?0:9===e.nodeType?1:"HTML"===e.tagName?2:-1},data:function(e,n,r,i,a){var o,u=T.cache,c=null!==n,s=i===t,l=m.getCacheIndex(e,!s);if(l!==t){if(l in u||s||(u[l]={}),u=u[l],!u)return;if(c){if(!(n in u)){if(s)return;u[n]={}}o=u[n][r]}else o=u[r];if(s||!a&&o!==t)return o;if(a||!s)return c?u[n][r]=i:u[r]=i,i}},removeData:function(e,n,r){var i=m.getCacheIndex(e),a=T.cache;if(i in a){if(a=a[i],r&&(null!==n?a[n]&&delete a[n][r]:delete a[r]),(!r||null!==n&&T.isEmptyObject(a[n]))&&(a[n]=null,delete a[n]),T.isEmptyObject(a)&&(delete T.cache[i],a=t),3>i)return;if(a===t)try{delete e[T.euid]}catch(o){e.removeAttribute(T.euid)}}}},d={data:function(e,t,n){return m.data(e,"event",t,n)},removeData:function(e,t){return m.removeData(e,"event",t)},addEvent:function(e){var n=e.capture===t?!1:e.capture,r=e.type,i=e.elems,a=e.dataName,o=i.length,u=0,c={handle:e.handle};for(e.namespace&&(c.namespace=e.namespace);o>u;u++)elem=i[u],handles=this.data(elem,a,[]),handles.push(c),1===handles.length&&(handles.unshift({handle:e.handle}),elem[l](r,e.handle,n))},removeEvent:function(e){for(var n,r,i,a,o=e.capture===t?!1:e.capture,u=e.type,c=e.handle,s=e.elems,l=e.dataName,h=e.namespace,m=s.length,d=0;m>d;d++)if(i=s[d],n=this.data(i,l)){if(c||h)for(a=1;a<n.length;a++)if(r=n[a],!(h&&r.namespace!==h||c&&r.handle!==c)){if(n.splice(a,1),c)break;a--}(!c&&!h||1===n.length)&&(i[f](u,n[0].handle,o),this.removeData(i,l))}}};T.each({on:"setup",un:"teardown"},function(e){T.prototype[e]=function(t,n,r){var i=t.match(/[^\s]+/g),a=i.length,o="on"===e,u={};return 1===a&&(dataName=t,u.namespace=t),r||n&&T.isFunction(n)&&(r=n,n=null),T.mix(u,{elems:this,type:t,handle:r,dataName:dataName,selector:n}),d[o?"addEvent":"removeEvent"](u),this}})}(window);