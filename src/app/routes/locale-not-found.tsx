import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import type { Route } from "./+types/locale-not-found";
import { useLocale } from "~/i18n/useLocale";
import { useT } from "~/i18n/useT";
import { buildMeta } from "~/lib/meta";
import { pageSetup } from "~/lib/page";
import { localePath } from "~/lib/paths";
import { NAV_ITEMS } from "~/components/Header";
import { HeritageDivider } from "~/components/HeritageDivider";
import { PageHero } from "~/components/PageHero";
import styles from "./not-found.module.css";

export async function loader({ request }: Route.LoaderArgs) {
  const { locale, t } = await pageSetup(request, "home", []);
  return {
    meta: [
      ...buildMeta({
        locale,
        path: "404",
        title: t("notFound.title"),
        siteTitle: t("brand.siteTitle"),
        description: t("notFound.body"),
      }).filter((m) => !("tagName" in m)),
      { name: "robots", content: "noindex" },
    ],
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return loaderData?.meta ?? [];
}

export default function LocaleNotFound() {
  const t = useT();
  const locale = useLocale();
  return (
    <>
      <PageHero variant="notice" eyebrow="404" title={t("notFound.title")} intro={t("notFound.body")}>
        <Link to={localePath(locale)} className="arrow-link">
          {t("notFound.home")} <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </PageHero>
      <section className={`container ${styles.wrap}`} aria-label={t("notFound.sections")}>
      <HeritageDivider />
      <p className="eyebrow">{t("notFound.sections")}</p>
      <ul className={styles.links}>
        {NAV_ITEMS.map((item) => (
          <li key={item}>
            <Link to={localePath(locale, item)}>{t(`nav.${item}`)}</Link>
          </li>
        ))}
      </ul>
      </section>
    </>
  );
}
