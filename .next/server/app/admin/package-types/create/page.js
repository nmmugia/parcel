"use strict";(()=>{var e={};e.id=2506,e.ids=[2506],e.modules={96330:e=>{e.exports=require("@prisma/client")},5486:e=>{e.exports=require("bcrypt")},10846:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:e=>{e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},3295:e=>{e.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},29294:e=>{e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},12412:e=>{e.exports=require("assert")},79428:e=>{e.exports=require("buffer")},55511:e=>{e.exports=require("crypto")},94735:e=>{e.exports=require("events")},81630:e=>{e.exports=require("http")},55591:e=>{e.exports=require("https")},33873:e=>{e.exports=require("path")},11723:e=>{e.exports=require("querystring")},79551:e=>{e.exports=require("url")},28354:e=>{e.exports=require("util")},74075:e=>{e.exports=require("zlib")},46225:(e,r,t)=>{t.r(r),t.d(r,{GlobalError:()=>i.a,__next_app__:()=>u,pages:()=>l,routeModule:()=>c,tree:()=>d});var a=t(70260),s=t(28203),n=t(25155),i=t.n(n),o=t(67292),p={};for(let e in o)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(p[e]=()=>o[e]);t.d(r,p);let d=["",{children:["admin",{children:["package-types",{children:["create",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,4626)),"/home/beane/projects/my-app/my-app/app/admin/package-types/create/page.tsx"]}]},{}]},{}]},{metadata:{icon:[async e=>(await Promise.resolve().then(t.bind(t,46055))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}]},{layout:[()=>Promise.resolve().then(t.bind(t,19611)),"/home/beane/projects/my-app/my-app/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(t.t.bind(t,19937,23)),"next/dist/client/components/not-found-error"],forbidden:[()=>Promise.resolve().then(t.t.bind(t,69116,23)),"next/dist/client/components/forbidden-error"],unauthorized:[()=>Promise.resolve().then(t.t.bind(t,41485,23)),"next/dist/client/components/unauthorized-error"],metadata:{icon:[async e=>(await Promise.resolve().then(t.bind(t,46055))).default(e)],apple:[],openGraph:[],twitter:[],manifest:void 0}}],l=["/home/beane/projects/my-app/my-app/app/admin/package-types/create/page.tsx"],u={require:t,loadChunk:()=>Promise.resolve()},c=new a.AppPageRouteModule({definition:{kind:s.RouteKind.APP_PAGE,page:"/admin/package-types/create/page",pathname:"/admin/package-types/create",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},4626:(e,r,t)=>{t.r(r),t.d(r,{default:()=>d});var a=t(62740),s=t(51825),n=t(31831),i=t(45369),o=t(9742),p=t(71100);async function d(){let e=await (0,s.getServerSession)(i.N);return e&&"ADMIN"===e.user.role||(0,n.redirect)("/"),(0,a.jsx)(o.U,{children:(0,a.jsxs)("div",{className:"p-6",children:[(0,a.jsx)("h1",{className:"text-2xl font-bold mb-6",children:"Tambah Jenis Paket"}),(0,a.jsx)(p.PackageTypeForm,{})]})})}}};var r=require("../../../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),a=r.X(0,[638,8728,3618,7928,159,1957,8310,8580,4999,4563,1175],()=>t(46225));module.exports=a})();