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

      const textContainer = document.createElement("div");
      textContainer.setAttribute("class", "text-container");
      textContainer.setAttribute("id", inputId);
      wrapper.appendChild(textContainer);

      const dragHandler = document.createElement("img");
      dragHandler.setAttribute("class", "draghandler");
      dragHandler.setAttribute("src", "../public/images/drag.png");
      const text = document.createElement("div");
      text.setAttribute("class", "text");
      text.setAttribute("contenteditable", "true");
      text.setAttribute("placeholder", 'Type "/" for commands');
      textContainer.appendChild(dragHandler);
      textContainer.appendChild(text);
      // textContainer.focus();

      textContainer.addEventListener("keydown", (e: Event) => {
        if ((e as KeyboardEvent).key === "Enter") {
          (createWrapper().children[0].children[1] as HTMLDivElement).focus();
          e.preventDefault();
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

      menuItems.map((item) => menu(item));

      function menu(item) {
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
      }

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
