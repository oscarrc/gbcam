import { useRef } from "react";

const useToast = () => {
    const toasts = useRef([]);

    const addToast = (message) => {
        const idx = toasts.current.length;
        const node = document.createElement("div");

        node.className=`badge badge-outline badge-md toaste fixed mx-auto z-50 `
        node.innerHTML = message
        node.style = {bottom: `bottom: ${2 * idx} rem`}
        
        toasts.current[idx] = node;
        
        document.body.appendChild(node);

        // setTimeout(() => {
        //     toasts.current[idx].remove();
        //     toasts.current.splice(idx, 1)
        // }, 5000)
    }


    return { addToast }
}

export { useToast }