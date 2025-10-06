import React,{useEffect,useRef,useState} from "react";
import "../../assets/styles/forms/form-submission-style.css";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {useDropzone} from 'react-dropzone';
import editImage from '../../assets/images/svg/edit-square.svg';
import downloadImage from '../../assets/images/svg/download.svg';
import NavPlus from '../../assets/images/section5-images/NavPlus.png';
import NavMinus from '../../assets/images/section5-images/NavMinus.png';

const FormPage=()=>{
    const [identityMethod,setIdentityMethod]=useState("twitter");
    const [progress,setProgress]=useState(0);
    const [phase1Complete,setPhase1Complete]=useState(false);
    const [phase1Locked,setPhase1Locked]=useState(false);
    const [phase2Locked,setPhase2Locked]=useState(false);
    const [phase3Locked,setPhase3Locked]=useState(false);
    const phase2Ref=useRef(null);
    const phase3Ref=useRef(null);
    const [formData,setFormData]=useState({firstName:"",lastName:"",email:"",twitter:"",helpTopic:"",details:"",file:null});
    const [files,setFiles]=useState({accepted:[],rejected:[]});
    const [errors,setErrors]=useState({});

    useEffect(()=>{const params=new URLSearchParams(window.location.search);const type=params.get("type");if(type){setFormData(prev=>({...prev,helpTopic:type}));}},[]);
    useEffect(()=>{if(phase1Complete&&phase2Ref.current){const topOffset=phase2Ref.current.getBoundingClientRect().top+window.scrollY-180;window.scrollTo({top:topOffset,behavior:"smooth"});}},[phase1Complete]);
    useEffect(()=>{if(phase2Locked&&phase3Ref.current){const topOffset=phase3Ref.current.getBoundingClientRect().top+window.scrollY-180;window.scrollTo({top:topOffset,behavior:"smooth"});}},[phase2Locked]);

    /* -----------------------
       DYNAMIC MIN-HEIGHT EFFECT
       - Observes all .user-info-section elements
       - Recomputes total height whenever sections resize, mount/unmount or classes/styles change
       - Sets container min-height = calc(100vh + <sum of sections px>)
       ----------------------- */
    useEffect(() => {
        if (typeof window === "undefined") return;
        const pageEl = document.querySelector('.event-submission-page');
        if (!pageEl) return;

        // Utility: get all current user-info-section nodes within the page
        const getSections = () => Array.from(pageEl.querySelectorAll('.user-info-section'));

        // Debounced via RAF to avoid layout thrash
        let rafId = null;
        const recompute = () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(() => {
                const sections = getSections();
                const total = sections.reduce((sum, el) => sum + Math.ceil(el.getBoundingClientRect().height), 0);

                const width = window.innerWidth;
                let baseVH;

                if (width <= 360) baseVH = 85;
                else if (width >= 361 && width <= 399) baseVH = 75;
                else if (width >= 400 && width <= 768) baseVH = 85;
                else if (width >= 769 && width <= 1024) baseVH = 95;
                else baseVH = 100;

                // Apply baseVH in vh units plus sum of sections
                pageEl.style.minHeight = `calc(${baseVH}vh + ${total}px)`;
            });
        };




        // Setup ResizeObserver for live size changes
        let ro = null;
        const setupResizeObserver = () => {
            if (ro) ro.disconnect();
            if (typeof ResizeObserver !== 'undefined') {
                ro = new ResizeObserver(recompute);
                // observe each section and the page itself (in case padding/style changes)
                const sections = getSections();
                sections.forEach(s => ro.observe(s));
                ro.observe(pageEl);
            }
        };

        setupResizeObserver();
        recompute();

        // MutationObserver to detect when sections mount/unmount or classes/styles toggle
        const mo = new MutationObserver((mutations) => {
            // If DOM subtree changed, rebuild observers and recompute
            let shouldRebuild = false;
            for (const m of mutations) {
                if (m.type === 'childList') { shouldRebuild = true; break; }
                if (m.type === 'attributes' && (m.target.classList && m.target.classList.contains('user-info-section'))) { shouldRebuild = true; break; }
            }
            if (shouldRebuild) setupResizeObserver();
            recompute();
        });
        mo.observe(pageEl, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });

        // Window resize should also recompute
        const onResize = () => recompute();
        window.addEventListener('resize', onResize);

        // Fallback for very old browsers (no ResizeObserver)
        let fallbackInterval = null;
        if (typeof ResizeObserver === 'undefined') {
            // Polling fallback (runs only if RO unavailable)
            fallbackInterval = setInterval(recompute, 700);
        }

        return () => {
            if (ro) ro.disconnect();
            mo.disconnect();
            window.removeEventListener('resize', onResize);
            if (fallbackInterval) clearInterval(fallbackInterval);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []); // run once; observers handle live updates

    const modules = {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image', 'video']
        ]
    };

    const handleInputChange=e=>{const {name,value}=e.target;setFormData(prev=>({...prev,[name]:value}));if(errors[name])setErrors(prev=>({...prev,[name]:""}));};

    const FileUpload=({files,setFiles})=>{
        const {getRootProps,getInputProps,isDragActive}=useDropzone({
            onDrop:(acceptedFiles,rejectedFiles)=>{
                let newAccepted=[],newRejected=[];
                if(acceptedFiles.length>4){newAccepted=acceptedFiles.slice(0,4);newRejected=acceptedFiles.slice(4).map(file=>({file,reason:"too-many"}));}
                else{newAccepted=acceptedFiles;newRejected=rejectedFiles.map(r=>({file:r.file,reason:"invalid-type"}));}
                setFiles({accepted:newAccepted,rejected:newRejected});
                setFormData(prev=>({...prev,file:newAccepted.length>0?newAccepted[0]:null}));
            },
            accept:{'image/jpeg':['.jpg','.jpeg'],'image/png':['.png'],'application/pdf':['.pdf']},maxFiles:4
        });

        return(
            <div className="dropzone-wrapper">
                <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} />
                    <img src={downloadImage} alt="Download Icon"/>
                    <p>{isDragActive?"Drop the files here...":"Drag & drop files here"}<br/></p>
                    <em>4 files is the max number of files</em>
                </div>
                {files.accepted.length>0&&(
                    <div className="uploaded-files">
                        <div className="file-status">
                            <img src={NavPlus} alt="Accepted" className="file-status-icon"/>
                            <div className="file-names">{files.accepted.map((file,idx)=><div key={idx} className="file-name">{file.name}</div>)}</div>
                        </div>
                    </div>
                )}
                {files.rejected.length>0&&(
                    <div className="rejected-files">
                        <div className="file-status">
                            <img src={NavMinus} alt="Rejected" className="file-status-icon"/>
                            <div className="file-names">{files.rejected.map(({file},idx)=><div key={idx} className="file-name">{file.name}</div>)}</div>
                        </div>
                        <div className="file-error-message">
                            {files.rejected.some(f=>f.reason==="too-many")?<div className="error-msg">TOO MANY FILES UPLOADED</div>:files.rejected.some(f=>f.reason==="invalid-type")?<div className="file-error-message">INVALID FILE SUBMISSION</div>:<div className="file-error-message">ERROR: TRY AGAIN LATER</div>}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const validatePhase1=()=>{const e={};if(identityMethod==="name"){if(!formData.firstName.trim())e.firstName="First name required";if(!formData.lastName.trim())e.lastName="Last name required";if(!formData.email.trim())e.email="Email required";else if(!/\S+@\S+\.\S+/.test(formData.email))e.email="Invalid email";}else{if(!formData.twitter.trim())e.twitter="Username required";}return e;};
    const validatePhase2=()=>{const e={};if(!formData.helpTopic.trim())e.helpTopic="Select an option";return e;};
    const validatePhase3=()=>{const e={};if(!formData.details.trim())e.details="Please provide details";if(["media","event","bug"].includes(formData.helpTopic)&&!formData.file)e.file="File required for this category";return e;};

    const handlePhase1Done=()=>{const e=validatePhase1();setErrors(e);if(Object.keys(e).length===0){setPhase1Complete(true);setPhase1Locked(true);if(progress<33)setProgress(33);}};
    const handlePhase2Done=()=>{const e=validatePhase2();setErrors(prev=>({...prev,...e}));if(phase1Complete&&Object.keys(e).length===0){setPhase2Locked(true);if(progress<66)setProgress(66);}};
    const handlePhase3Submit=()=>{const e=validatePhase3();setErrors(prev=>({...prev,...e}));if(Object.keys(e).length===0){setPhase3Locked(true);if(progress<100)setProgress(100);alert("✅ Form submitted successfully!");}};

    return(
        <div className="event-submission-page">
            <div className="top-form">
                <h1>HL FORM SUBMISSION</h1>
                <p className="subtitle">"I feel your compliments like bullets on skin." - Lacy</p>
                <div className="progress-wrapper">
                    <div className="progress-text"><span>Form Completion:</span><span className="progress-percentage">{progress}%</span></div>
                    <div className="progress-bar-bg"><div className="progress-bar-fill" style={{width:`${progress}%`}}></div></div>
                </div>
            </div>

            <div className={`user-info-section ${phase1Locked?"locked collapsed":""}`}>
                <h2 className="section-heading">PHASE 1: USER INFO</h2>
                <div className="bookmark-icon"></div>
                {!phase1Locked&&(
                    <>
                        <div className="identity-choice">
                            <label className="radio-label"><input type="radio" name="identityMethod" value="twitter" checked={identityMethod==="twitter"} onChange={e=>setIdentityMethod(e.target.value)}/><span>X / Twitter Username</span></label>
                            <label className="radio-label"><input type="radio" name="identityMethod" value="name" checked={identityMethod==="name"} onChange={e=>setIdentityMethod(e.target.value)}/><span>First & Last Name</span></label>
                        </div>
                        {identityMethod==="twitter"?(
                            <div className="form-fields">
                                <div className="field-group username-field">
                                    <label htmlFor="twitter">X / Twitter Username</label>
                                    <div className="username-input-wrapper">
                                        <span className="at-symbol">@</span>
                                        <input type="text" id="twitter" name="twitter" placeholder="Username" value={formData.twitter} onChange={handleInputChange} className={errors.twitter?"error":""}/>
                                    </div>
                                    {errors.twitter&&<span className="error-msg">{errors.twitter}</span>}
                                </div>
                            </div>
                        ):(
                            <div className="form-fields">
                                <div className="name-row">
                                    <div className="field-group"><label htmlFor="firstName">First Name</label><input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className={errors.firstName?"error":""}/>{errors.firstName&&<span className="error-msg">{errors.firstName}</span>}</div>
                                    <div className="field-group"><label htmlFor="lastName">Last Name</label><input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className={errors.lastName?"error":""}/>{errors.lastName&&<span className="error-msg">{errors.lastName}</span>}</div>
                                </div>
                                <div className="field-group"><label htmlFor="email">Email</label><input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className={errors.email?"error":""}/>{errors.email&&<span className="error-msg">{errors.email}</span>}</div>
                            </div>
                        )}
                        <button className="done-btn" onClick={handlePhase1Done}>NEXT</button>
                    </>
                )}
                {phase1Locked&&(
                    <div className="collapsed-summary">
                        {identityMethod==="twitter"?`@${formData.twitter}`:`${formData.firstName} ${formData.lastName}`}
                        <button className="edit-btn" onClick={()=>setPhase1Locked(false)}><img src={editImage} alt="edit"/></button>
                    </div>
                )}
            </div>

            {phase1Complete&&(
                <div ref={phase2Ref} className={`user-info-section ${phase2Locked?"locked collapsed":""}`}>
                    <h2 className="section-heading">PHASE 2: HELP REQUEST</h2>
                    <div className="bookmark-icon"></div>
                    {!phase2Locked&&(
                        <div className="form-fields">
                            <div className="field-group">
                                <label htmlFor="helpTopic">What can I help you with?</label>
                                <select id="helpTopic" name="helpTopic" value={formData.helpTopic} onChange={handleInputChange} className={errors.helpTopic?"error":""}>
                                    <option value="">-- Select an option --</option>
                                    <option value="feature">Make a feature suggestion</option>
                                    <option value="collaborate">Collaborate</option>
                                    <option value="media">Media removal / copyright</option>
                                    <option value="event">Event submission</option>
                                    <option value="bug">Report a bug</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.helpTopic&&<span className="error-msg">{errors.helpTopic}</span>}
                            </div>
                            <button className="done-btn" onClick={handlePhase2Done}>NEXT</button>
                        </div>
                    )}
                    {phase2Locked&&(
                        <div className="collapsed-summary">
                            {formData.helpTopic}
                            <button className="edit-btn" onClick={()=>setPhase2Locked(false)}><img src={editImage} alt="edit"/></button>
                        </div>
                    )}
                </div>
            )}

            {phase2Locked&&(
                <div ref={phase3Ref} className={`user-info-section ${phase3Locked?"locked collapsed":""}`}>
                    <h2 className="section-heading">PHASE 3: DETAILS / FILE UPLOAD</h2>
                    <div className="bookmark-icon"></div>
                    {!phase3Locked&&(
                        <div className="form-fields">
                            <ReactQuill theme="snow" value={formData.details} onChange={v=>setFormData(prev=>({...prev,details:v}))} modules={modules} className={errors.details?"error quill-editor":"quill-editor"} placeholder="Enter details here..."/>
                            {errors.details&&<span className="error-msg2">{errors.details}</span>}
                            {["media","event","bug"].includes(formData.helpTopic)&&(
                                <div className="field-group">
                                    <label>ATTACH FILE(S):</label>
                                    <FileUpload files={files} setFiles={setFiles}/>
                                    {errors.file&&<span className="error-msg">{errors.file}</span>}
                                </div>
                            )}
                            <button className="done-btn" onClick={handlePhase3Submit}>SUBMIT</button>
                        </div>
                    )}
                    {phase3Locked&&(
                        <div className="collapsed-summary">Details submitted
                            <button className="edit-btn" onClick={()=>setPhase3Locked(false)}><img src={editImage} alt="edit"/></button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FormPage;
