import { Outlet } from "react-router";
import type { Route } from "./+types/locale-layout";
import { loadMessages } from "~/i18n/messages";
import { useT } from "~/i18n/useT";
import { requireLocale } from "~/lib/page";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { LanguageControl } from "~/components/LanguageControl";

export async function loader({ request }: Route.LoaderArgs) {
  const locale = requireLocale(request);
  return { locale, messages: await loadMessages(locale, ["common"]) };
}

export default function LocaleLayout() {
  const t = useT();
  return (
    <>
      <a className="skip-link" href="#main">
        {t("a11y.skip")}
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <LanguageControl />
    </>
  );
}
