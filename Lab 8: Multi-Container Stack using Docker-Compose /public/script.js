const affirmations = [
  "You are allowed to take things one breath and one moment at a time.",
  "You do not have to have everything figured out today.",
  "Your feelings are valid, and you deserve kindness while experiencing them.",
  "Small steps are still progress.",
  "You have made it through difficult moments before.",
  "Rest is not a reward. Rest is part of caring for yourself.",
  "You are worthy of patience, compassion, and support.",
  "It is okay to move at your own pace.",
  "You are not alone, even when things feel overwhelming.",
  "There is strength in asking for help."
];

const affirmationText = document.getElementById("affirmation-text");
const affirmationButton = document.getElementById("affirmation-button");

let currentAffirmationIndex = 0;

function showNextAffirmation() {
  currentAffirmationIndex =
    (currentAffirmationIndex + 1) % affirmations.length;

  affirmationText.textContent = affirmations[currentAffirmationIndex];
}

affirmationButton.addEventListener("click", showNextAffirmation);

console.log("Mental Health App Loaded Successfully!");
