import { buildHreflangTags, getCanonicalUrl } from "@/lib/seo";

import { defaultLocale } from "@/lib/i18n";



export function HreflangTags({ path }: { path: string }) {

  const tags = buildHreflangTags(path);

  return (

    <>

      {tags.map(({ hrefLang, href }) => (

        <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={href} />

      ))}

      <link

        rel="alternate"

        hrefLang="x-default"

        href={getCanonicalUrl(defaultLocale, path)}

      />

    </>

  );

}


