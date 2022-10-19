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
      // wrapper.setAttribute("id", inputId);
      // let idArr = Array.prototype;
      // idArr.push(inputId);
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

      textContainer.ondragstart = handleDragStart;
      textContainer.ondragover = handleDragOver;
      textContainer.ondrop = handleDrop;
      textContainer.ondragend = handleDragEnd;
      let overEl;
      function handleDragStart(e: DragEvent) {
        e.dataTransfer.setData(
          "text/plain",
          (e.target as HTMLElement).parentElement.id //drag dragHandler의 textContainer의 id(hold the data that is being dragged)
        );
        e.dataTransfer.dropEffect = "move";
      }
      function handleDragOver(e: DragEvent) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        overEl = (e.target as HTMLElement).children[1]; //over text
        if (overEl === undefined) return;
        overEl.style.borderBottom = "4px solid rgb(228, 238, 251)";
      }
      function handleDrop(e: DragEvent) {
        e.preventDefault();
        if (overEl === undefined) return;
        overEl.style.borderBottom = "none";
        const data = e.dataTransfer.getData("text/plain"); //drag textContainer의 id
        let allTextContainer = shadow.querySelectorAll(".text-container"); // 전체textContainer들의 배열 만들어, 그 안에서 drag와 drop의 인덱스 순서 비교
        let dragIndex = Array.from(allTextContainer).indexOf(
          shadow.getElementById(data)
        );
        let dropTextContainer = e.target as HTMLElement;
        let dropIndex = Array.from(allTextContainer).indexOf(dropTextContainer);
        if (dragIndex === -1 || dragIndex > dropIndex) {
          dropTextContainer.parentElement.insertBefore(
            shadow.getElementById(data),
            dropTextContainer
          );
        } else if (dragIndex < dropIndex) {
          dropTextContainer.parentElement.appendChild(
            shadow.getElementById(data)
          );
        }
      }
      function handleDragEnd(e: DragEvent) {
        let dragEndText = (e.target as HTMLElement)
          .nextElementSibling as HTMLElement;
        dragEndText.style.backgroundColor = "rgb(228, 238, 251)";
      }

      textContainer.addEventListener("keydown", (e: Event) => {
        if ((e as KeyboardEvent).key === "Enter") {
          (createWrapper().children[0].children[1] as HTMLDivElement).focus();
          if (e.target !== shadow.activeElement) {
            (e.target as HTMLElement).removeAttribute("placeholder");
          }
          e.preventDefault();
        }
      });

      textContainer.addEventListener("keydown", (e: Event) => {
        const focusedWrapper = shadow.getElementById((<any>e).path[1].id)
          .parentElement as HTMLElement;
        if ((e as KeyboardEvent).key === "ArrowDown") {
          if (!focusedWrapper.nextElementSibling) return;
          (
            focusedWrapper.nextElementSibling.children[0]
              .children[1] as HTMLElement
          ).focus();
        }
        if ((e as KeyboardEvent).key === "ArrowUp") {
          if (!focusedWrapper.previousElementSibling.children[0]) return;
          (
            focusedWrapper.previousElementSibling.children[0]
              .children[1] as HTMLElement
          ).focus();
        }
        shadow.activeElement.setAttribute(
          "placeholder",
          'Type "/" for commands'
        );
        if (text !== shadow.activeElement) {
          text.removeAttribute("placeholder");
        }
      });

      const menuContainer = document.createElement("div");
      menuContainer.setAttribute("class", "menu-container");
      textContainer.addEventListener("keydown", (e: Event) => {
        if ((e as KeyboardEvent).key === "/") {
          wrapper.appendChild(menuContainer);
        } else {
          menuContainer.parentNode?.removeChild(menuContainer);
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
