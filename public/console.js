const req = process.env.NODE_ENV === 'production' ? require : window.require;
const querystring = req('querystring');
const Clusterize = req('clusterize.js');

(() => {
  const { ipcRenderer } = window.require('electron');

  document.getElementById('closeButton').addEventListener('click', () => {
    ipcRenderer.invoke(`closeConsole-${pid}`);
  });

  const logs = [];

  const { instanceName, pid } = querystring.parse(
    window.global.location.search.slice(1)
  );

  document.getElementById('name').innerText = instanceName;

  const list = new Clusterize({
    rows: logs,
    scrollId: 'scrollArea',
    contentId: 'contentArea'
  });

  let isBottom = true;

  ipcRenderer.on('log-data', (e, logData) => {
    const addLog = data => {
      const date = new Date();
      const regex = /\[\D+|\d+\]/;

      const existTimeStamp = regex.test(data.text);
      const includesMainInfo = data.text.includes('[main/INFO] ');
      const includesMainWarn = data.text.includes('[main/WARN] ');
      const includesMainError = data.text.includes('[main/ERROR] ');

      const calcHeader = (inf, warn, err) => {
        if (inf) {
          return `<span style="color: #27AE60">[main/INFO]</span>`;
        }
        if (warn) {
          return `<span style="color: #FAB849">[main/WARN]</span>`;
        }
        if (err) {
          return `<span style="color: #d62828">[main/ERROR]</span>`;
        }
        return '';
      };

      const logsWithInfos = `<div>
              <span style="color: white" >${`[
            ${date.getHours()}
            :
            ${date.getMinutes()}
            :
            ${date.getSeconds()}
            ] `}
              </span>
              ${calcHeader(
                includesMainInfo,
                includesMainWarn,
                includesMainError
              )}
                <span style="color: #979CA1">${data.text.replace(
                  /\[(.+?)\]/g,
                  ''
                )}</span></div>`;

      const logsWithTime = `<div>
              <span style="color: white">${`[
            ${date.getHours()}
            :
            ${date.getMinutes()}
            :
            ${date.getSeconds()}
            ] `}</span>
              <span style="color: #979CA1">${data.text}</span>
              </div>`;

      const ParsedLogs = existTimeStamp ? logsWithInfos : logsWithTime;

      logs.push(ParsedLogs);

      list.update([...logs, ParsedLogs]);
      const elem = document.getElementById('scrollArea');
      if (isBottom) elem.scrollTop = elem.scrollHeight;
    };

    if (Array.isArray(logData)) {
      logData.forEach(addLog);
    } else {
      addLog(logData);
    }
  });

  const scrollDwButton = document.getElementById('scrollDownButton');

  scrollDwButton.addEventListener('click', () => {
    document.getElementById('scrollArea').scrollTop =
      document.getElementById('scrollArea').scrollHeight -
      document.getElementById('scrollArea').offsetHeight;
    scrollDwButton.style.display = 'none';
    isBottom = true;
  });

  document.getElementById('scrollArea').addEventListener('wheel', () => {
    scrollDwButton.style.display = 'block';
    isBottom = false;
  });
})();
