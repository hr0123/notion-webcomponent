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

      textContainer.addEventListener("dragstart", (e: any) => {
        let nowDragging;
        let whereToDrop;
        console.log("drag start", e.target);
        nowDragging = e.target; //TextContainer
        nowDragging.classList.add("nowdragging"); //drag동안 적용되는 Style
        textContainer.addEventListener(
          "dragover",
          (e) => {
            console.log("drag over", e.target);
            e.preventDefault(); //drop가능하도록, 기본동작(다른EventListener들?) 막기(false는 이벤트 버블링 설정)
          },
          false
        );
        textContainer.addEventListener("dragenter", (e: any) => {
          console.log("drag enter", e.target);
          // drag해오다가 drop대상 위로 enter(진입하면) -> 강조Style 적용(class추가)
          // if (e.target.classList.contains("dropzone")) {
          //   e.target.classList.add("dragover");
          // }
        });
        textContainer.addEventListener("dragleave", (e: any) => {
          console.log("drag leave", e.target);
          // drag해오다가 drop대상 밖으로 leave(벗어나면) -> 강조Style 종료(class제거)
          // if (e.target.classList.contains("dropzone")) {
          //   e.target.classList.remove("dragover");
          // }
        });
        textContainer.addEventListener("drop", (e: any) => {
          console.log("DROP!!", e.target);
          // 기본동작(일부 요소의 링크 열기 등) 막기
          e.preventDefault();
          // drop대상을 변수에 저장
          whereToDrop = e.target;
          // drag해오던 요소가 drop대상 위에 drop되면
          // if (e.target.classList.contains("dropzone")) {
          //   // 1. 강조Style 종료(class제거)
          //   // e.target.classList.remove("dragover");
          //   e.target.parentNode.classList.remove("dragover");
          //   // 2. drag 종료: drag해온요소로 drop대상을 replace(child제거)
          //   nowDragging.parentNode.removeChild(nowDragging);
          //   // 3. drag해온요소로 drop대상을 replace
          //   // e.target.appendChild(nowDragging);
          //   e.target.parentNode.appendChild(nowDragging);
          // }
        });
        textContainer.addEventListener("dragend", (e: any) => {
          console.log("drag end", e.target);
          // e.target.classList.remove("nowdragging");
        });
      });

      textContainer.addEventListener("keydown", (e: Event) => {
        if ((e as KeyboardEvent).key === "Enter") {
          (createWrapper().children[0].children[1] as HTMLDivElement).focus();
          // console.log(shadow.activeElement);
          e.preventDefault();
        }
      });

      textContainer.addEventListener("keydown", (e: Event) => {
        const currentFocusedId = (<any>e).path[1].id;
        const currentFocused = shadow.getElementById(
          currentFocusedId
        ) as HTMLElement;
        if ((e as KeyboardEvent).key === "ArrowDown") {
          if (!currentFocused.nextElementSibling) return;
          (
            currentFocused.nextElementSibling.children[0]
              .children[1] as HTMLElement
          ).focus();
          console.log("arrow DOWN!!");
        }
        if ((e as KeyboardEvent).key === "ArrowUp") {
          if (!currentFocused.previousElementSibling.children[0]) return;
          (
            currentFocused.previousElementSibling.children[0]
              .children[1] as HTMLElement
          ).focus();
          console.log("arrow UP!!");
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
