// Returns a boolean based on if the image is greater than the acceptable size (2mb)
export const acceptableImageSize = (content: string) => {
  return (content.length * 3) / 4 <= 2000000;
}

// Returns array of images from content 
export const getContentImages = (content: string) => {
  const images = (content.match(/<img src="(.)*">/g) || []).map(i => i.replace(/(<img src=")|(">)/g, ''));
  return images;
}