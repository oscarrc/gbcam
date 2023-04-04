const dataToFile = async (data) => {
    const blob = data instanceof Blob ? data : await (await fetch(data)).blob();
    const extension = blob.type.split("/")[1];
    const file = new File([blob], `${Date.now()}.${extension}`, { type: blob.type })

    return file;
}

const saveFile = (data) => new Promise(async ( resolve, reject) => {
    const a = document.createElement("a");
    const file = await dataToFile(data);
    a.href = URL.createObjectURL(file);
    a.download = file.name;
    a.click();
    resolve(true);
})

export { dataToFile, saveFile };