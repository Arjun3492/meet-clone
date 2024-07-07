(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[258],{9495:function(e,t,r){var n,i,s=Object.create,a=Object.defineProperty,o=Object.getOwnPropertyDescriptor,l=Object.getOwnPropertyNames,p=Object.getPrototypeOf,u=Object.prototype.hasOwnProperty,__defNormalProp=(e,t,r)=>t in e?a(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,__copyProps=(e,t,r,n)=>{if(t&&"object"==typeof t||"function"==typeof t)for(let i of l(t))u.call(e,i)||i===r||a(e,i,{get:()=>t[i],enumerable:!(n=o(t,i))||n.enumerable});return e},__publicField=(e,t,r)=>(__defNormalProp(e,"symbol"!=typeof t?t+"":t,r),r),h={};((e,t)=>{for(var r in t)a(e,r,{get:t[r],enumerable:!0})})(h,{default:()=>Mux}),e.exports=__copyProps(a({},"__esModule",{value:!0}),h);var d=(i=null!=(n=r(5271))?s(p(n)):{},__copyProps(n&&n.__esModule?i:a(i,"default",{value:n,enumerable:!0}),n)),c=r(9090);let Mux=class Mux extends d.Component{constructor(){super(...arguments),__publicField(this,"onReady",(...e)=>this.props.onReady(...e)),__publicField(this,"onPlay",(...e)=>this.props.onPlay(...e)),__publicField(this,"onBuffer",(...e)=>this.props.onBuffer(...e)),__publicField(this,"onBufferEnd",(...e)=>this.props.onBufferEnd(...e)),__publicField(this,"onPause",(...e)=>this.props.onPause(...e)),__publicField(this,"onEnded",(...e)=>this.props.onEnded(...e)),__publicField(this,"onError",(...e)=>this.props.onError(...e)),__publicField(this,"onPlayBackRateChange",e=>this.props.onPlaybackRateChange(e.target.playbackRate)),__publicField(this,"onEnablePIP",(...e)=>this.props.onEnablePIP(...e)),__publicField(this,"onSeek",e=>{this.props.onSeek(e.target.currentTime)}),__publicField(this,"onDurationChange",()=>{let e=this.getDuration();this.props.onDuration(e)}),__publicField(this,"mute",()=>{this.player.muted=!0}),__publicField(this,"unmute",()=>{this.player.muted=!1}),__publicField(this,"ref",e=>{this.player=e})}componentDidMount(){this.props.onMount&&this.props.onMount(this),this.addListeners(this.player);let e=this.getPlaybackId(this.props.url);e&&(this.player.playbackId=e)}componentWillUnmount(){this.player.playbackId=null,this.removeListeners(this.player)}addListeners(e){let{playsinline:t}=this.props;e.addEventListener("play",this.onPlay),e.addEventListener("waiting",this.onBuffer),e.addEventListener("playing",this.onBufferEnd),e.addEventListener("pause",this.onPause),e.addEventListener("seeked",this.onSeek),e.addEventListener("ended",this.onEnded),e.addEventListener("error",this.onError),e.addEventListener("ratechange",this.onPlayBackRateChange),e.addEventListener("enterpictureinpicture",this.onEnablePIP),e.addEventListener("leavepictureinpicture",this.onDisablePIP),e.addEventListener("webkitpresentationmodechanged",this.onPresentationModeChange),e.addEventListener("canplay",this.onReady),t&&e.setAttribute("playsinline","")}removeListeners(e){e.removeEventListener("canplay",this.onReady),e.removeEventListener("play",this.onPlay),e.removeEventListener("waiting",this.onBuffer),e.removeEventListener("playing",this.onBufferEnd),e.removeEventListener("pause",this.onPause),e.removeEventListener("seeked",this.onSeek),e.removeEventListener("ended",this.onEnded),e.removeEventListener("error",this.onError),e.removeEventListener("ratechange",this.onPlayBackRateChange),e.removeEventListener("enterpictureinpicture",this.onEnablePIP),e.removeEventListener("leavepictureinpicture",this.onDisablePIP),e.removeEventListener("canplay",this.onReady)}async load(e){var t;let{onError:r,config:n}=this.props;if(!(null==(t=globalThis.customElements)?void 0:t.get("mux-player")))try{let e="https://cdn.jsdelivr.net/npm/@mux/mux-player@VERSION/dist/mux-player.mjs".replace("VERSION",n.version);await import(`${e}`),this.props.onLoaded()}catch(e){r(e)}let[,i]=e.match(c.MATCH_URL_MUX);this.player.playbackId=i}play(){let e=this.player.play();e&&e.catch(this.props.onError)}pause(){this.player.pause()}stop(){this.player.playbackId=null}seekTo(e,t=!0){this.player.currentTime=e,t||this.pause()}setVolume(e){this.player.volume=e}enablePIP(){this.player.requestPictureInPicture&&document.pictureInPictureElement!==this.player&&this.player.requestPictureInPicture()}disablePIP(){document.exitPictureInPicture&&document.pictureInPictureElement===this.player&&document.exitPictureInPicture()}setPlaybackRate(e){try{this.player.playbackRate=e}catch(e){this.props.onError(e)}}getDuration(){if(!this.player)return null;let{duration:e,seekable:t}=this.player;return e===1/0&&t.length>0?t.end(t.length-1):e}getCurrentTime(){return this.player?this.player.currentTime:null}getSecondsLoaded(){if(!this.player)return null;let{buffered:e}=this.player;if(0===e.length)return 0;let t=e.end(e.length-1),r=this.getDuration();return t>r?r:t}getPlaybackId(e){let[,t]=e.match(c.MATCH_URL_MUX);return t}render(){let{url:e,playing:t,loop:r,controls:n,muted:i,config:s,width:a,height:o}=this.props,l={width:"auto"===a?a:"100%",height:"auto"===o?o:"100%"};return!1===n&&(l["--controls"]="none"),d.default.createElement("mux-player",{ref:this.ref,"playback-id":this.getPlaybackId(e),style:l,preload:"auto",autoPlay:t||void 0,muted:i?"":void 0,loop:r?"":void 0,...s.attributes})}};__publicField(Mux,"displayName","Mux"),__publicField(Mux,"canPlay",c.canPlay.mux)}}]);