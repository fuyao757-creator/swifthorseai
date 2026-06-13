import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const input = join(root, "public/videos/hero-horses.mp4");
const output = join(root, "public/videos/hero-horses-mobile-h264.mp4");
const poster = join(root, "public/images/hero-horses-poster.jpg");

function resolveFfmpeg() {
  const localCandidates = [
    join(
      process.env.LOCALAPPDATA ?? "",
      "Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1.1-full_build/bin/ffmpeg.exe"
    ),
    join(root, "node_modules/ffmpeg-static/ffmpeg.exe"),
  ];

  for (const candidate of localCandidates) {
    if (existsSync(candidate)) return candidate;
  }

  try {
    const fromPath = execFileSync("where.exe", ["ffmpeg"], {
      encoding: "utf8",
    })
      .trim()
      .split(/\r?\n/)[0];
    if (fromPath && existsSync(fromPath)) return fromPath;
  } catch {
    // ignore
  }

  return null;
}

const ffmpeg = resolveFfmpeg();
if (!ffmpeg) {
  console.error("ffmpeg not found. Install FFmpeg and ensure it is on PATH.");
  process.exit(1);
}

if (!existsSync(input)) {
  console.error(`Missing input: ${input}`);
  process.exit(1);
}

console.log(`Encoding mobile hero video with ${ffmpeg}…`);
execFileSync(
  ffmpeg,
  [
    "-y",
    "-i",
    input,
    "-vf",
    "scale=480:-2",
    "-r",
    "24",
    "-c:v",
    "libx264",
    "-crf",
    "32",
    "-preset",
    "fast",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-an",
    output,
  ],
  { stdio: "inherit" }
);

console.log("Extracting poster frame…");
execFileSync(
  ffmpeg,
  [
    "-y",
    "-i",
    input,
    "-vf",
    "scale=640:-2",
    "-vframes",
    "1",
    "-q:v",
    "75",
    "-update",
    "1",
    poster,
  ],
  { stdio: "inherit" }
);

console.log(`Done: ${output}`);
