const drawImage = (src, ctx, x, y, w, h) => {
    const img = document.createElement("img");
    img.src = src;
    ctx.drawImage(img, x, y, w, h)
}

const getCanvas = (img, w, h) => {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");

    c.width = w;
    c.height = h;
    img && ctx.drawImage(img, 0, 0);

    return c;
}

const loadVideo = (src) => {
    const video = document.createElement("video");

    try { video.srcObject = src } 
    catch (error) { video.src = URL.createObjectURL(src) }
    
    video.loop = true;
    video.play();

    return video;
}

const loadImage = (src) => new Promise((resolve, reject) => {
    const img = document.createElement("img");
    img.src = src;

    try{
        img.onload = () => resolve(img);
    }catch(err){
        reject(err)
    }
})

export { drawImage, getCanvas, loadImage, loadVideo }