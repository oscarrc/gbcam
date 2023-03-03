const drawArrow = (context, width, height, offset, up = false, vertical = false) => {
        const y = height - 5;
        const x = width - 5;
       
        context.beginPath();
        context.moveTo(vertical ? x - 10 : offset*0.5, up ? width - offset*0.5 : y - 10);
        context.lineTo(vertical ? x - 2: offset*0.75, up ? width - offset*0.75 : y - 2);
        context.lineTo(vertical ? x - 2 : offset - 5 , up ? width - offset + 5 : y - 2);
        context.lineTo(vertical ? x - 18 : offset - 5, up ? width - offset + 5 : y - 18);
        context.lineTo(vertical ? x - 18 : offset*0.75, up ? width - offset*0.75 : y - 18);
        context.lineTo(vertical ? x - 10 : offset*0.5, up ? width - offset*0.5 : y - 10 );
        context.stroke();

        up && context.fill();
}

const drawIndicator = (context, text, value, width, height, offset, vertical = false) => {
        const w = context.measureText(text).width;
        const x = vertical ? ( width - 5) : ( width - w) / 2;
        const y = vertical ? ( height - w) / 2 : ( height - 5);
        const angle = vertical ? (90 * Math.PI) / 180 : 0;

        context.beginPath();
        context.moveTo(vertical ? x - 2 : offset, vertical ? offset : y - 2)
        context.lineTo(vertical ? x - 2 : x - 5 , vertical ? y - 5 :y - 2);
        context.moveTo(vertical ? x - 2 : x + w + 5, vertical ? y + w + 5 :x - 2);
        context.lineTo(vertical ? x - 2 : width - offset , vertical ? height - offset : y - 2);
        context.stroke();


        if(vertical){
            context.translate(x - 8, y)
            context.rotate(angle);
        }
        context.fillText(text, vertical ? angle : x, vertical ? 0 : y); 
        context.setTransform(1,0,0,1,0,0);
}