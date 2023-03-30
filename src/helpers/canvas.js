const drawImage = (src, ctx, x, y, w, h) => {
    const img = document.createElement("img");
    img.src = src;
    ctx.drawImage(img, x, y, w, h)
}

const getCanvas = (w, h, opt = {}) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", opt);

    canvas.width = w;
    canvas.height = h;

    return { canvas, ctx };
}

const getCanvasImage = async (src, w, h) => {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");

    c.width = w;
    c.height = h;

    if(src){
        const img = typeof src === "string" ? await loadImage(src) : src;
        ctx.drawImage(img, 0, 0, w, h);
    }

    return c;
}

const loadVideo = (src) => new Promise( (resolve, reject) => {
    const video = document.createElement("video");

    try { video.srcObject = src } 
    catch (error) { video.src = URL.createObjectURL(src) }
    
    video.loop = true;
    video.play();
    
    try{
        video.onloadeddata = () => resolve(video)
    }catch(err){
        reject(err)
    }
})

const loadImage = (src) => new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.src = src;

    try{
        img.onload = () => resolve(img);
    }catch(err){
        reject(err)
    }
})

export { drawImage, getCanvas, getCanvasImage, loadImage, loadVideo }