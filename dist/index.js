class TextInput extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        const linkElem = document.createElement("link");
        linkElem.setAttribute("rel", "stylesheet");
        linkElem.setAttribute("href", "style.css");
        shadow.appendChild(linkElem);
        const initialWrapper = createWrapper();
        shadow.appendChild(initialWrapper);
        function createWrapper() {
            const wrapper = document.createElement("div");
            wrapper.setAttribute("class", "wrapper");
            shadow.appendChild(wrapper);
            const inputId = String(Math.floor(Math.random() * 1000000000));
            wrapper.setAttribute("id", inputId);
            // Array.prototype.push(inputId);
            // const idArr = Array.prototype;
            // console.log(idArr);
            const textContainer = document.createElement("div");
            textContainer.setAttribute("class", "text-container");
            textContainer.setAttribute("id", inputId);
            textContainer.setAttribute("draggable", "true");
            wrapper.appendChild(textContainer);
            const dragHandler = document.createElement("img");
            dragHandler.setAttribute("class", "draghandler-hidden");
            dragHandler.setAttribute("src", "../public/images/drag.png");
            dragHandler.setAttribute("draggable", "true");
            const text = document.createElement("div");
            text.setAttribute("class", "text");
            text.setAttribute("contenteditable", "true");
            text.setAttribute("placeholder", 'Type "/" for commands');
            textContainer.appendChild(dragHandler);
            textContainer.appendChild(text);
            textContainer.addEventListener("mouseover", () => {
                console.log("MOUSE OVER");
                dragHandler.setAttribute("class", "draghandler-show");
            });
            textContainer.addEventListener("mouseleave", () => {
                console.log("MOUSE LEAVE");
                dragHandler.setAttribute("class", "draghandler-hidden");
            });
            //https://developer.mozilla.org/ko/docs/Web/API/HTML_Drag_and_Drop_API#%EC%96%B4%EB%96%A4_%EA%B2%83%EC%9D%B4_draggable%EC%9D%B8%EC%A7%80_%ED%99%95%EC%9D%B8%ED%95%98%EA%B8%B0
            textContainer.ondragstart = handleDragStart;
            textContainer.ondragover = handleDragOver;
            textContainer.ondrop = handleDrop;
            let dragEl;
            let overEl;
            function handleDragStart(e) {
                e.dataTransfer.setData("text/plain", e.target.parentElement.id);
                dragEl = e.target;
                dragEl.nextElementSibling.style.backgroundColor = "rgb(228, 238, 251)";
                dragEl.nextElementSibling.style.borderRadius = "2px";
            }
            function handleDragOver(e) {
                overEl = e.target;
                e.preventDefault();
                overEl.children[1].style.borderBottom = "4px solid rgb(228, 238, 251)";
            }
            function handleDrop(e) {
                overEl.children.style.borderBottom = "none";
                e.preventDefault();
                const data = e.dataTransfer.getData("text/plain"); //drag해온 요소의 id
                e.target.parentElement.appendChild(shadow.getElementById(data));
                dragEl.nextElementSibling.style.backgroundColor = "none";
                e.target.children[1].style.backgroundColor = "rgb(228, 238, 251)";
            }
            textContainer.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    createWrapper().children[0].children[1].focus();
                    if (e.target !== shadow.activeElement) {
                        e.target.removeAttribute("placeholder");
                    }
                    e.preventDefault();
                }
            });
            textContainer.addEventListener("keydown", (e) => {
                const currentFocusedId = e.path[1].id;
                const currentFocused = shadow.getElementById(currentFocusedId);
                if (e.key === "ArrowDown") {
                    if (!currentFocused.nextElementSibling)
                        return;
                    currentFocused.nextElementSibling.children[0]
                        .children[1].focus();
                }
                if (e.key === "ArrowUp") {
                    if (!currentFocused.previousElementSibling.children[0])
                        return;
                    currentFocused.previousElementSibling.children[0]
                        .children[1].focus();
                }
                shadow.activeElement.setAttribute("placeholder", 'Type "/" for commands');
                if (text !== shadow.activeElement) {
                    text.removeAttribute("placeholder");
                }
            });
            const menuContainer = document.createElement("div");
            menuContainer.setAttribute("class", "menu-container");
            textContainer.addEventListener("keydown", (e) => {
                var _a;
                if (e.key === "/") {
                    wrapper.appendChild(menuContainer);
                }
                else {
                    (_a = menuContainer.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(menuContainer);
                }
            });
            const menuHeader = document.createElement("div");
            menuHeader.setAttribute("class", "menu-header");
            menuHeader.innerText = "BASIC BLOCKS";
            menuContainer.appendChild(menuHeader);
            const menuItems = [
                {
                    name: "Text",
                    summary: "Just start writing with plain text.",
                    img: "https://www.notion.so/images/blocks/text/en-US.png",
                    placeholder: 'Type "/" for commands',
                },
                {
                    name: "Heading 1",
                    summary: "Big section heading.",
                    img: "https://www.notion.so/images/blocks/header.57a7576a.png",
                },
                {
                    name: "Heading 2",
                    summary: "Medium section heading.",
                    img: "https://www.notion.so/images/blocks/subheader.9aab4769.png",
                },
                {
                    name: "Heading 3",
                    summary: "Small section heading.",
                    img: "https://www.notion.so/images/blocks/subsubheader.d0ed0bb3.png",
                },
                {
                    name: "Bulleted list",
                    summary: "Create a simple bulleted list.",
                    img: "https://www.notion.so/images/blocks/bulleted-list.0e87e917.png",
                    placeholder: "List",
                },
            ];
            menuItems.map((item) => {
                const menuBlock = document.createElement("div");
                menuBlock.setAttribute("class", "menu-block");
                menuBlock.addEventListener("click", () => onClickMenu(item));
                menuContainer.appendChild(menuBlock);
                const menuIcon = document.createElement("img");
                menuIcon.setAttribute("class", "menu-icon");
                menuIcon.setAttribute("src", item.img);
                const menuNameWrapper = document.createElement("div");
                menuNameWrapper.setAttribute("class", "menu-namewrapper");
                menuBlock.appendChild(menuIcon);
                menuBlock.appendChild(menuNameWrapper);
                const menuName = document.createElement("div");
                menuName.setAttribute("class", "menu-name");
                menuName.innerText = item.name;
                const menuSummary = document.createElement("div");
                menuSummary.setAttribute("class", "menu-summary");
                menuSummary.innerText = item.summary;
                menuNameWrapper.appendChild(menuName);
                menuNameWrapper.appendChild(menuSummary);
            });
            function onClickMenu(item) {
                console.log("MENU CLICKED!", text);
                switch (item) {
                    case menuItems[0]: {
                        text.setAttribute("class", "text");
                        text.setAttribute("placeholder", item.placeholder);
                        break;
                    }
                    case menuItems[1]: {
                        text.removeAttribute("class");
                        text.setAttribute("class", "heading1");
                        text.setAttribute("placeholder", item.name);
                        break;
                    }
                    case menuItems[2]: {
                        text.removeAttribute("class");
                        text.setAttribute("class", "heading2");
                        text.setAttribute("placeholder", item.name);
                        break;
                    }
                    case menuItems[3]: {
                        text.removeAttribute("class");
                        text.setAttribute("class", "heading3");
                        text.setAttribute("placeholder", item.name);
                        break;
                    }
                    case menuItems[4]: {
                        text.removeAttribute("class");
                        text.setAttribute("class", "bulletedlist");
                        text.setAttribute("placeholder", item.placeholder);
                        break;
                    }
                }
            }
            return wrapper;
        }
    }
}
window.customElements.define("text-input", TextInput);
//# sourceMappingURL=index.js.map