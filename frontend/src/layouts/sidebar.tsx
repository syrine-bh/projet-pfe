import { useAuthUser } from "react-auth-kit";
import { Link, useLocation } from "react-router-dom";

const navigation = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: "bx bx-home-circle",
        access: ["ROLE_MEMBRE", "ROLE_GESTIONNAIRE", "ROLE_CLIENT", "ROLE_ADMIN"]
    },

    {
        title: "Search",
        href: "/search",
        icon: "bx bx-search",
        access: ["ROLE_MEMBRE", "ROLE_GESTIONNAIRE", "ROLE_CLIENT", "ROLE_ADMIN"]
    },
    {
        title: "Users",
        href: "/users",
        icon: "bx bx-user",
        access: ["ROLE_ADMIN"]
    },
    {
        title: "projects",
        href: "/projects",
        icon: "bx bx-briefcase",
        access: ["ROLE_MEMBRE", "ROLE_GESTIONNAIRE", "ROLE_CLIENT", "ROLE_ADMIN"]
    },
];

function Sidebar() {
    let location = useLocation();
    let auth = useAuthUser();

    const handleMenu = () => {
        window.Helpers.toggleCollapsed();
    }

    //     const showMenu = () => {
    //         //layout-menu-hover
    //         document.getElementById("html-doc")?.classList.add('layout-menu-hover')
    //     }
    //    const hideMenu =  () => {
    //     document.getElementById("html-doc")?.classList.remove('layout-menu-hover')
    //    }

    return (
        <aside /*onMouseEnter={showMenu} onMouseLeave={hideMenu}*/ id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
            <div className="app-brand demo">
                <a href="index.html" className="app-brand-link">
                    <span className="app-brand-logo demo">
                        <img width={50} src="/assets/img/logo.jpg" alt="logo" />
                    </span>
                    <span className="app-brand-text demo menu-text fw-bolder ms-2 " style={{ fontSize: "1.2rem", textTransform: 'capitalize' }}> Client Feedback</span>
                </a>

                <div style={{ cursor: "pointer" }} onClick={handleMenu} className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
                    <i className="bx bx-chevron-left bx-sm align-middle"></i>
                </div>
            </div>

            <div className="menu-inner-shadow"></div>

            <ul className="menu-inner py-1">
                {navigation.map((navi, index) => {
                    return (
                        navi.access.includes(auth()!.roles[0]) &&
                        <li key={index} className={
                            location.pathname === navi.href
                                ? "menu-item active"
                                : "menu-item"
                        }>
                            <Link to={navi.href} className="menu-link">
                                <i className={`menu-icon tf-icons ${navi.icon}`}></i>
                                <div data-i18n="Analytics">{navi.title}</div>
                            </Link>
                        </li>)
                })}



            </ul>
        </aside>
    )
}

export default Sidebar
//yboucli aal item de navigation (navi)bel map 