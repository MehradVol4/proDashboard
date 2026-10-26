import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styled from "styled-components";
import ScrollToTopButton from "./ScrollToTopButton";
import Spinner from "./Spinner";
import { useSettings } from "../features/settings/useSettings";
import { setCurrencyConfig } from "../utils/helpers";
import { NotificationsProvider } from "../context/NotificationsContext";

const Main = styled.main.attrs({ id: "app-scroll" })`
    background-color: transparent;
    padding: var(--page-padding-y) var(--page-padding-x) 6.4rem;
    overflow: auto;
`;

const Container = styled.div.attrs({ className: "animate-fade-up" })`
    max-width: var(--content-max-width);
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 3.2rem;
` ;

const StyledAppLayout = styled.div`
    display: grid;
    grid-template-columns: 26rem 1fr;
    grid-template-rows: auto 1fr;
    height: 100vh;
    background-color: var(--color-grey-50);

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
      grid-template-rows: auto auto 1fr;
    }
`;

function AppLayout() {
    // Waiting for settings here means every price below is formatted with the
    // hotel's own currency on the very first render, instead of flashing the
    // default and correcting itself.
    const { settings, isPending, error } = useSettings();

    if (isPending) return <Spinner />;

    // A missing or unreadable settings row shouldn't lock staff out of the app;
    // the defaults in `helpers` take over.
    if (!error)
        setCurrencyConfig({
            currency: settings?.currency,
            locale: settings?.locale,
        });

    return (
        <NotificationsProvider>
            <StyledAppLayout>
                <Header />
                <Sidebar
                    hotelName={settings?.hotelName}
                    hotelLogoUrl={settings?.hotelLogoUrl}
                />

                <Main>
                    <Container>
                        <Outlet />
                    </Container>
                    <ScrollToTopButton />
                </Main>

            </StyledAppLayout>
        </NotificationsProvider>
    )
}

export default AppLayout
