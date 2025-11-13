import { Link } from 'react-router'
import './Sidebar.css'

export default function Sidebar() {
    return (
        <div className='sidebar'>
            <div>
                <ul>
                    <li>
                        <div>
                            <Link to="">Tableau de bord</Link>
                        </div>
                    </li>
                    <li>
                        <div>
                            <Link to="">Competitons</Link>
                        </div>
                    </li>
                    <li>
                        <div>
                            <Link to="">Candidats</Link>
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
