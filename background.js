// 通用的点击处理函数
chrome.contextMenus.onClicked.addListener(genericOnClick);

// 处理右键菜单点击事件
function genericOnClick(info) {
  var result = "";

  switch (info.menuItemId) {
    case "image":
      notifyUser("Success", info.srcUrl);
      result = info.srcUrl;
      break;
    case "video":
      notifyUser("Success", info.srcUrl);
      result = info.srcUrl;
      break;
    case "selection":
      notifyUser("Success", info.selectionText);
      result = info.selectionText;
      break;
    case "link":
      notifyUser("Success", info.linkUrl);
      result = info.linkUrl;
      break;
    case "page":
      notifyUser("Success", info.pageUrl);
      result = info.pageUrl;
      break;
    default:
      console.log("Fail Error", info);
  }
  sendToPhone(result, info.menuItemId);
}

// 创建右键菜单
chrome.runtime.onInstalled.addListener(function () {
  createContextMenu();
});

// 创建菜单的函数
function createContextMenu() {
  const contexts = ["page", "selection", "link", "image", "video", "audio"];
  const contextDic = {
    page: chrome.i18n.getMessage("pageLocal"),
    selection: chrome.i18n.getMessage("selectionLocal"),
    link: chrome.i18n.getMessage("linkLocal"),
    image: chrome.i18n.getMessage("imageLocal"),
    video: chrome.i18n.getMessage("videoLocal"),
    audio: chrome.i18n.getMessage("audioLocal"),
  };

  for (let i = 0; i < contexts.length; i++) {
    const context = contexts[i];
    const title = chrome.i18n.getMessage("sendAnyToIphoneLocal", [contextDic[context]]);
    chrome.contextMenus.create({
      title: title,
      contexts: [context],
      id: context,
    });
  }
}

// 通知用户的函数（使用chrome.notifications API）
function notifyUser(title, message) {
  chrome.notifications.create({
    type: "basic",
    title: title,
    iconUrl: "images/icon-128.png",
    message: message,
    buttons: [{ title: "Keep it Flowing." }],
    priority: 0,
  });
}

function sendToPhone(data, mode) {
  chrome.storage.sync.get("config", (result) => {
    let keys = result.config.keys || [];
    if (!keys || keys.length === 0) {
      return;
    }
    let sound = result.config.sound || "success";
    let group = result.config.group || "Chrome";
    let level = result.config.level || "active";

    let params = {
      sound: sound,
      group: group,
      level: level,
      title: chrome.i18n.getMessage("browserDataLocal"),
      body: mode,
      icon: "https://www.google.cn/chrome/static/images/favicons/apple-icon-180x180.png",
    };
    // "page", "selection", "link", "image", "video", "audio"
    if (mode === "page" || mode === "link" || mode === "audio") {
      params.url = data;
    } else if (mode === "image") {
      params.image = data;
    } else if (mode === "video") {
      params.video = data;
    } else {
      params.body = data;
    }

    keys.forEach((key) => {
      makeRequest(key, params);
    });
  });
}

chrome.action.onClicked.addListener((tab) => {
  chrome.action.setTitle({
    tabId: tab.id,
    title: `You are on tab: ${tab.id}`,
  });
});

// 编写一个请求函数，使用 encodeURIComponent 对参数进行编码
function makeRequest(key, params) {
  let urlWithParams = key;

  // 构建查询字符串并对参数进行编码
  const encodedParams = Object.keys(params)
    .map((key1) => {
      // 使用 encodeURIComponent 对键和值进行编码
      return `${encodeURIComponent(key1)}=${encodeURIComponent(params[key1])}`;
    })
    .join("&");

  // 拼接 URL 和查询字符串
  urlWithParams = `${key}?${encodedParams}`;

  // 发送 GET 请求
  fetch(urlWithParams, {
    method: "GET",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(console.log)
    .catch(console.log);
}
