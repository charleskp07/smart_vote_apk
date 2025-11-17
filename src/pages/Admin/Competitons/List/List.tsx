import { Link } from "react-router";
import { useState, useEffect } from "react";
import AdminSidebar from "../../../../components/AdminSidebar/AdminSidebar";
import { competitionApi } from "../../../../api/competitions/crud.api";
import type { competition } from "../../../../data/models/competition.model";
import Loader from "../../../../components/Loader/Loader";
import defaultImage from '../../../../assets/images/default-avatar.jpg';

export default function List() {
  const [competitions, setCompetitions] = useState<competition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);

  const fetchCompetitions = async () => {
    try {
      setIsLoading(true);
      const competitionsData = await competitionApi.getAll();
      console.log("Données reçues:", competitionsData);
      setCompetitions(competitionsData || []);
    } catch (error) {
      console.error("Erreur lors du chargement des compétitions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette compétition ?")) {
      return;
    }

    try {
      setDeleteLoading(id);
      await competitionApi.destroy(id);
      await fetchCompetitions();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

 

  if (isLoading) {
    return (
      <div>
        <AdminSidebar />
        <div>
          <div>
            <Loader />
            <div>Chargement des compétitions...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminSidebar />
      <div>
        <div>
          <div>
            <h1>Liste des compétitions</h1>
            <Link to="/admin/competitions/create">
              + Ajouter une compétition
            </Link>
          </div>
        </div>

        <div>
          {competitions.length === 0 ? (
            <div>
              <div>Aucune compétition trouvée</div>
              <Link to="/admin/competitions/create">
                Créer la première compétition
              </Link>
            </div>
          ) : (
            <div>
              {competitions.map((competition) => {
                

                return (
                  <div key={competition.id}>
                    <div>
                      {competition.image && (
                        <img src={competition.image ? `http://127.0.0.1:8000/storage/${competition.image}` : defaultImage}
                          alt={competition.name} />


                      )}

                      <div>
                        <div>
                          <div>
                            <h3>Name : {competition.name}</h3>
                            
                          </div>
                        </div>

                        <div>
                          Description :  {competition.description.length > 200
                            ? `${competition.description.substring(0, 200)}...`
                            : competition.description
                          }
                        </div>

                        <div>
                          <div>
                            <div>Date de début: {formatDate(competition.start_date)}</div>
                          </div>
                          <div>
                            <div>Date de fin: {formatDate(competition.end_date)}</div>
                          </div>
                          <div>
                            
                          </div>
                          <div>
                            
                          </div>
                        </div>

                        <div>
                          <Link to={`/admin/competitions/${competition.id}/read`}>
                            Plus de détails
                          </Link>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}