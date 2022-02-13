export const hashEmailCode = (email: string): Array<string> => {
  const paddingWords = ["The", "Matrix", "Is", "Around", "Us"];
  const words = email.toUpperCase().split(/[^a-zA-Z ]/g).slice(0, 6).filter(w => w);
  const output: Array<string> = [];
  if (words.length < 6) {
    const len = words.length;
    for (let i = 0; i < (6 - len); i++)
      words.push(paddingWords[i]);
  }
  
  for (let i = 0; i < 6; i++) {
    let chars: Array<{ c: string, n: number }> = [];
    Array.from(words[i]).filter((c) => {
      if (chars.find((ch) => ch.c === c)) {
        let index = 0;
        chars.forEach((ch: any, id: number) => {
          if (ch.c === c) index = id
        });

        chars[index].n++;
      } else
        chars.push({ c, n: 1 });
    });
    const frequentChar: string = chars.sort((a, b) => a.n > b.n ? -1 : 1)[0].c;
    const n: number = frequentChar[0].charCodeAt(0) ^ frequentChar[0].charCodeAt(0) - 1 >> 2 + words[i].length;
    output.push(frequentChar + n);
  }
  
  return output;
}