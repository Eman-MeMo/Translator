selectTag = document.querySelectorAll("select");
const originalText = document.querySelector(".originalText");
const translatedText = document.querySelector(".translatedText");
swapIcon = document.querySelector(".swap");
BtnTraslator = document.querySelector("button");
Icons = document.querySelectorAll(".icons i");
selectTag.forEach((tag, id) => {
  //make English and Arabic as default languages
  for (const country_code in countries) {
    let selected;
    if (id == 0 && country_code == "en-GB") {
      selected = "selected";
    } else if (id == 1 && country_code == "ar-SA") {
      selected = "selected";
    }
    let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option);
  }
});

BtnTraslator.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent form submission

  let oriText = originalText.value;
  let FromLanguage = selectTag[0].value;
  let ToLanguage = selectTag[1].value;

  if (!originalText) return;

  translatedText.setAttribute("placeholder", "Translating...");

  //get data fron API link
  const ApiUrl = `https://api.mymemory.translated.net/get?q=${oriText}&langpair=${FromLanguage}|${ToLanguage}`;

  fetch(ApiUrl)
    .then((result) => result.json())
    .then((data) => {
      translatedText.value = data.responseData.translatedText;
      translatedText.setAttribute("placeholder", "Translation");

      // Send translated text to PHP file using AJAX
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "translator.php", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          console.log("Translation data stored successfully!");
        }
      };

      const translatedData = {
        originalText: originalText.value,
        translatedText: data.responseData.translatedText,
        fromLanguage: countries[FromLanguage],
        toLanguage: countries[ToLanguage],
      };

      xhr.send(JSON.stringify(translatedData));
    });
});

//handle swap icon to swap languages and text
swapIcon.addEventListener("click", () => {
  let tempText = originalText.value;
  originalText.value = translatedText.value;
  translatedText.value = tempText;

  let tempLanguage = selectTag[0].value;
  selectTag[0].value = selectTag[1].value;
  selectTag[1].value = tempLanguage;
});

//handle copy icons and volume icons
Icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (target.classList.contains("fa-copy")) {
      if (target.id == "From") {
        navigator.clipboard.writeText(originalText.value);
      } else {
        navigator.clipboard.writeText(translatedText.value);
      }
    } else {
      let words;
      if (target.id == "From") {
        words = new SpeechSynthesisUtterance(originalText.value);
        words.lang = selectTag[0].value;
      } else {
        words = new SpeechSynthesisUtterance(translatedText.value);
        words.lang = selectTag[1].value;
      }
      speechSynthesis.speak(words);
    }
  });
});
