const dotenv = require("dotenv");
const fs = require("fs");

console.log("Starting build...");

const variables = dotenv.parse(
  Buffer.from(fs.readFileSync("./.env", { flag: "r" }))
);

let envFileWriteData = "";
let keys = [];
for (const [key, data] of Object.entries(variables)) {
  envFileWriteData = envFileWriteData.concat(
    `export const ${key} = "${data}"; \n`
  );
  keys.push(key);
}

fs.writeFileSync("./build/tmp/vars.ts", envFileWriteData);

let indexFileWriteData = fs.readFileSync("./src/index.ts").toString();
indexFileWriteData =
  `import {BOT_KEY_PASS} from "./vars"; \n` + indexFileWriteData;
indexFileWriteData = indexFileWriteData.replace("dotenv.config();", "");
indexFileWriteData = indexFileWriteData.replace(
  `import dotenv from "dotenv";`,
  ""
);
indexFileWriteData = indexFileWriteData.replaceAll("process.env.", "");

fs.writeFileSync("./build/tmp/index.ts", indexFileWriteData);

let apiFileWriteData = fs.readFileSync("./src/scripts/api.ts").toString();
apiFileWriteData = apiFileWriteData.replace("dotenv.config();", "");
apiFileWriteData = apiFileWriteData.replace(`import dotenv from "dotenv";`, "");
apiFileWriteData =
  `import {${JSON.stringify(keys)
    .slice(1, -1)
    .replaceAll(`"`, "")}} from "../vars"` + apiFileWriteData;
apiFileWriteData = apiFileWriteData.replaceAll("process.env.", "");

fs.writeFileSync("./build/tmp/scripts/api.ts", apiFileWriteData);

console.log("Done 👍");
