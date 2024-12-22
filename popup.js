document.addEventListener("DOMContentLoaded", () => {
    const showUpdateButton = document.getElementById("showUpdateButton");
    const showNoUpdateButton = document.getElementById("showNoUpdateButton");
    const showAllButton = document.getElementById("showAllButton");
    const countDisplay = document.getElementById("countDisplay");
  
    // Function to fetch data from the active tab and update counts
    function updateCounts(refreshing = false) {
      countDisplay.innerHTML = refreshing
        ? `<strong>Effect Counts:</strong><br>🔄 Refreshing...`
        : `<strong>Effect Counts:</strong><br>Fetching data...`;
  
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab) {
          chrome.scripting.executeScript(
            {
              target: { tabId: tab.id },
              func: () => {
                const effectsList = Array.from(document.querySelectorAll('tr[role="row"]'));
                const allEffectsCount = effectsList.length;
                const needUpdateCount = effectsList.filter(row =>
                  row.innerHTML.includes("Needs update")
                ).length;
                return { allEffectsCount, needUpdateCount };
              },
            },
            (results) => {
              if (results && results[0] && results[0].result) {
                const { allEffectsCount, needUpdateCount } = results[0].result;
                const noUpdateCount = allEffectsCount - needUpdateCount;
  
                countDisplay.innerHTML = `
                  <strong>Effect Counts:</strong><br>
                  Needs Update: ${needUpdateCount} | 
                  Does Not Need Update: ${noUpdateCount} | 
                  All Effects: ${allEffectsCount}
                  <button id="refreshButton" style="margin-top: 10px; padding: 5px 10px; background-color: #007BFF; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 14px;">Refresh</button>
                `;
  
                document.getElementById("refreshButton").addEventListener("click", () => updateCounts(true));
              }
            }
          );
        }
      });
    }
  
    // Button Click Listeners
    showUpdateButton.addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              document.querySelectorAll('tr[role="row"]').forEach(row => {
                row.style.display = row.innerHTML.includes("Needs update") ? "grid" : "none";
              });
            },
          });
        }
      });
      updateCounts();
    });
  
    showNoUpdateButton.addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              document.querySelectorAll('tr[role="row"]').forEach(row => {
                row.style.display = !row.innerHTML.includes("Needs update") ? "grid" : "none";
              });
            },
          });
        }
      });
      updateCounts();
    });
  
    showAllButton.addEventListener("click", () => {
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        if (tab) {
          chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              document.querySelectorAll('tr[role="row"]').forEach(row => {
                row.style.display = "grid";
              });
            },
          });
        }
      });
      updateCounts();
    });
  
    // Initial update of counts
    updateCounts();
  });
  