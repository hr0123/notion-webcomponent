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
        dragHandler.setAttribute("class", "draghandler-show");
      });
      textContainer.addEventListener("mouseleave", () => {
        dragHandler.setAttribute("class", "draghandler-hidden");
      });

      textContainer.ondragstart = handleDragStart;
      textContainer.ondragover = handleDragOver;
      textContainer.ondrop = handleDrop;
      textContainer.ondragend = handleDragEnd;

      function handleDragStart(e: DragEvent) {
        e.dataTransfer.setData(
          "text/plain",
          (e.target as HTMLElement).parentElement.id //drag dragHandler??? textContainer??? id
        );
        e.dataTransfer.dropEffect = "move";
        shadow
          .querySelectorAll(".text")
          .forEach(
            (el) => ((el as HTMLElement).style.backgroundColor = "white")
          );
      }

      function handleDragOver(e: DragEvent) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        let overText = (e.target as HTMLElement).children[1] as HTMLElement;
        if (overText === undefined) return;
        overText.style.borderBottom = "4px solid rgb(228, 238, 251)";
        shadow
          .querySelectorAll(".text")
          .forEach(
            (el) =>
              el !== overText &&
              ((el as HTMLElement).style.borderBottom = "none")
          );
      }

      function handleDrop(e: DragEvent) {
        e.preventDefault();
        const allTextContainers = shadow.querySelectorAll(".text-container"); // ??????textContainer?????? ?????? ?????????, ??? ????????? drag??? drop??? ????????? ?????? ??????
        const data = e.dataTransfer.getData("text/plain"); //drag textContainer??? id
        const dragIndex = Array.from(allTextContainers).indexOf(
          shadow.getElementById(data)
        );
        const dropTextContainer = e.target as HTMLElement;
        const dropIndex =
          Array.from(allTextContainers).indexOf(dropTextContainer);
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
        (dropTextContainer.children[1] as HTMLElement).style.borderBottom =
          "none";
        (dropTextContainer.children[1] as HTMLElement).style.backgroundColor =
          "white";
      }

      function handleDragEnd(e: DragEvent) {
        (
          (e.target as HTMLElement).nextElementSibling as HTMLElement
        ).style.backgroundColor = "rgb(228, 238, 251)";
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
      const menuHeader = document.createElement("div");
      menuHeader.setAttribute("class", "menu-header");
      menuHeader.innerText = "BASIC BLOCKS";
      menuContainer.appendChild(menuHeader);
      textContainer.addEventListener("keydown", (e: Event) => {
        if ((e as KeyboardEvent).key === "/") {
          wrapper.appendChild(menuContainer);
        } else {
          menuContainer.parentNode?.removeChild(menuContainer);
        }
      });
      shadow.addEventListener("click", () => {
        menuContainer.parentNode?.removeChild(menuContainer);
        // console.log(text.style.backgroundColor);
        // (shadow.querySelector(".text") as HTMLElement).style.backgroundColor =
        //   "white";
      });

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
