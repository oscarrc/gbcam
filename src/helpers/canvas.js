const getCanvasImage = (img, w, h) => {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");

    c.width = w;
    c.height = h;
    img && ctx.drawImage(img, 0, 0);

    return c;
}

const loadImage = (src) => new Promise((resolve) => {
    const img = document.createElement("img");
    img.src = src;

    img.onload = () => resolve(img);
})

export { getCanvasImage, loadImage }