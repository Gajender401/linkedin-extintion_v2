declare namespace chrome {
    namespace tabs {
      function query(
        queryInfo: any,
        callback: (result: chrome.tabs.Tab[]) => void
      ): void;
    }
  
    namespace scripting {
      function executeScript(
        details: chrome.scripting.InjectDetails,
        callback?: (result: any[]) => void
      ): void;
    }

  }
  