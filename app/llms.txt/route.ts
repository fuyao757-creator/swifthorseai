import { generateLlmsTxt } from "@/lib/llms";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  return new Response(generateLlmsTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
