/**
 * Based on pixelit
 * @author José Moreira @ <https://github.com/giventofly/pixelit>
 **/

const simGrade = (color, compare) => {
    let i, max;
    let d = 0;
    for (i = 0, max = color.length; i < max; i++) {
        d += (color[i] - compare[i]) * (color[i] - compare[i]);
    }
    return Math.sqrt(d);
}

const similarColor = (color, palette) => {        
  let similar = [];
  let current = simGrade(color, palette[0]);
  let next;

  palette.forEach((c) => {
    next = simGrade(color, c);
    if (next <= current) {
      similar = c;
      current = next;
    }
  });
  
  return similar;
}

export { similarColor }