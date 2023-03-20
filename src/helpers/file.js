const dataToFile = async (data) => {
    const blob = data instanceof Blob ? data : await (await fetch(data)).blob();
    const extension = blob.type.split("/")[1];
    const file = new File([blob], `${Date.now()}.${extension}`, { type: blob.type })

    return file;
}

export { dataToFile };