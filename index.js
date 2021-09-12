console.log("Lichess focus extension loaded");

const LOCAL_STORAGE_KEY = "focus_games";

function getGames() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  } catch (e) {
    return ["Blitz", "Bullet", "Rapid", "Classical"];
  }
}

function toggleType(type) {
  const current = getGames();
  const newTypes = current.includes(type)
    ? current.filter((c) => c !== type)
    : [...current, type];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newTypes));
  callback();
}

function callback() {
  const games = document.querySelectorAll(".perf");
  const toKeep = getGames();

  for (let i = 0; i < games.length; i++) {
    const gameContainer = games[i].closest('div[data-id*="+"]');
    if (!gameContainer) continue;

    if (toKeep.includes(games[i].textContent)) {
      gameContainer.style = "display: flex";
    } else {
      gameContainer.style = "display: none";
    }
  }
}

const domObserver = new MutationObserver(callback);
const container = document.querySelector(".lobby");
const config = { attributes: true, childList: true, characterData: true };
domObserver.observe(container, config);

// Listen for toggles from popup
chrome.runtime.onMessage.addListener(function (request, _, sendResponse) {
  if (!request.type) return;
  toggleType(request.type);
  sendResponse({ games: JSON.stringify(getGames()) });
});

// Provide game info if popup asks for it
chrome.runtime.onMessage.addListener((msg, _, response) => {
  if (msg.from === "popup" && msg.subject === "DOMInfo") {
    response({ games: JSON.stringify(getGames()) });
  }
});
