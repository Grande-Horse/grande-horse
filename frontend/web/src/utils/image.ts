export const getDynamicImgSrc = (folder: string, file: string): string => {
  let src = new URL(`../assets/images/${folder}/${file}.webp`, import.meta.url).href;
  return src;
};
