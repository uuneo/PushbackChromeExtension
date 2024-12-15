console.log("页面插入成功");

const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		if (mutation.type === "childList") {
			// 查找新加载的 div._aagw 并删除
			const newDivs = document.querySelectorAll("div._aagw");
			newDivs.forEach((div) => {
				div.remove();
			});
		}
	});
});

// 观察整个文档的子节点变化
observer.observe(document.body, { childList: true, subtree: true });

console.log(
	"Observer started: All divs with class '_aagw' will be removed dynamically."
);
