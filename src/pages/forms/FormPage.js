import React,{useEffect,useRef,useState} from "react";
import "../../assets/styles/forms/form-submission-style.css";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useDropzone} from 'react-dropzone';
import editImage from '../../assets/images/svg/edit-square.svg';
import downloadImage from '../../assets/images/svg/download.svg';
import NavPlus from '../../assets/images/section5-images/NavPlus.png';
import NavMinus from '../../assets/images/section5-images/NavMinus.png';
import {Helmet} from "react-helmet";

const FormPage=()=>{
    const [identityMethod,setIdentityMethod]=useState("twitter");
    const [progress,setProgress]=useState(0);
    const [phase1Complete,setPhase1Complete]=useState(false);
    const [phase1Locked,setPhase1Locked]=useState(false);
    const [phase2Locked,setPhase2Locked]=useState(false);
    const [phase3Locked,setPhase3Locked]=useState(false);
    const [phase3Complete,setPhase3Complete]=useState(false);
    const [phase4Locked,setPhase4Locked]=useState(true);
    const [phase4Checked,setPhase4Checked]=useState(false);
    const phase2Ref=useRef(null);
    const phase3Ref=useRef(null);
    const [formData,setFormData]=useState({firstName:"",lastName:"",email:"",twitter:"",helpTopic:"",details:"",file:null});
    const [files,setFiles]=useState({accepted:[],rejected:[]});
    const [errors,setErrors]=useState({});
    const hiddenFileInputRef=useRef(null);

    useEffect(()=>{if('scrollRestoration'in window.history)window.history.scrollRestoration='manual';window.scrollTo(0,0);},[]);
    useEffect(()=>{const p=new URLSearchParams(window.location.search);const t=p.get("type");if(t)setFormData(f=>({...f,helpTopic:t}));},[]);
    useEffect(()=>{if(phase1Complete&&phase2Ref.current){const t=phase2Ref.current.getBoundingClientRect().top+window.scrollY-180;window.scrollTo({top:t,behavior:"smooth"});}},[phase1Complete]);
    useEffect(()=>{if(phase2Locked&&phase3Ref.current){const t=phase3Ref.current.getBoundingClientRect().top+window.scrollY-180;window.scrollTo({top:t,behavior:"smooth"});}},[phase2Locked]);
    useEffect(()=>{if(typeof window==="undefined")return;const e=document.querySelector('.event-submission-page');if(!e)return;const g=()=>Array.from(e.querySelectorAll('.user-info-section'));let r=null;const c=()=>{if(r)cancelAnimationFrame(r);r=requestAnimationFrame(()=>{const s=g();const t=s.reduce((a,b)=>a+Math.ceil(b.getBoundingClientRect().height),0);const w=window.innerWidth;let vh=w<=360?85:w>=361&&w<=399?75:w>=400&&w<=768?85:w>=769&&w<=1024?95:100;e.style.minHeight=`calc(${vh}vh + ${t}px)`;});};let o=null;const u=()=>{if(o)o.disconnect();if(typeof ResizeObserver!=='undefined'){o=new ResizeObserver(c);g().forEach(x=>o.observe(x));o.observe(e);}};u();c();const m=new MutationObserver(()=>{u();c();});m.observe(e,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});const f=()=>c();window.addEventListener('resize',f);let i=null;if(typeof ResizeObserver==='undefined')i=setInterval(c,700);return()=>{if(o)o.disconnect();m.disconnect();window.removeEventListener('resize',f);if(i)clearInterval(i);if(r)cancelAnimationFrame(r);};},[]);

    const modules={toolbar:[['bold','italic','underline','strike'],['blockquote','code-block'],[{list:'ordered'},{list:'bullet'}],['link','image','video']]};
    const handleInputChange=e=>{const {name,value}=e.target;setFormData(f=>({...f,[name]:value}));if(errors[name])setErrors(f=>({...f,[name]:""}));};

    const FileUpload=({files,setFiles})=>{const{getRootProps,getInputProps,isDragActive}=useDropzone({onDrop:(a,r)=>{let nA=[],nR=[];if(a.length>4){nA=a.slice(0,4);nR=a.slice(4).map(f=>({file:f,reason:"too-many"}));}else{nA=a;nR=r.map(x=>({file:x.file,reason:"invalid-type"}));}setFiles({accepted:nA,rejected:nR});setFormData(f=>({...f,file:nA.length>0?nA[0]:null}));if(hiddenFileInputRef.current)hiddenFileInputRef.current.files=(t=>{const dt=new DataTransfer();t.forEach(x=>dt.items.add(x));return dt.files;})(nA);},accept:{"image/jpeg":[".jpg",".jpeg"],"image/png":[".png"],"application/pdf":[".pdf"]},maxFiles:4});return<div className="dropzone-wrapper"><div{...getRootProps()} className="dropzone"><input{...getInputProps()}/><img src={downloadImage} alt="Download Icon"/><p>{isDragActive?"Drop the files here...":"Drag & drop files here"}<br/></p><em>4 files is the max number of files</em></div>{files.accepted.length>0&&<div className="uploaded-files"><div className="file-status"><img src={NavPlus} alt="Accepted" className="file-status-icon"/><div className="file-names">{files.accepted.map((f,i)=><div key={i} className="file-name">{f.name}</div>)}</div></div></div>}{files.rejected.length>0&&<div className="rejected-files"><div className="file-status"><img src={NavMinus} alt="Rejected" className="file-status-icon"/><div className="file-names">{files.rejected.map(({file},i)=><div key={i} className="file-name">{file.name}</div>)}</div></div><div className="file-error-message">{files.rejected.some(f=>f.reason==="too-many")?<div className="error-msg">TOO MANY FILES UPLOADED</div>:files.rejected.some(f=>f.reason==="invalid-type")?<div className="file-error-message">INVALID FILE SUBMISSION</div>:<div className="file-error-message">ERROR: TRY AGAIN LATER</div>}</div></div>}</div>};

    const validatePhase1=()=>{const e={};if(identityMethod==="name"){if(!formData.firstName.trim())e.firstName="First name required";if(!formData.lastName.trim())e.lastName="Last name required";if(!formData.email.trim())e.email="Email required";else if(!/\S+@\S+\.\S+/.test(formData.email))e.email="Invalid email";}else{if(!formData.twitter.trim())e.twitter="Username required";}return e;};
    const validatePhase2=()=>{const e={};if(!formData.helpTopic.trim())e.helpTopic="Select an option";return e;};
    const validatePhase3=()=>{const e={};if(!formData.details.trim())e.details="Please provide details";if(["media","event","bug"].includes(formData.helpTopic)&&!formData.file)e.file="File required for this category";return e;};

    const handlePhase1Done=()=>{const e=validatePhase1();setErrors(e);if(Object.keys(e).length===0){setPhase1Complete(true);setPhase1Locked(true);if(progress<33)setProgress(33);}};
    const handlePhase2Done=()=>{const e=validatePhase2();setErrors(f=>({...f,...e}));if(phase1Complete&&Object.keys(e).length===0){setPhase2Locked(true);if(progress<66)setProgress(66);}};
    const handlePhase3Submit=()=>{const e=validatePhase3();setErrors(f=>({...f,...e}));if(Object.keys(e).length===0){setPhase3Locked(true);setPhase3Complete(true);setPhase4Locked(false);if(progress<75)setProgress(75);}};
    const handlePhase4Submit = () => {
        if (!phase4Checked) return;
        setProgress(100);
    };

    return<div className="event-submission-page"><Helmet><title>heylivies | form submission</title></Helmet><div className="top-form"><h1>HL FORM SUBMISSION</h1><p className="subtitle">"I feel your compliments like bullets on skin." - Lacy</p><div className="progress-wrapper"><div className="progress-text"><span>Form Completion:</span><span className="progress-percentage">{progress}%</span></div><div className="progress-bar-bg"><div className="progress-bar-fill" style={{width:`${progress}%`}}></div></div></div></div>

        <div className={`user-info-section ${phase1Locked?"locked collapsed":""}`}><h2 className="section-heading">PHASE 1: USER INFO</h2><div className="bookmark-icon"></div>{!phase1Locked&&<><div className="identity-choice"><label className="radio-label"><input type="radio" name="identityMethod" value="twitter" checked={identityMethod==="twitter"} onChange={e=>setIdentityMethod(e.target.value)}/><span>X / Twitter Username</span></label><label className="radio-label"><input type="radio" name="identityMethod" value="name" checked={identityMethod==="name"} onChange={e=>setIdentityMethod(e.target.value)}/><span>First & Last Name</span></label></div>{identityMethod==="twitter"?<div className="form-fields"><div className="field-group username-field"><label htmlFor="twitter">X / Twitter Username</label><div className="username-input-wrapper"><span className="at-symbol">@</span><input type="text" id="twitter" name="twitter" placeholder="Username" value={formData.twitter} onChange={handleInputChange} className={errors.twitter?"error":""}/></div>{errors.twitter&&<span className="error-msg">{errors.twitter}</span>}</div></div>:<div className="form-fields"><div className="name-row"><div className="field-group"><label htmlFor="firstName">First Name</label><input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className={errors.firstName?"error":""}/>{errors.firstName&&<span className="error-msg">{errors.firstName}</span>}</div><div className="field-group"><label htmlFor="lastName">Last Name</label><input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className={errors.lastName?"error":""}/>{errors.lastName&&<span className="error-msg">{errors.lastName}</span>}</div></div><div className="field-group"><label htmlFor="email">Email</label><input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={errors.email?"error":""}/>{errors.email&&<span className="error-msg">{errors.email}</span>}</div></div>}<button className="done-btn" onClick={handlePhase1Done}>NEXT</button></>}{phase1Locked&&<div className="collapsed-summary">{identityMethod==="twitter"?`@${formData.twitter}`:`${formData.firstName} ${formData.lastName}`}<button className="edit-btn" onClick={()=>setPhase1Locked(false)}><img src={editImage} alt="edit"/></button></div>}</div>

        {phase1Complete&&<div ref={phase2Ref} className={`user-info-section ${phase2Locked?"locked collapsed":""}`}><h2 className="section-heading">PHASE 2: HELP REQUEST</h2><div className="bookmark-icon"></div>{!phase2Locked&&<div className="form-fields"><div className="field-group"><label htmlFor="helpTopic">What can I help you with?</label><select id="helpTopic" name="helpTopic" value={formData.helpTopic} onChange={handleInputChange} className={errors.helpTopic?"error":""}><option value="">-- Select an option --</option><option value="feature">Make a feature suggestion</option><option value="collaborate">Collaborate</option><option value="media">Media removal / copyright</option><option value="event">Event submission</option><option value="bug">Report a bug</option><option value="other">Other</option></select>{errors.helpTopic&&<span className="error-msg">{errors.helpTopic}</span>}</div><button className="done-btn" onClick={handlePhase2Done}>NEXT</button></div>}{phase2Locked&&<div className="collapsed-summary">{formData.helpTopic}<button className="edit-btn" onClick={()=>setPhase2Locked(false)}><img src={editImage} alt="edit"/></button></div>}</div>}

        {phase2Locked&&<div ref={phase3Ref} className={`user-info-section ${phase3Locked?"locked collapsed":""}`}><h2 className="section-heading">PHASE 3: DETAILS / FILE UPLOAD</h2><div className="bookmark-icon"></div>{!phase3Locked&&<div className="form-fields"><ReactQuill theme="snow" value={formData.details} onChange={v=>setFormData(f=>({...f,details:v}))} modules={modules} className={errors.details?"error quill-editor":"quill-editor"} placeholder="Enter details here..."/>{errors.details&&<span className="error-msg2">{errors.details}</span>}{["media","event","bug"].includes(formData.helpTopic)&&<div className="field-group"><label>ATTACH FILE(S):</label><FileUpload files={files} setFiles={setFiles}/>{errors.file&&<span className="error-msg">{errors.file}</span>}</div>}<button className="done-btn" onClick={handlePhase3Submit}>SUBMIT</button></div>}{phase3Locked&&<div className="collapsed-summary">Details submitted<button className="edit-btn" onClick={()=>setPhase3Locked(false)}><img src={editImage} alt="edit"/></button></div>}</div>}

        {phase3Complete&&!phase4Locked&&<div className="user-info-section"><h2 className="section-heading">PHASE 4: CONFIRMATION</h2><div className="form-fields"><label className="checkbox-label"><input type="checkbox" checked={phase4Checked} onChange={e=>setPhase4Checked(e.target.checked)}/> I confirm that all information is entered correctly.</label></div><button type="button" className="done-btn" disabled={!phase4Checked} onClick={handlePhase4Submit}>Submit</button></div>}

        <form
            name="HL-FORMS"        // static name
            method="POST"
            data-netlify="true"
            style={{ display: "none" }} // can keep it hidden
        >
            <input type="hidden" name="form-name" value="HL-FORMS" />
            <input type="hidden" name="bot-field" />
            <input type="text" name="firstName" value={formData.firstName} />
            <input type="text" name="lastName" value={formData.lastName} />
            <input type="email" name="email" value={formData.email} />
            <input type="text" name="twitter" value={formData.twitter} />
            <input type="text" name="helpTopic" value={formData.helpTopic} />
            <input type="text" name="details" value={formData.details} />
            <input type="file" name="files" ref={hiddenFileInputRef} multiple />
            <div data-netlify-recaptcha="true"></div>
        </form>

    </div>;
};

export default FormPage;
