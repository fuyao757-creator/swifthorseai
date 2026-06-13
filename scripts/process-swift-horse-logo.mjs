import sharp from "sharp";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const out = join(root, "public", "logos", "swift-horse.png");

const candidates = [
  process.argv[2],
  join(
    root,
    "..",
    ".cursor/projects/c-Users-fulis-Desktop-cursor-BeyondMax-AI/assets/c__Users_fulis_AppData_Roaming_Cursor_User_workspaceStorage_ee99d66aa262bafcebfcf3679d1332fa_images_1779972562943-56bb795d-df52-43f1-8bad-998d4b6ff998.png"
  ),
  "C:/Users/fulis/.cursor/projects/c-Users-fulis-Desktop-cursor-BeyondMax-AI/assets/c__Users_fulis_AppData_Roaming_Cursor_User_workspaceStorage_ee99d66aa262bafcebfcf3679d1332fa_images_1779972562943-56bb795d-df52-43f1-8bad-998d4b6ff998.png",
  "C:/Users/fulis/.cursor/projects/c-Users-fulis-Desktop-cursor-BeyondMax-AI/assets/swift-horse-front-legs-spread.png",
  "C:/Users/fulis/.cursor/projects/c-Users-fulis-Desktop-cursor-BeyondMax-AI/assets/swift-horse-logo.png",
].filter(Boolean);

const input = candidates.find((p) => existsSync(p));

if (!input) {
  console.error("Source logo not found");
  process.exit(1);
}

function isRed(r, g, b) {
  return r > 80 && r > g + 20 && r > b + 20;
}

function isBackground(r, g, b) {
  const chroma = Math.max(r, g, b) - Math.min(r, g, b);
  const avg = (r + g + b) / 3;
  return chroma < 42 && avg > 135;
}

const { data, info } = await sharp(input)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height } = info;
const bg = new Uint8Array(width * height);
const queue = [];

for (let x = 0; x < width; x++) {
  queue.push(x, (height - 1) * width + x);
}
for (let y = 0; y < height; y++) {
  queue.push(y * width, y * width + width - 1);
}

while (queue.length) {
  const i = queue.pop();
  if (bg[i]) continue;
  const p = i * 4;
  if (!isBackground(data[p], data[p + 1], data[p + 2])) continue;
  bg[i] = 1;
  const x = i % width;
  const y = (i / width) | 0;
  if (x > 0) queue.push(i - 1);
  if (x < width - 1) queue.push(i + 1);
  if (y > 0) queue.push(i - width);
  if (y < height - 1) queue.push(i + width);
}

for (let i = 0; i < width * height; i++) {
  const p = i * 4;
  const r = data[p];
  const g = data[p + 1];
  const b = data[p + 2];
  if (bg[i] || (isBackground(r, g, b) && !isRed(r, g, b))) {
    data[p + 3] = 0;
  }
}

await sharp(data, { raw: { width, height, channels: 4 } })
  .trim()
  .resize(320, 320, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png({ compressionLevel: 9 })
  .toFile(out);

console.log(`Wrote transparent logo from: ${input}`);
