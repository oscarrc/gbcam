const getCanvasImage = (img, w, h) => {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");

    c.width = w;
    c.height = h;
    ctx.drawImage(img, 0, 0);

    return c;
}

export { getCanvasImage }