import { Link } from "react-router";
import AdminSidebar from "../../../../components/AdminSidebar/AdminSidebar";


export default function List() {
  return (
    <div>
      <AdminSidebar />
      <div>
        <h1>Liste des compétitions</h1>
        <Link to="/admin/competitions/create">Ajouter une compétition</Link>
      </div>
    </div>
  )
}
