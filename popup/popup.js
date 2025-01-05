document.addEventListener("DOMContentLoaded", () => {
  // Load saved options and set up initial state
  loadOptions();
  setLang();
});

function loadOptions() {
  chrome.storage.sync.get("config", function (result) {
    let keyList = document.getElementById("key-list");
    let keyResult = result.config.keys || [];

    keyResult.forEach((keyValue, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = keyValue;

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.textContent = "x";
      removeBtn.className = "removeBtn";
      removeBtn.addEventListener("click", () => {
        keyList.removeChild(listItem);
      });

      listItem.appendChild(removeBtn);
      keyList.appendChild(listItem);
    });

    // 处理获取到的 result
    console.log(result);
    document.getElementById("sound").value = result.config.sound || "success";
    document.getElementById("group").value = result.config.group || "Safari";
    document.getElementById("level").value = result.config.level || "active";
  });
}

document.getElementById("add-key").addEventListener("click", () => {
  const keyInput = document.getElementById("key-input");
  const keyList = document.getElementById("key-list");
  const keyValue = keyInput.value.trim();

  // 检查输入是否为空
  if (!keyValue) {
    message("Invalid key");
    return;
  }

  // 检查是否为有效的 URL
  const urlPattern = /^(https?:\/\/)?([\w\-]+\.)+[\w\-]+(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/;
  if (!urlPattern.test(keyValue)) {
    message("Key must be a valid URL");
    return;
  }

  // 检查是否重复
  const existingKeys = Array.from(keyList.children).map((li) => li.firstChild.textContent);
  if (existingKeys.includes(keyValue)) {
    message("Key repeat");
    return;
  }

  // 添加到列表
  const listItem = document.createElement("li");
  listItem.textContent = keyValue;

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.textContent = "X";
  removeBtn.addEventListener("click", () => {
    keyList.removeChild(listItem);
  });
  removeBtn.className = "removeBtn";
  listItem.appendChild(removeBtn);
  keyList.appendChild(listItem);

  // 清空输入框
  keyInput.value = "";
});

document.getElementById("config-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const keys = Array.from(document.getElementById("key-list").children).map(
    (li) => li.firstChild.textContent
  );
  const config = {
    keys: keys,
    sound: document.getElementById("sound").value,
    group: document.getElementById("group").value,
    level: document.getElementById("level").value,
  };
  chrome.storage.sync.set({
    config: config,
  });
  message("Save OK!");
});

function message(msg) {
  const popup = document.getElementById("iframe-container");

  // 设置消息内容并显示弹窗
  popup.textContent = msg;
  popup.style.display = "block";

  // 1秒后自动隐藏弹窗
  setTimeout(() => {
    popup.style.display = "none";
  }, 1000); // 1000 毫秒 = 1 秒
}

function setLang() {
  document.querySelector("#appStoreLocal").innerHTML = chrome.i18n.getMessage("appStoreLocal");
  document.querySelector("#pushConfigLocal").innerHTML = chrome.i18n.getMessage("pushConfigLocal");
  document.querySelector("#saveLocal").innerHTML = chrome.i18n.getMessage("saveLocal");
  document.querySelector("#keyListLocal").innerHTML = chrome.i18n.getMessage("keyListLocal");
}
