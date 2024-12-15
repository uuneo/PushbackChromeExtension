document.addEventListener("DOMContentLoaded", () => {
	// Load saved options and set up initial state
	loadOptions();
});



function loadOptions() {
	chrome.storage.sync.get("config", function (result) {

		let keyList = document.getElementById("key-list") 
		let keyResult = result.config.keys || []

		keyResult.forEach((keyValue, index) => {
			const listItem = document.createElement("li");
			listItem.textContent = keyValue;

			const removeBtn = document.createElement("button");
			removeBtn.type = "button";
			removeBtn.textContent = "删除";
			removeBtn.className = "removeBtn";
			removeBtn.addEventListener("click", () => {
				keyList.removeChild(listItem);
			});

			listItem.appendChild(removeBtn);
			keyList.appendChild(listItem);
		 })


		// 处理获取到的 result
		console.log(result);
		document.getElementById("url").value = result.config.url || "https://push.uuneo.com"
		document.getElementById("sound").value = result.config.sound || "success"
		document.getElementById("group").value = result.config.group || "Chrome"
		document.getElementById("level").value = result.config.level || "active"
		
	});
}

document.getElementById("add-key").addEventListener("click", () => {
	const keyInput = document.getElementById("key-input");
	const keyList = document.getElementById("key-list");
	const keyValue = keyInput.value.trim();

	if (!keyValue) {
		alert("请输入有效的 Key");
		return;
	}

	const existingKeys = Array.from(keyList.children).map(
		(li) => li.firstChild.textContent
	);
	if (existingKeys.includes(keyValue)) {
		alert("Key 已存在");
		return;
	}

	const listItem = document.createElement("li");
	listItem.textContent = keyValue;

	const removeBtn = document.createElement("button");
	removeBtn.type = "button";
	removeBtn.textContent = "删除";
	removeBtn.addEventListener("click", () => {
		keyList.removeChild(listItem);
	});
	removeBtn.className = "removeBtn";
	listItem.appendChild(removeBtn);
	keyList.appendChild(listItem);
	keyInput.value = "";
});

document.getElementById("config-form").addEventListener("submit", (e) => {
	e.preventDefault();
	const keys = Array.from(document.getElementById("key-list").children).map(
		(li) => li.firstChild.textContent
	);
	const config = {
		url: document.getElementById("url").value,
		keys: keys,
		sound: document.getElementById("sound").value,
		group: document.getElementById("group").value,
		level: document.getElementById("level").value,
	};
	chrome.storage.sync.set({
		config: config,
	});
	console.log("保存的配置:", config);
	alert("配置已保存!");
});
