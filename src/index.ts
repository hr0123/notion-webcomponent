// console.log("hi");
function main() {
  const head = document.getElementById("head");
  head?.addEventListener("click", onClickHead);
  function onClickHead() {
    console.log("CLICK!!");
  }
}
