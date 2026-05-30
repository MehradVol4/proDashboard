import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styled from "styled-components";
import ScrollToTopButton from "./ScrollToTopButton";

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
    return (
        <StyledAppLayout>
            <Header />
            <Sidebar />

            <Main>
                <Container>
                    <Outlet />
                </Container>
                <ScrollToTopButton />
            </Main>

        </StyledAppLayout>
    )
}

export default AppLayout
