/**
 * Privacy page bootstrap: apply shared locale + language picker.
 */
function initPrivacyPage() {
  applyTranslations(getLocale());
}

window.addEventListener("load", initPrivacyPage);

document.querySelector("#lang-select")?.addEventListener("change", (event) => {
  applyTranslations(event.target.value);
});
