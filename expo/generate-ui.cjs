const fs = require("node:fs");
const path = require("node:path");

function writeUiModule(root) {
  const assets = path.join(root, "app", "src", "main", "assets");
  const read = name => fs.readFileSync(path.join(assets, name), "utf8");
  const html = read("index.html");
  const css = read("style.css");
  const js = read("app.js");

  if (!html.includes('<link rel="stylesheet" href="style.css">')
      || !html.includes('<script src="app.js"></script>')) {
    throw new Error("Nefes assets no longer match the Expo HTML entry point.");
  }

  const inline = html
    .replace('<link rel="stylesheet" href="style.css">', () => "<style>" + css + "</style>")
    .replace('<script src="app.js"></script>', () => "<script>" + js.replace(/<\/script/gi, "<\\/script") + "</script>");
  const output = path.join(root, "expo", "ui.generated.js");
  const moduleSource = "export default " + JSON.stringify(inline) + ";\n";
  if (!fs.existsSync(output) || fs.readFileSync(output, "utf8") !== moduleSource) {
    fs.writeFileSync(output, moduleSource);
  }
}

module.exports = { writeUiModule };
