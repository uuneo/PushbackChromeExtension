
// 通用的点击处理函数
chrome.contextMenus.onClicked.addListener(genericOnClick);


// 处理右键菜单点击事件
function genericOnClick(info) {
	var result = "";

	switch (info.menuItemId) {
		case "image":
			// 处理图片点击
			console.log("图片已点击，地址:", info.srcUrl);
			notifyUser("图片已发送到手机", info.srcUrl);
			result = info.srcUrl;
			break;
		case "video":
			// 处理视频点击
			console.log("视频已点击，地址:", info.srcUrl);
			notifyUser("视频已发送到手机", info.srcUrl);
			result = info.srcUrl;
			break;
		case "selection":
			// 处理文字点击
			console.log("选中文字已点击:", info.selectionText);
			notifyUser("文字已发送到手机", info.selectionText);
			result = info.selectionText;
			break;
		case "link":
			// 处理链接点击
			console.log("链接已点击:", info.linkUrl);
			notifyUser("链接已发送到手机", info.linkUrl);
			result = info.linkUrl;
			break;
		case "page":
			// 处理页面点击
			console.log("页面已点击:", info.pageUrl);
			notifyUser("页面已发送到手机", info.pageUrl);
			result = info.pageUrl;
			break;
		default:
			console.log("未处理的菜单项点击事件", info);

			
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
		page: "页面",
		selection: "文字",
		link: "链接",
		image: "图片",
		video: "视频",
		audio: "音频",
	};


	for (let i = 0; i < contexts.length; i++) {
		const context = contexts[i];
		const title = `发送 [${contextDic[context]}] 到手机`;
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
	console.log("模拟将以下数据发送到手机:", data, mode);
	chrome.storage.sync.get("config", (result) => {
		let keys = result.config.keys || [];
		if (!keys || keys.length === 0) {
			return;
		}
		let url = result.config.url || "https://push.uuneo.com";
		let sound = result.config.sound || "success";
		let group = result.config.group || "";
		let level = result.config.level || "active";

		let params = {
			sound: sound,
			group: group,
			level: level,
			title: "浏览器数据",
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
			makeRequest(url, key, params);
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
function makeRequest(url, key, params) {
	let urlWithParams = url;

	// 构建查询字符串并对参数进行编码
	const encodedParams = Object.keys(params)
		.map((key) => {
			// 使用 encodeURIComponent 对键和值进行编码
			return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
		})
		.join("&");

	// 拼接 URL 和查询字符串
	urlWithParams = `${url}/${key}?${encodedParams}`;

	// 发送 GET 请求
	fetch(urlWithParams, {
		method: "GET",
		mode: "no-cors",
		headers: {
			"Content-Type": "application/json",
		},
	})
		.then((response) => response.json()) // 处理返回的 JSON 数据
		.then((data) => {
			console.log("响应数据:", data);
		})
		.catch((error) => {
			console.log("请求出错:", error);
		});
}