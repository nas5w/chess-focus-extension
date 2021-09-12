function listener(e) {
  if (e.target.tagName.toLowerCase() !== "input") {
    return;
  }
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: e.target.value },
      function (response) {
        if (response.games) {
          try {
            syncGames(JSON.parse(response.games));
          } catch (e) {
            console.log(e);
          }
        }
      }
    );
  });
}

function syncGames(games) {
  const allTypes = document.querySelectorAll("input[type='checkbox']");
  for (let i = 0; i < allTypes.length; i++) {
    allTypes[i].checked = games.includes(allTypes[i].getAttribute("value"));
  }
}

const list = document.querySelector("#game-list");

list?.addEventListener("click", listener);

window.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { from: "popup", subject: "DOMInfo" },
        (response) => {
          try {
            syncGames(JSON.stringify(response.games));
          } catch (e) {
            console.log(e);
          }
        }
      );
    }
  );
});
