/**
 * Convert 24-hour time string (hh:mm) into a human-readable phrase.
 * 
 * Examples:
 *  - "00:00" => "midnight"
 *  - "12:00" => "noon"
 *  - "06:01" => "six oh one am"
 *  - "23:23" => "eleven twenty three pm"
 * 
 * A string in 24-hour format (e.g. "00:00", "23:59").
 * @param {string} timeStr 
 * 
 * Human-readable time phrase.
 * @returns {string} 
 */

function timeWord(timeStr) {
  const numWords = {
    0: "twelve",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten",
    11: "eleven",
    12: "twelve",
    13: "thirteen",
    14: "fourteen",
    15: "fifteen",
    16: "sixteen",
    17: "seventeen",
    18: "eighteen",
    19: "nineteen",
    20: "twenty",
    30: "thirty",
    40: "forty",
    50: "fifty"
  };

  /**
   * Convert a number (0-59) into words.
   * @param {number} n - The number to convert.
   * @returns {string} The number in words.
   */
  function numToWords(n) {
    if (n < 20) return numWords[n];
    let tens = Math.floor(n / 10) * 10;
    let ones = n % 10;
    return ones === 0 ? numWords[tens] : `${numWords[tens]} ${numWords[ones]}`;
  }

  // Split the input into hour and minute components
  let [h, m] = timeStr.split(':').map(Number);

  // Handle special cases
  if (h === 0 && m === 0) return "midnight";
  if (h === 12 && m === 0) return "noon";

  // Determine am/pm period
  let period = h < 12 ? "am" : "pm";

  // Convert hour from 24-hour to 12-hour format
  let hour12 = h % 12 === 0 ? 12 : h % 12;

  // Convert hour to words
  let hourWord = numToWords(hour12);

  // Convert minute to words
  let minuteWord = "";

  if (m === 0) {
    minuteWord = "oclock";
  } else if (m < 10) {
    minuteWord = `oh ${numToWords(m)}`;
  } else {
    minuteWord = numToWords(m);
  }

  // Build the final phrase, trim spaces
  return `${hourWord} ${minuteWord} ${period}`.trim();
}

module.exports = timeWord;
