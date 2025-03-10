"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[284],{85095:(e,s,a)=>{a.d(s,{ResellerHeader:()=>f});var t=a(95155),r=a(12115),n=a(2615),l=a(14085),d=a(63898),i=a(20750),o=a(86710),c=a(1466),m=a(65236);function f(){var e,s;let{data:a}=(0,n.useSession)(),[f,u]=(0,r.useState)(!1);return(0,t.jsxs)("header",{className:"sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6",children:[(0,t.jsxs)(l.$,{variant:"ghost",size:"icon",className:"md:hidden",onClick:()=>{u(!f);let e=new CustomEvent("toggle-sidebar",{detail:{isOpen:!f}});window.dispatchEvent(e)},children:[(0,t.jsx)(o.A,{className:"h-5 w-5"}),(0,t.jsx)("span",{className:"sr-only",children:"Toggle sidebar"})]}),(0,t.jsx)("div",{className:"flex-1"}),(0,t.jsxs)(i.rI,{children:[(0,t.jsx)(i.ty,{asChild:!0,children:(0,t.jsx)(l.$,{variant:"ghost",size:"icon",className:"rounded-full",children:(0,t.jsx)(d.eu,{className:"h-8 w-8",children:(0,t.jsx)(d.q5,{children:(null==a?void 0:null===(s=a.user)||void 0===s?void 0:null===(e=s.name)||void 0===e?void 0:e.charAt(0))||"R"})})})}),(0,t.jsxs)(i.SQ,{align:"end",children:[(0,t.jsx)(i.lp,{children:"Akun Saya"}),(0,t.jsx)(i.mB,{}),(0,t.jsxs)(i._2,{children:[(0,t.jsx)(c.A,{className:"mr-2 h-4 w-4"}),(0,t.jsx)("span",{children:"Profil"})]}),(0,t.jsxs)(i._2,{onClick:()=>(0,n.signOut)(),children:[(0,t.jsx)(m.A,{className:"mr-2 h-4 w-4"}),(0,t.jsx)("span",{children:"Keluar"})]})]})]})]})}},59044:(e,s,a)=>{a.d(s,{ResellerSidebar:()=>b});var t=a(95155),r=a(12115),n=a(48173),l=a.n(n),d=a(76046),i=a(80090),o=a(14085),c=a(3392),m=a(29602),f=a(86710),u=a(60719),x=a(40767),p=a(66507),h=a(18474),v=a(16233),g=a(65236),N=a(2615);function b(e){let{className:s}=e,a=(0,d.usePathname)(),n=(0,i.a)(),[b,j]=(0,r.useState)(!1),y=(0,r.useRef)(null);(0,r.useEffect)(()=>{let e=e=>{n&&b&&y.current&&!y.current.contains(e.target)&&j(!1)};return document.addEventListener("mousedown",e),()=>{document.removeEventListener("mousedown",e)}},[n,b]),(0,r.useEffect)(()=>{n&&j(!1)},[a,n]);let w=async()=>{await (0,N.signOut)({callbackUrl:"/"})};return(0,t.jsxs)(t.Fragment,{children:[n&&(0,t.jsx)(o.$,{variant:"outline",size:"icon",className:"fixed top-4 left-4 z-40 md:hidden",onClick:()=>{j(!b)},"aria-label":"Toggle Menu",children:(0,t.jsx)(f.A,{className:"h-5 w-5"})}),(0,t.jsxs)("div",{ref:y,className:(0,m.cn)("fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-sm transition-transform duration-300 ease-in-out transform md:translate-x-0 md:static md:z-0",n&&!b&&"-translate-x-full",n&&b&&"translate-x-0",s),children:[(0,t.jsxs)("div",{className:"flex h-14 items-center px-4 border-b",children:[(0,t.jsxs)(l(),{href:"/reseller/dashboard",className:"flex items-center font-semibold text-lg",children:[(0,t.jsx)(u.A,{className:"mr-2 h-5 w-5"}),(0,t.jsx)("span",{children:"Paket Reseller"})]}),n&&b&&(0,t.jsx)(o.$,{variant:"ghost",size:"icon",className:"ml-auto",onClick:()=>{j(!1)},"aria-label":"Close Menu",children:(0,t.jsx)(x.A,{className:"h-5 w-5"})})]}),(0,t.jsxs)(c.F,{className:"h-[calc(100vh-3.5rem)]",children:[(0,t.jsx)("div",{className:"px-3 py-2",children:(0,t.jsxs)("nav",{className:"flex flex-col gap-1",children:[(0,t.jsxs)(l(),{href:"/reseller/dashboard",className:(0,m.cn)("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors","/reseller/dashboard"===a&&"bg-muted"),children:[(0,t.jsx)(p.A,{className:"h-4 w-4"}),(0,t.jsx)("span",{children:"Dashboard"})]}),(0,t.jsxs)(l(),{href:"/reseller/packages",className:(0,m.cn)("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors",a.startsWith("/reseller/packages")&&"bg-muted"),children:[(0,t.jsx)(u.A,{className:"h-4 w-4"}),(0,t.jsx)("span",{children:"Katalog Paket"})]}),(0,t.jsxs)(l(),{href:"/reseller/transactions",className:(0,m.cn)("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors",a.startsWith("/reseller/transactions")&&"bg-muted"),children:[(0,t.jsx)(h.A,{className:"h-4 w-4"}),(0,t.jsx)("span",{children:"Transaksi"})]}),(0,t.jsxs)(l(),{href:"/reseller/payments",className:(0,m.cn)("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted transition-colors",a.startsWith("/reseller/payments")&&"bg-muted"),children:[(0,t.jsx)(v.A,{className:"h-4 w-4"}),(0,t.jsx)("span",{children:"Pembayaran"})]})]})}),(0,t.jsx)("div",{className:"absolute bottom-4 left-0 right-0 px-3",children:(0,t.jsxs)(o.$,{variant:"outline",className:"w-full justify-start",onClick:w,children:[(0,t.jsx)(g.A,{className:"mr-2 h-4 w-4"}),"Keluar"]})})]})]})]})}},63898:(e,s,a)=>{a.d(s,{eu:()=>d,q5:()=>i});var t=a(95155),r=a(12115),n=a(74920),l=a(29602);let d=r.forwardRef((e,s)=>{let{className:a,...r}=e;return(0,t.jsx)(n.bL,{ref:s,className:(0,l.cn)("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",a),...r})});d.displayName=n.bL.displayName,r.forwardRef((e,s)=>{let{className:a,...r}=e;return(0,t.jsx)(n._V,{ref:s,className:(0,l.cn)("aspect-square h-full w-full",a),...r})}).displayName=n._V.displayName;let i=r.forwardRef((e,s)=>{let{className:a,...r}=e;return(0,t.jsx)(n.H4,{ref:s,className:(0,l.cn)("flex h-full w-full items-center justify-center rounded-full bg-muted",a),...r})});i.displayName=n.H4.displayName},14085:(e,s,a)=>{a.d(s,{$:()=>o,r:()=>i});var t=a(95155),r=a(12115),n=a(12317),l=a(31027),d=a(29602);let i=(0,l.F)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2",sm:"h-8 rounded-md px-3 text-xs",lg:"h-10 rounded-md px-8",icon:"h-9 w-9"}},defaultVariants:{variant:"default",size:"default"}}),o=r.forwardRef((e,s)=>{let{className:a,variant:r,size:l,asChild:o=!1,...c}=e,m=o?n.DX:"button";return(0,t.jsx)(m,{className:(0,d.cn)(i({variant:r,size:l,className:a})),ref:s,...c})});o.displayName="Button"},35007:(e,s,a)=>{a.d(s,{BT:()=>o,Wu:()=>c,ZB:()=>i,Zp:()=>l,aR:()=>d,wL:()=>m});var t=a(95155),r=a(12115),n=a(29602);let l=r.forwardRef((e,s)=>{let{className:a,...r}=e;return(0,t.jsx)("div",{ref:s,className:(0,n.cn)("rounded-xl border bg-card text-card-foreground shadow",a),...r})});l.displayName="Card";let d=r.forwardRef((e,s)=>{let{className:a,...r}=e;return(0,t.jsx)("div",{ref:s,className:(0,n.cn)("flex flex-col space-y-1.5 p-6",a),...r})});d.displayName="CardHeader";let i=r.forwardRef((e,s)=>{let{className:a,...r}=e;return(0,t.jsx)("div",{ref:s,className:(0,n.cn)("font-semibold leading-none tracking-tight",a),...r})});i.displayName="CardTitle";let o=r.forwardRef((e,s)=>{let{className:a,...r}=e;return(0,t.jsx)("div",{ref:s,className:(0,n.cn)("text-sm text-muted-foreground",a),...r})});o.displayName="CardDescription";let c=r.forwardRef((e,s)=>{let{className:a,...r}=e;return(0,t.jsx)("div",{ref:s,className:(0,n.cn)("p-6 pt-0",a),...r})});c.displayName="CardContent";let m=r.forwardRef((e,s)=>{let{className:a,...r}=e;return(0,t.jsx)("div",{ref:s,className:(0,n.cn)("flex items-center p-6 pt-0",a),...r})});m.displayName="CardFooter"},20750:(e,s,a)=>{a.d(s,{SQ:()=>f,_2:()=>u,lp:()=>x,mB:()=>p,rI:()=>c,ty:()=>m});var t=a(95155),r=a(12115),n=a(80937),l=a(46967),d=a(98867),i=a(33565),o=a(29602);let c=n.bL,m=n.l9;n.YJ,n.ZL,n.Pb,n.z6,r.forwardRef((e,s)=>{let{className:a,inset:r,children:d,...i}=e;return(0,t.jsxs)(n.ZP,{ref:s,className:(0,o.cn)("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",r&&"pl-8",a),...i,children:[d,(0,t.jsx)(l.A,{className:"ml-auto"})]})}).displayName=n.ZP.displayName,r.forwardRef((e,s)=>{let{className:a,...r}=e;return(0,t.jsx)(n.G5,{ref:s,className:(0,o.cn)("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",a),...r})}).displayName=n.G5.displayName;let f=r.forwardRef((e,s)=>{let{className:a,sideOffset:r=4,...l}=e;return(0,t.jsx)(n.ZL,{children:(0,t.jsx)(n.UC,{ref:s,sideOffset:r,className:(0,o.cn)("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md","data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",a),...l})})});f.displayName=n.UC.displayName;let u=r.forwardRef((e,s)=>{let{className:a,inset:r,...l}=e;return(0,t.jsx)(n.q7,{ref:s,className:(0,o.cn)("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0",r&&"pl-8",a),...l})});u.displayName=n.q7.displayName,r.forwardRef((e,s)=>{let{className:a,children:r,checked:l,...i}=e;return(0,t.jsxs)(n.H_,{ref:s,className:(0,o.cn)("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",a),checked:l,...i,children:[(0,t.jsx)("span",{className:"absolute left-2 flex h-3.5 w-3.5 items-center justify-center",children:(0,t.jsx)(n.VF,{children:(0,t.jsx)(d.A,{className:"h-4 w-4"})})}),r]})}).displayName=n.H_.displayName,r.forwardRef((e,s)=>{let{className:a,children:r,...l}=e;return(0,t.jsxs)(n.hN,{ref:s,className:(0,o.cn)("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",a),...l,children:[(0,t.jsx)("span",{className:"absolute left-2 flex h-3.5 w-3.5 items-center justify-center",children:(0,t.jsx)(n.VF,{children:(0,t.jsx)(i.A,{className:"h-2 w-2 fill-current"})})}),r]})}).displayName=n.hN.displayName;let x=r.forwardRef((e,s)=>{let{className:a,inset:r,...l}=e;return(0,t.jsx)(n.JU,{ref:s,className:(0,o.cn)("px-2 py-1.5 text-sm font-semibold",r&&"pl-8",a),...l})});x.displayName=n.JU.displayName;let p=r.forwardRef((e,s)=>{let{className:a,...r}=e;return(0,t.jsx)(n.wv,{ref:s,className:(0,o.cn)("-mx-1 my-1 h-px bg-muted",a),...r})});p.displayName=n.wv.displayName},3392:(e,s,a)=>{a.d(s,{F:()=>d});var t=a(95155),r=a(12115),n=a(21868),l=a(29602);let d=r.forwardRef((e,s)=>{let{className:a,children:r,...d}=e;return(0,t.jsxs)(n.bL,{ref:s,className:(0,l.cn)("relative overflow-hidden",a),...d,children:[(0,t.jsx)(n.LM,{className:"h-full w-full rounded-[inherit]",children:r}),(0,t.jsx)(i,{}),(0,t.jsx)(n.OK,{})]})});d.displayName=n.bL.displayName;let i=r.forwardRef((e,s)=>{let{className:a,orientation:r="vertical",...d}=e;return(0,t.jsx)(n.VM,{ref:s,orientation:r,className:(0,l.cn)("flex touch-none select-none transition-colors","vertical"===r&&"h-full w-2.5 border-l border-l-transparent p-[1px]","horizontal"===r&&"h-2.5 flex-col border-t border-t-transparent p-[1px]",a),...d,children:(0,t.jsx)(n.lr,{className:"relative flex-1 rounded-full bg-border"})})});i.displayName=n.VM.displayName},80090:(e,s,a)=>{a.d(s,{a:()=>r});var t=a(12115);function r(){let[e,s]=(0,t.useState)(!1);return(0,t.useEffect)(()=>{let e=()=>{s(window.innerWidth<768)};return e(),window.addEventListener("resize",e),()=>{window.removeEventListener("resize",e)}},[]),e}},29602:(e,s,a)=>{a.d(s,{Yq:()=>i,cn:()=>d,vv:()=>o});var t=a(43463),r=a(69795),n=a(87949),l=a(40687);function d(){for(var e=arguments.length,s=Array(e),a=0;a<e;a++)s[a]=arguments[a];return(0,r.QP)((0,t.$)(s))}function i(e){return(0,n.GP)(e,"d MMMM yyyy",{locale:l.id})}function o(e){return new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(e)}}}]);