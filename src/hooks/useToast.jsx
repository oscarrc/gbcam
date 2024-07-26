import { useRef } from "react";

const useToast = () => {
    const toasts = useRef([]);

    const showToast = (message) => {
        const idx = toasts.current.length;
        const node = document.createElement("div");

        node.className=`badge badge-neutral bg-base-100 text-white border opacity-75 shadow toast z-50 `
        node.innerHTML = message
        
        toasts.current[idx] = node;
        
        document.body.appendChild(node);        

        setTimeout(() => {
            toasts.current[idx].remove();
            toasts.current.splice(idx, 1)
        }, 3000)
    }


    return { showToast }
}

export { useToast }