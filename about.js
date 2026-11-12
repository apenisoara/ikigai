/**
 * About page bootstrap: apply shared locale + language picker.
 */
function initAboutPage() {
  applyTranslations(getLocale());
}

window.addEventListener("load", initAboutPage);

document.querySelector("#lang-select")?.addEventListener("change", (event) => {
  applyTranslations(event.target.value);
});
