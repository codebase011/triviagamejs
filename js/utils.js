/*********************************************************************************************************
 * Algunos textos vienen con caracteres html, esta función es para transformarlos en texto normal
 ***********************o**********************************************************************************/
// Ejemplo: "&lt;scroll&gt;&lt;/scroll&gt;"
function HTMLDecode(text) {
  // text = "&lt;scroll&gt;&lt;/scroll&gt;";
  let doc = new DOMParser().parseFromString(text, "text/html");
  return doc.documentElement.textContent;
}

export { HTMLDecode };
