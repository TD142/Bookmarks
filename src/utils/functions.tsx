export const isValidHttpUrl = (string: string) => {
  let url;
  try {
    url = new URL(string);
    console.log(url);
  } catch (err) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};
