   export function hslToHex(h: number, s: number, l: number): string {
     const hue = h / 360;
     const sat = s / 100;
     const light = l / 100;
     const c = (1 - Math.abs(2 * light - 1)) * sat;
     const x = c * (1 - Math.abs(((hue * 6) % 2) - 1));
     const m = light - c / 2;
     let r, g, b;
     if (hue < 1/6) [r,g,b] = [c,x,0];
     else if (hue < 2/6) [r,g,b] = [x,c,0];
     else if (hue < 3/6) [r,g,b] = [0,c,x];
     else if (hue < 4/6) [r,g,b] = [0,x,c];
     else if (hue < 5/6) [r,g,b] = [x,0,c];
     else [r,g,b] = [c,0,x];
     const toHex = (n: number) => {
       const hex = Math.round((n + m) * 255).toString(16);
       return hex.length === 1 ? "0" + hex : hex;
     };
     return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
   }