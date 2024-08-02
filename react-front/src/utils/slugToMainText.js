export const slugToMainText = (slug) => {
  // Replace dashes with spaces
  let mainText = slug.replace(/-/g, " ");

  // Capitalize the first letter of each word
  mainText = mainText.replace(/\b\w/g, (char) => char.toUpperCase());

  return mainText;
};
