const dropZone = document.getElementById("dropZone");
const fileInput = document.getElementById("fileInput");
const spinner = document.getElementById("spinner");

const originalImg = document.getElementById("originalImg");
const resultImg = document.getElementById("resultImg");

const originalSize = document.getElementById("originalSize");
const processedSize = document.getElementById("processedSize");
const dimensions = document.getElementById("dimensions");
const processingTime = document.getElementById("processingTime");

const themeToggle = document.getElementById("themeToggle");
const bgColorInput = document.getElementById("bgColor");
const transparentToggle = document.getElementById("transparentToggle");
const downloadBtn = document.getElementById("downloadBtn");
const resetBtn = document.getElementById("resetBtn");
const viewButtons = document.querySelectorAll(".view-btn");

let processedBlob = null;

/* Theme */
themeToggle.addEventListener("click",()=>{
    document.body.classList.toggle("dark");
});

/* Drag & Drop */
dropZone.addEventListener("click",()=>fileInput.click());

dropZone.addEventListener("dragover",(e)=>{
    e.preventDefault();
    dropZone.style.opacity="0.6";
});

dropZone.addEventListener("dragleave",()=>{
    dropZone.style.opacity="1";
});

dropZone.addEventListener("drop",(e)=>{
    e.preventDefault();
    dropZone.style.opacity="1";
    handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener("change",(e)=>{
    handleFiles(e.target.files);
});

/* Batch Upload */
async function handleFiles(files){
    for(let file of files){
        await processImage(file);
    }
}

async function processImage(file){

    spinner.style.display="block";
    const startTime = performance.now();

    originalSize.textContent = (file.size/1024).toFixed(1)+" KB";

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:8000/remove-bg",{
        method:"POST",
        body:formData
    });

    const data = await res.json();

    const bytes = Uint8Array.from(
        data.image.match(/.{1,2}/g).map(b=>parseInt(b,16))
    );

    processedBlob = new Blob([bytes],{type:"image/png"});

    const transparentURL = URL.createObjectURL(processedBlob);

    originalImg.src = URL.createObjectURL(file);

    renderImage(transparentURL);

    processedSize.textContent = (processedBlob.size/1024).toFixed(1)+" KB";

    const img = new Image();
    img.src = transparentURL;
    img.onload = ()=>{
        dimensions.textContent = img.width+" × "+img.height;
    };

    const endTime = performance.now();
    processingTime.textContent = ((endTime-startTime)/1000).toFixed(2)+"s";

    spinner.style.display="none";
}

/* Render with background or transparent */
function renderImage(imageURL){

    const img = new Image();
    img.src = imageURL;

    img.onload = function(){

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = img.width;
        canvas.height = img.height;

        if(!transparentToggle.checked){
            ctx.fillStyle = bgColorInput.value;
            ctx.fillRect(0,0,canvas.width,canvas.height);
        }

        ctx.drawImage(img,0,0);

        resultImg.src = canvas.toDataURL("image/png");
    }
}

/* Re-render on color/transparent change */
bgColorInput.addEventListener("input",()=>{
    if(processedBlob){
        const url = URL.createObjectURL(processedBlob);
        renderImage(url);
    }
});

transparentToggle.addEventListener("change",()=>{
    if(processedBlob){
        const url = URL.createObjectURL(processedBlob);
        renderImage(url);
    }
});

/* Toggle View */
viewButtons.forEach(btn=>{
    btn.addEventListener("click",()=>{
        document.querySelector(".view-btn.active").classList.remove("active");
        btn.classList.add("active");

        if(btn.dataset.view==="original"){
            originalImg.classList.add("active");
            resultImg.classList.remove("active");
        }else{
            resultImg.classList.add("active");
            originalImg.classList.remove("active");
        }
    });
});

/* Download */
downloadBtn.addEventListener("click",()=>{
    if(!resultImg.src) return;

    const link = document.createElement("a");
    link.href = resultImg.src;
    link.download = transparentToggle.checked
        ? "background_removed_transparent.png"
        : "background_removed_colored.png";
    link.click();
});

/* Reset */
resetBtn.addEventListener("click",()=>{
    originalImg.src="";
    resultImg.src="";
    originalSize.textContent="-";
    processedSize.textContent="-";
    dimensions.textContent="-";
    processingTime.textContent="-";
});