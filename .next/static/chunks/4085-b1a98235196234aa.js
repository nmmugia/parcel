(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4085],{1169:(e,t,a)=>{Promise.resolve().then(a.bind(a,27641)),Promise.resolve().then(a.bind(a,24146)),Promise.resolve().then(a.bind(a,3989))},3989:(e,t,a)=>{"use strict";a.d(t,{ResellerForm:()=>y});var r=a(95155),s=a(12115),n=a(76046),l=a(69606),i=a(85060),o=a(43415),d=a(14085),c=a(34839),u=a(9955),m=a(89134),p=a(35007),f=a(14505),x=a(23920),h=a(7837);let g=o.z.object({name:o.z.string().min(1,"Nama reseller wajib diisi"),email:o.z.string().email("Email tidak valid")});function y(e){let{reseller:t}=e,[a,o]=(0,s.useState)(!1),[y,j]=(0,s.useState)(!1),[v,b]=(0,s.useState)(""),N=(0,n.useRouter)(),{toast:w}=(0,m.dj)(),k=(0,l.mN)({resolver:(0,i.u)(g),defaultValues:{name:(null==t?void 0:t.name)||"",email:(null==t?void 0:t.email)||""}}),C=async e=>{o(!0);try{let a=t?"/api/resellers/".concat(t.id):"/api/resellers",r=t?"PUT":"POST",s=await fetch(a,{method:r,headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!s.ok){let e=await s.json();throw Error(e.message||"Terjadi kesalahan saat menyimpan reseller")}let n=await s.json();w({title:"Berhasil",description:t?"Reseller berhasil diperbarui":"Reseller berhasil ditambahkan"}),t?(N.push("/admin/resellers"),N.refresh()):(b(n.password),j(!0))}catch(e){w({variant:"destructive",title:"Gagal",description:e instanceof Error?e.message:"Terjadi kesalahan saat menyimpan reseller"})}finally{o(!1)}},R=e=>{navigator.clipboard.writeText(e),w({title:"Berhasil",description:"Password berhasil disalin ke clipboard"})};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(p.Zp,{children:(0,r.jsx)(p.Wu,{className:"pt-6",children:(0,r.jsx)(c.lV,{...k,children:(0,r.jsxs)("form",{onSubmit:k.handleSubmit(C),className:"space-y-6",children:[(0,r.jsx)(c.zB,{control:k.control,name:"name",render:e=>{let{field:t}=e;return(0,r.jsxs)(c.eI,{children:[(0,r.jsx)(c.lR,{children:"Nama Reseller"}),(0,r.jsx)(c.MJ,{children:(0,r.jsx)(u.p,{placeholder:"Masukkan nama reseller",...t})}),(0,r.jsx)(c.C5,{})]})}}),(0,r.jsx)(c.zB,{control:k.control,name:"email",render:e=>{let{field:t}=e;return(0,r.jsxs)(c.eI,{children:[(0,r.jsx)(c.lR,{children:"Email"}),(0,r.jsx)(c.MJ,{children:(0,r.jsx)(u.p,{type:"email",placeholder:"Masukkan email reseller",...t})}),(0,r.jsx)(c.C5,{})]})}}),(0,r.jsxs)("div",{className:"flex justify-end gap-4",children:[(0,r.jsx)(d.$,{type:"button",variant:"outline",onClick:()=>N.push("/admin/resellers"),children:"Batal"}),(0,r.jsxs)(d.$,{type:"submit",disabled:a,children:[a&&(0,r.jsx)(f.A,{className:"mr-2 h-4 w-4 animate-spin"}),t?"Perbarui":"Simpan"]})]})]})})})}),(0,r.jsx)(h.lG,{open:y,onOpenChange:j,children:(0,r.jsxs)(h.Cf,{children:[(0,r.jsxs)(h.c7,{children:[(0,r.jsx)(h.L3,{children:"Reseller Berhasil Ditambahkan"}),(0,r.jsx)(h.rr,{children:"Password untuk reseller ini telah dibuat secara otomatis. Salin password ini dan bagikan kepada reseller."})]}),(0,r.jsx)("div",{className:"space-y-4",children:(0,r.jsxs)("div",{className:"text-center",children:[(0,r.jsx)("p",{className:"mb-2",children:"Password:"}),(0,r.jsxs)("div",{className:"flex items-center justify-center gap-2",children:[(0,r.jsx)(u.p,{value:v,readOnly:!0,className:"text-center font-mono"}),(0,r.jsx)(d.$,{variant:"outline",size:"icon",onClick:()=>R(v),children:(0,r.jsx)(x.A,{className:"h-4 w-4"})})]}),(0,r.jsx)("p",{className:"mt-2 text-sm text-muted-foreground",children:"Password ini hanya akan ditampilkan sekali"})]})}),(0,r.jsx)(h.Es,{children:(0,r.jsx)(d.$,{onClick:()=>{j(!1),N.push("/admin/resellers"),N.refresh()},children:"Selesai"})})]})})]})}},7837:(e,t,a)=>{"use strict";a.d(t,{Cf:()=>m,Es:()=>f,L3:()=>x,c7:()=>p,lG:()=>o,rr:()=>h,zM:()=>d});var r=a(95155),s=a(12115),n=a(66217),l=a(40767),i=a(29602);let o=n.bL,d=n.l9,c=n.ZL;n.bm;let u=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(n.hJ,{ref:t,className:(0,i.cn)("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",a),...s})});u.displayName=n.hJ.displayName;let m=s.forwardRef((e,t)=>{let{className:a,children:s,...o}=e;return(0,r.jsxs)(c,{children:[(0,r.jsx)(u,{}),(0,r.jsxs)(n.UC,{ref:t,className:(0,i.cn)("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",a),...o,children:[s,(0,r.jsxs)(n.bm,{className:"absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",children:[(0,r.jsx)(l.A,{className:"h-4 w-4"}),(0,r.jsx)("span",{className:"sr-only",children:"Close"})]})]})]})});m.displayName=n.UC.displayName;let p=e=>{let{className:t,...a}=e;return(0,r.jsx)("div",{className:(0,i.cn)("flex flex-col space-y-1.5 text-center sm:text-left",t),...a})};p.displayName="DialogHeader";let f=e=>{let{className:t,...a}=e;return(0,r.jsx)("div",{className:(0,i.cn)("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",t),...a})};f.displayName="DialogFooter";let x=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(n.hE,{ref:t,className:(0,i.cn)("text-lg font-semibold leading-none tracking-tight",a),...s})});x.displayName=n.hE.displayName;let h=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(n.VY,{ref:t,className:(0,i.cn)("text-sm text-muted-foreground",a),...s})});h.displayName=n.VY.displayName},34839:(e,t,a)=>{"use strict";a.d(t,{C5:()=>y,MJ:()=>h,Rr:()=>g,eI:()=>f,lR:()=>x,lV:()=>d,zB:()=>u});var r=a(95155),s=a(12115),n=a(12317),l=a(69606),i=a(29602),o=a(15785);let d=l.Op,c=s.createContext({}),u=e=>{let{...t}=e;return(0,r.jsx)(c.Provider,{value:{name:t.name},children:(0,r.jsx)(l.xI,{...t})})},m=()=>{let e=s.useContext(c),t=s.useContext(p),{getFieldState:a,formState:r}=(0,l.xW)(),n=a(e.name,r);if(!e)throw Error("useFormField should be used within <FormField>");let{id:i}=t;return{id:i,name:e.name,formItemId:"".concat(i,"-form-item"),formDescriptionId:"".concat(i,"-form-item-description"),formMessageId:"".concat(i,"-form-item-message"),...n}},p=s.createContext({}),f=s.forwardRef((e,t)=>{let{className:a,...n}=e,l=s.useId();return(0,r.jsx)(p.Provider,{value:{id:l},children:(0,r.jsx)("div",{ref:t,className:(0,i.cn)("space-y-2",a),...n})})});f.displayName="FormItem";let x=s.forwardRef((e,t)=>{let{className:a,...s}=e,{error:n,formItemId:l}=m();return(0,r.jsx)(o.J,{ref:t,className:(0,i.cn)(n&&"text-destructive",a),htmlFor:l,...s})});x.displayName="FormLabel";let h=s.forwardRef((e,t)=>{let{...a}=e,{error:s,formItemId:l,formDescriptionId:i,formMessageId:o}=m();return(0,r.jsx)(n.DX,{ref:t,id:l,"aria-describedby":s?"".concat(i," ").concat(o):"".concat(i),"aria-invalid":!!s,...a})});h.displayName="FormControl";let g=s.forwardRef((e,t)=>{let{className:a,...s}=e,{formDescriptionId:n}=m();return(0,r.jsx)("p",{ref:t,id:n,className:(0,i.cn)("text-[0.8rem] text-muted-foreground",a),...s})});g.displayName="FormDescription";let y=s.forwardRef((e,t)=>{var a;let{className:s,children:n,...l}=e,{error:o,formMessageId:d}=m(),c=o?String(null!==(a=null==o?void 0:o.message)&&void 0!==a?a:""):n;return c?(0,r.jsx)("p",{ref:t,id:d,className:(0,i.cn)("text-[0.8rem] font-medium text-destructive",s),...l,children:c}):null});y.displayName="FormMessage"},9955:(e,t,a)=>{"use strict";a.d(t,{p:()=>l});var r=a(95155),s=a(12115),n=a(29602);let l=s.forwardRef((e,t)=>{let{className:a,type:s,...l}=e;return(0,r.jsx)("input",{type:s,className:(0,n.cn)("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",a),ref:t,...l})});l.displayName="Input"},15785:(e,t,a)=>{"use strict";a.d(t,{J:()=>d});var r=a(95155),s=a(12115),n=a(46195),l=a(31027),i=a(29602);let o=(0,l.F)("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"),d=s.forwardRef((e,t)=>{let{className:a,...s}=e;return(0,r.jsx)(n.b,{ref:t,className:(0,i.cn)(o(),a),...s})});d.displayName=n.b.displayName},89134:(e,t,a)=>{"use strict";a.d(t,{dj:()=>m});var r=a(12115);let s=0,n=new Map,l=e=>{if(n.has(e))return;let t=setTimeout(()=>{n.delete(e),c({type:"REMOVE_TOAST",toastId:e})},1e6);n.set(e,t)},i=(e,t)=>{switch(t.type){case"ADD_TOAST":return{...e,toasts:[t.toast,...e.toasts].slice(0,1)};case"UPDATE_TOAST":return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case"DISMISS_TOAST":{let{toastId:a}=t;return a?l(a):e.toasts.forEach(e=>{l(e.id)}),{...e,toasts:e.toasts.map(e=>e.id===a||void 0===a?{...e,open:!1}:e)}}case"REMOVE_TOAST":if(void 0===t.toastId)return{...e,toasts:[]};return{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)}}},o=[],d={toasts:[]};function c(e){d=i(d,e),o.forEach(e=>{e(d)})}function u(e){let{...t}=e,a=(s=(s+1)%Number.MAX_VALUE).toString(),r=()=>c({type:"DISMISS_TOAST",toastId:a});return c({type:"ADD_TOAST",toast:{...t,id:a,open:!0,onOpenChange:e=>{e||r()}}}),{id:a,dismiss:r,update:e=>c({type:"UPDATE_TOAST",toast:{...e,id:a}})}}function m(){let[e,t]=r.useState(d);return r.useEffect(()=>(o.push(t),()=>{let e=o.indexOf(t);e>-1&&o.splice(e,1)}),[e]),{...e,toast:u,dismiss:e=>c({type:"DISMISS_TOAST",toastId:e})}}},26062:(e,t,a)=>{"use strict";a.d(t,{A:()=>r});let r=(0,a(38595).A)("ChartNoAxesColumnIncreasing",[["line",{x1:"12",x2:"12",y1:"20",y2:"10",key:"1vz5eb"}],["line",{x1:"18",x2:"18",y1:"20",y2:"4",key:"cun8e5"}],["line",{x1:"6",x2:"6",y1:"20",y2:"16",key:"hq0ia6"}]])},23920:(e,t,a)=>{"use strict";a.d(t,{A:()=>r});let r=(0,a(38595).A)("Copy",[["rect",{width:"14",height:"14",x:"8",y:"8",rx:"2",ry:"2",key:"17jyea"}],["path",{d:"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",key:"zix9uf"}]])},14505:(e,t,a)=>{"use strict";a.d(t,{A:()=>r});let r=(0,a(38595).A)("LoaderCircle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]])},68236:(e,t,a)=>{"use strict";a.d(t,{A:()=>r});let r=(0,a(38595).A)("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]])},92823:(e,t,a)=>{"use strict";a.d(t,{A:()=>r});let r=(0,a(38595).A)("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]])},66217:(e,t,a)=>{"use strict";a.d(t,{G$:()=>Z,Hs:()=>b,UC:()=>et,VY:()=>er,ZL:()=>Q,bL:()=>Y,bm:()=>es,hE:()=>ea,hJ:()=>ee,l9:()=>K});var r=a(12115),s=a(93610),n=a(88068),l=a(18166),i=a(67668),o=a(1488),d=a(59674),c=a(20196),u=a(17323),m=a(17028),p=a(23360),f=a(62292),x=a(74073),h=a(15587),g=a(12317),y=a(95155),j="Dialog",[v,b]=(0,l.A)(j),[N,w]=v(j),k=e=>{let{__scopeDialog:t,children:a,open:s,defaultOpen:n,onOpenChange:l,modal:d=!0}=e,c=r.useRef(null),u=r.useRef(null),[m=!1,p]=(0,o.i)({prop:s,defaultProp:n,onChange:l});return(0,y.jsx)(N,{scope:t,triggerRef:c,contentRef:u,contentId:(0,i.B)(),titleId:(0,i.B)(),descriptionId:(0,i.B)(),open:m,onOpenChange:p,onOpenToggle:r.useCallback(()=>p(e=>!e),[p]),modal:d,children:a})};k.displayName=j;var C="DialogTrigger",R=r.forwardRef((e,t)=>{let{__scopeDialog:a,...r}=e,l=w(C,a),i=(0,n.s)(t,l.triggerRef);return(0,y.jsx)(p.sG.button,{type:"button","aria-haspopup":"dialog","aria-expanded":l.open,"aria-controls":l.contentId,"data-state":q(l.open),...r,ref:i,onClick:(0,s.m)(e.onClick,l.onOpenToggle)})});R.displayName=C;var D="DialogPortal",[I,A]=v(D,{forceMount:void 0}),E=e=>{let{__scopeDialog:t,forceMount:a,children:s,container:n}=e,l=w(D,t);return(0,y.jsx)(I,{scope:t,forceMount:a,children:r.Children.map(s,e=>(0,y.jsx)(m.C,{present:a||l.open,children:(0,y.jsx)(u.Z,{asChild:!0,container:n,children:e})}))})};E.displayName=D;var S="DialogOverlay",O=r.forwardRef((e,t)=>{let a=A(S,e.__scopeDialog),{forceMount:r=a.forceMount,...s}=e,n=w(S,e.__scopeDialog);return n.modal?(0,y.jsx)(m.C,{present:r||n.open,children:(0,y.jsx)(T,{...s,ref:t})}):null});O.displayName=S;var T=r.forwardRef((e,t)=>{let{__scopeDialog:a,...r}=e,s=w(S,a);return(0,y.jsx)(x.A,{as:g.DX,allowPinchZoom:!0,shards:[s.contentRef],children:(0,y.jsx)(p.sG.div,{"data-state":q(s.open),...r,ref:t,style:{pointerEvents:"auto",...r.style}})})}),F="DialogContent",M=r.forwardRef((e,t)=>{let a=A(F,e.__scopeDialog),{forceMount:r=a.forceMount,...s}=e,n=w(F,e.__scopeDialog);return(0,y.jsx)(m.C,{present:r||n.open,children:n.modal?(0,y.jsx)(_,{...s,ref:t}):(0,y.jsx)(P,{...s,ref:t})})});M.displayName=F;var _=r.forwardRef((e,t)=>{let a=w(F,e.__scopeDialog),l=r.useRef(null),i=(0,n.s)(t,a.contentRef,l);return r.useEffect(()=>{let e=l.current;if(e)return(0,h.Eq)(e)},[]),(0,y.jsx)(z,{...e,ref:i,trapFocus:a.open,disableOutsidePointerEvents:!0,onCloseAutoFocus:(0,s.m)(e.onCloseAutoFocus,e=>{var t;e.preventDefault(),null===(t=a.triggerRef.current)||void 0===t||t.focus()}),onPointerDownOutside:(0,s.m)(e.onPointerDownOutside,e=>{let t=e.detail.originalEvent,a=0===t.button&&!0===t.ctrlKey;(2===t.button||a)&&e.preventDefault()}),onFocusOutside:(0,s.m)(e.onFocusOutside,e=>e.preventDefault())})}),P=r.forwardRef((e,t)=>{let a=w(F,e.__scopeDialog),s=r.useRef(!1),n=r.useRef(!1);return(0,y.jsx)(z,{...e,ref:t,trapFocus:!1,disableOutsidePointerEvents:!1,onCloseAutoFocus:t=>{var r,l;null===(r=e.onCloseAutoFocus)||void 0===r||r.call(e,t),t.defaultPrevented||(s.current||null===(l=a.triggerRef.current)||void 0===l||l.focus(),t.preventDefault()),s.current=!1,n.current=!1},onInteractOutside:t=>{var r,l;null===(r=e.onInteractOutside)||void 0===r||r.call(e,t),t.defaultPrevented||(s.current=!0,"pointerdown"!==t.detail.originalEvent.type||(n.current=!0));let i=t.target;(null===(l=a.triggerRef.current)||void 0===l?void 0:l.contains(i))&&t.preventDefault(),"focusin"===t.detail.originalEvent.type&&n.current&&t.preventDefault()}})}),z=r.forwardRef((e,t)=>{let{__scopeDialog:a,trapFocus:s,onOpenAutoFocus:l,onCloseAutoFocus:i,...o}=e,u=w(F,a),m=r.useRef(null),p=(0,n.s)(t,m);return(0,f.Oh)(),(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(c.n,{asChild:!0,loop:!0,trapped:s,onMountAutoFocus:l,onUnmountAutoFocus:i,children:(0,y.jsx)(d.qW,{role:"dialog",id:u.contentId,"aria-describedby":u.descriptionId,"aria-labelledby":u.titleId,"data-state":q(u.open),...o,ref:p,onDismiss:()=>u.onOpenChange(!1)})}),(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(H,{titleId:u.titleId}),(0,y.jsx)(X,{contentRef:m,descriptionId:u.descriptionId})]})]})}),V="DialogTitle",B=r.forwardRef((e,t)=>{let{__scopeDialog:a,...r}=e,s=w(V,a);return(0,y.jsx)(p.sG.h2,{id:s.titleId,...r,ref:t})});B.displayName=V;var G="DialogDescription",J=r.forwardRef((e,t)=>{let{__scopeDialog:a,...r}=e,s=w(G,a);return(0,y.jsx)(p.sG.p,{id:s.descriptionId,...r,ref:t})});J.displayName=G;var L="DialogClose",U=r.forwardRef((e,t)=>{let{__scopeDialog:a,...r}=e,n=w(L,a);return(0,y.jsx)(p.sG.button,{type:"button",...r,ref:t,onClick:(0,s.m)(e.onClick,()=>n.onOpenChange(!1))})});function q(e){return e?"open":"closed"}U.displayName=L;var W="DialogTitleWarning",[Z,$]=(0,l.q)(W,{contentName:F,titleName:V,docsSlug:"dialog"}),H=e=>{let{titleId:t}=e,a=$(W),s="`".concat(a.contentName,"` requires a `").concat(a.titleName,"` for the component to be accessible for screen reader users.\n\nIf you want to hide the `").concat(a.titleName,"`, you can wrap it with our VisuallyHidden component.\n\nFor more information, see https://radix-ui.com/primitives/docs/components/").concat(a.docsSlug);return r.useEffect(()=>{t&&!document.getElementById(t)&&console.error(s)},[s,t]),null},X=e=>{let{contentRef:t,descriptionId:a}=e,s=$("DialogDescriptionWarning"),n="Warning: Missing `Description` or `aria-describedby={undefined}` for {".concat(s.contentName,"}.");return r.useEffect(()=>{var e;let r=null===(e=t.current)||void 0===e?void 0:e.getAttribute("aria-describedby");a&&r&&!document.getElementById(a)&&console.warn(n)},[n,t,a]),null},Y=k,K=R,Q=E,ee=O,et=M,ea=B,er=J,es=U}}]);