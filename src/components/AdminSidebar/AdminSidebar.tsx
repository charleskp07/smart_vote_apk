import { Link } from 'react-router'
import './AdminSidebar.css'

export default function AdminSidebar() {
    return (
        <div className='sidebar'>
            <div>
                <ul>
                    <li>
                        <div>
                            <Link to="/admin/dashboard">Tableau de bord</Link>
                        </div>
                    </li>
                    <li>
                        <div>
                            <Link to="/admin/competitions">Competitons</Link>
                        </div>
                    </li>
                    <li>
                        <div>
                            <Link to="/admin/candidates">Candidats</Link>
                        </div>
                    </li>
                    <li>
                        <div>
                            <Link to="/admin/users">Utilisateurs</Link>
                        </div>
                    </li>
                    <li>
                        <div>
                            <Link to="">Profile</Link>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    )
}
