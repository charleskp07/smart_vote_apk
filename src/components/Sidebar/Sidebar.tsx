import { Link } from 'react-router'
// import './Sidebar.css'

export default function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Admin</h2>
            </div>

            <ul className="sidebar-menu">
                <li>
                    <Link to="">Tableau de bord</Link>
                </li>
                <li>
                    <Link to="">Compétitions</Link>
                </li>
                <li>
                    <Link to="">Candidats</Link>
                </li>
                <li>
                    <Link to="">Profil</Link>
                </li>
            </ul>
        </aside>
    )
}
