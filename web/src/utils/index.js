export const highlight = (strings, ...rest) => {
    let str = "";

    strings.forEach((string, i) => {
        if (rest[i] != undefined){
            str += `${string} <b>${rest[i]}</b>`;
        } else {
            str += `${string}`;
      }
    });

    return str;
}
