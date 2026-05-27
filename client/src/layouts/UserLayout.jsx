import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const UserLayout = ({children}) => {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
};

export default UserLayout;