import { ExternalLink, MapPin } from "lucide-react";
import type { Route } from "./+types/visit";
import { ADDRESS_LINES, ETIQUETTE, ETIQUETTE_BY_ID, ETIQUETTE_VERIFIED_AT, VISIT_FACT_IDS } from "~/content/etiquette";
import { SPACES } from "~/content/spaces";
import { aksara, image, pick } from "~/content/resolve";
import { useLocale } from "~/i18n/useLocale";
import { useT } from "~/i18n/useT";
import { buildMeta } from "~/lib/meta";
import { buildRefs, pageSetup } from "~/lib/page";
import { localePath } from "~/lib/paths";
import { PageHero } from "~/components/PageHero";
import { Pictogram } from "~/components/Pictogram";
import { Refs } from "~/components/Refs";
import { SourceList } from "~/components/SourceList";
import { SitePlan } from "~/components/SitePlan";
import styles from "./visit.module.css";

const GROUPS = ["dress", "photo", "conduct", "tour"] as const;
const OFFICIAL_TICKETS = "https://mangkunegaran.co.id/tiket/";
const OFFICIAL_SITE = "https://mangkunegaran.id";
/** Map link published on mangkunegaran.id. */
const OFFICIAL_MAP = "https://maps.app.goo.gl/y8ssYUtdUPiDnHXi6";

export async function loader({ request }: Route.LoaderArgs) {
  const { locale, t, messages, content } = await pageSetup(request, "visit", ["visit"]);
  const lang = content.lang;
  const places = SPACES.filter((s) => s.plan)
    .sort((a, b) => a.order - b.order)
    .map((s, i) => ({
      id: s.id,
      order: i + 1,
      name: s.name,
      summary: pick(s.summary, lang),
      x: s.plan!.x,
      y: s.plan!.y,
      aksara: aksara(s.aksaraId),
      image: s.imageId ? image(s.imageId, lang) : null,
      rules: s.etiquetteIds.map((id) => ({ id, icon: ETIQUETTE_BY_ID.get(id)!.icon, label: t(`visit:rules.items.${id}`) })),
      href: `${localePath(locale, "architecture")}#${s.id}`,
      factIds: [...s.plan!.factIds],
    }));
  const factIds = [
    ...ETIQUETTE.flatMap((e) => e.factIds),
    VISIT_FACT_IDS.hours,
    VISIT_FACT_IDS.address,
    ...places.flatMap((p) => p.factIds),
  ];
  return {
    messages,
    content,
    rules: ETIQUETTE.map((e) => ({ id: e.id, icon: e.icon, group: e.group, factIds: e.factIds })),
    verifiedAt: ETIQUETTE_VERIFIED_AT,
    places,
    aksara: aksara("sowan"),
    refs: buildRefs(factIds),
    meta: buildMeta({
      locale,
      path: "visit",
      title: t("visit:meta.title"),
      siteTitle: t("common:brand.siteTitle"),
      description: t("visit:meta.description"),
      ogImage: "visit",
    }),
  };
}

export function meta({ loaderData }: Route.MetaArgs) {
  return loaderData?.meta ?? [];
}

export default function Visit({ loaderData: d }: Route.ComponentProps) {
  const t = useT("visit");
  const locale = useLocale();
  const contentLang = d.content.lang !== locale ? d.content.lang : undefined;

  return (
    <>
      <PageHero variant="visit" eyebrow={t("header.eyebrow")} title={t("header.title")} aksara={d.aksara} folio="06" intro={t("header.intro")}>
        <p className={styles.heroActions}>
          <a href={OFFICIAL_TICKETS} className={styles.heroPrimary} rel="noopener">
            {t("official.tickets")} <ExternalLink aria-hidden="true" size={18} />
          </a>
          <a href="#official-title" className="arrow-link">
            {t("address.title")}
          </a>
        </p>
      </PageHero>

      {/* Official information first: hours and prices are not reproduced. */}
      <section className={`container ${styles.official}`} aria-labelledby="official-title">
        <div className={styles.officialCard}>
          <h2 id="official-title" className={styles.h2}>
            {t("official.title")}
          </h2>
          <p>
            {t("official.body")}
            <Refs factIds={[VISIT_FACT_IDS.hours]} byFact={d.refs.byFact} />
          </p>
          <div className={styles.actions}>
            <a href={OFFICIAL_TICKETS} className={styles.primary} rel="noopener">
              {t("official.tickets")} <ExternalLink aria-hidden="true" size={18} />
            </a>
            <a href={OFFICIAL_SITE} className={styles.secondary} rel="noopener">
              mangkunegaran.id <ExternalLink aria-hidden="true" size={18} />
            </a>
          </div>
        </div>
        <div className={styles.address}>
          <h2 className="eyebrow">{t("address.title")}</h2>
          <address lang="id">
            {ADDRESS_LINES.map((line, i) => (
              <span key={i} className={styles.addressLine}>
                {line}
              </span>
            ))}
            <Refs factIds={[VISIT_FACT_IDS.address]} byFact={d.refs.byFact} />
          </address>
          <a href={OFFICIAL_MAP} className="arrow-link" rel="noopener">
            <MapPin aria-hidden="true" size={18} /> {t("address.map")}
          </a>
        </div>
      </section>

      {/* Visitor guidance pictograms. */}
      <section className={`container section ${styles.rules}`} aria-labelledby="rules-title">
        <div className={styles.rulesHead}>
          <h2 id="rules-title" className={styles.h2}>
            {t("rules.title")}
          </h2>
          <p>{t("rules.intro")}</p>
          <p className={styles.verified}>
            {t("rules.verified", { date: d.verifiedAt })}{" "}
            <a href={OFFICIAL_TICKETS} className="text-link" rel="noopener">
              mangkunegaran.co.id/tiket
            </a>
          </p>
          <ul className={styles.keyList} aria-label={t("rules.keyLabel")}>
            <li>
              <Pictogram icon="no-smoking" size={32} /> {t("rules.keyProhibited")}
            </li>
            <li>
              <Pictogram icon="guide" size={32} /> {t("rules.keyGuidance")}
            </li>
          </ul>
        </div>
        {GROUPS.map((group) => {
          const items = d.rules.filter((r) => r.group === group);
          return (
            <div key={group} className={styles.group}>
              <h3 className={styles.groupTitle}>{t(`rules.groups.${group}`)}</h3>
              <ul className={styles.grid}>
                {items.map((r) => (
                  <li key={r.id} className={styles.rule}>
                    <Pictogram icon={r.icon} size={64} />
                    <p>
                      {t(`rules.items.${r.id}`)}
                      <Refs factIds={r.factIds} byFact={d.refs.byFact} />
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      {/* Interactive schematic plan. */}
      <section className={`${styles.planSection}`} aria-labelledby="plan-title">
        <div className="container">
          <div className={styles.planHead}>
            <h2 id="plan-title" className={styles.h2}>
              {t("plan.title")}
            </h2>
            <p>{t("plan.intro")}</p>
          </div>
          <SitePlan
            places={d.places}
            contentLang={contentLang}
            labels={{
              title: t("plan.title"),
              gate: t("plan.gate"),
              legend: t("plan.legend"),
              close: t("plan.close"),
              more: t("plan.more"),
              rules: t("plan.rules"),
              select: (name) => t("plan.select", { name }),
              disclaimer: t("plan.disclaimer"),
            }}
          />
        </div>
      </section>

      <div className="container">
        <SourceList sources={d.refs.sources} />
      </div>
    </>
  );
}
