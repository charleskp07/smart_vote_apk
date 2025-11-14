import { Link, useNavigate } from 'react-router'
import './List.css'
import AdminSidebar from '../../../../components/AdminSidebar/AdminSidebar'
import { useEffect, useState } from 'react';
import type { user } from '../../../../data/models/user.model';
import { userApi } from '../../../../api/users/crud.api';
import Loader from '../../../../components/Loader/Loader';
import { toast, ToastContainer } from 'react-toastify';

export default function List() {


  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [users, setUsers] = useState<Array<user>>([]);

  const navigate = useNavigate();

  const goToBack = () => {
    navigate(-1)
  }

  const fetchUsers = async () => {
    try {
      const data = await userApi.getAll();
      setUsers(data);
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReadUser = async (id: number) => {

    navigate(`/admin/users/${id}/read`);

  }

  const handleEditUser = async (id: number) => {

    navigate(`/admin/users/${id}/edit`);

  }

  useEffect(() => {

    fetchUsers();

  }, []);

  const handleDestroyCandidate = async (id: number) => {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?");

    if (confirmed) {
      try {
        await userApi.destroy(id);
        fetchUsers();
        toast.success("Utilisateur supprimé avec succès")

      } catch (error) {
        console.log(error)
      }
    } else {
      alert("Suppression annulée !");
    }
  }

  return (
    <div>
      <AdminSidebar />
      <div className='wrap-content'>

        <ToastContainer />

        <button type="button" onClick={goToBack}>
          retour
        </button>

        <button>
          Corbeille
        </button>

        <div>
          <h1>Liste des utilisateurs</h1>
          <Link to="/admin/users/create">Ajouter un nouvel utilisateur</Link>
        </div>

        {
          isLoading ? (
            <Loader />
          ) : (
            <>
              {users.length === 0 ? (
                <span>Aucun utilisateur n'a été trouvé</span>
              ) : (
                <table className="table-users" style={{ width: "800px", }}>
                  <thead>
                    <tr>
                      <th >#</th>
                      <th >Nom complet</th>
                      <th >Téléphone</th>
                      <th >Email</th>
                      <th >Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user, index) => (
                      <tr key={index} style={{ borderBottom: "1px solid #ddd" }}>
                        <td onClick={() => handleReadUser(user.id)}>{index + 1}</td>
                        <td onClick={() => handleReadUser(user.id)}>{user.name}</td>
                        <td onClick={() => handleReadUser(user.id)}>{user.phone}</td>
                        <td onClick={() => handleReadUser(user.id)}>{user.email}</td>
                        <td>
                          <button
                            onClick={() => handleEditUser(user.id)}>
                            Modifier
                          </button>

                          <button
                            onClick={() => handleDestroyCandidate(user.id)} >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )
        }
      </div>
    </div>
  )
}
