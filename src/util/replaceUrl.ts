export const replaceUrl = (target: string, replaceTo: string) => {
  const regEx =
    /https?:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#\u3000-\u30FE\u4E00-\u9FA0\uFF01-\uFFE3]+/g;
  const replaceSentence = target.replace(regEx, replaceTo);
  return replaceSentence;
};
