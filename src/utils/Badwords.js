import wordLists from '../Badwords/badWords.json'

export const checkBadWord = userInput => {
  const lang_code = localStorage.getItem('lang') || 'ta';
  const words = wordLists[lang_code];

  if (!words || !Array.isArray(words)) {
    return false;
  }

  const cleanedInput = userInput.trim().toLowerCase();
  return words.includes(cleanedInput);
};

export const filterBadWords = input => {
  let texttemp = input.replace(/[.,|!?']/g, '');
  const wordsToFilter = texttemp.toLowerCase().split(/\s+/); // Split the input into an array of words
  const filteredWords = wordsToFilter.map(word => {
    if (checkBadWord(word)) {
      return `${word[0]}*****${word[word.length-1]}`; // Replace bad words with ****
    }
    return word;
  });

  return filteredWords.join(' '); // Join the array back into a string
};

export const isProfanityWord=()=>{
  let isProfanity = localStorage.getItem('voiceText') || '';
  return isProfanity.includes("*****")
}