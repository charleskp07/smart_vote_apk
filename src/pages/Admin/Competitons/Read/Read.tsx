import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import AdminSidebar from "../../../../components/AdminSidebar/AdminSidebar";
import { competitionApi } from "../../../../api/competitions/crud.api";
import type { competition } from "../../../../data/models/competition.model";
import Loader from "../../../../components/Loader/Loader";

export default function Read() {
    const navigate = useNavigate();
    const { id } = useParams();
    const goToBack = () => navigate(-1);

    const [competition, setCompetition] = useState<competition | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchCompetition = async () => {
        if (!id) return;

        try {
            setIsLoading(true);
            setError("");
            const competitionData = await competitionApi.read(Number(id));
            setCompetition(competitionData);
        } catch (error: any) {
            console.error("Erreur lors du chargement de la compétition:", error);
            setError("Impossible de charger les détails de la compétition");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCompetition();
    }, [id]);

    const handleEdit = () => {
        if (competition) {
            navigate(`/admin/competitions/${competition.id}/edit/`);
        }
    };

    const handleDelete = async () => {
        if (!competition || !window.confirm("Êtes-vous sûr de vouloir supprimer cette compétition ?")) {
            return;
        }

        try {
            await competitionApi.destroy(competition.id);
            navigate("/admin/competitions");
        } catch (error: any) {
            console.error("Erreur lors de la suppression:", error);
            setError("Erreur lors de la suppression de la compétition");
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            // hour: '2-digit',
            // minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div>
                <AdminSidebar />
                <div>
                    <div>
                        <Loader />
                        <div>Chargement des détails...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !competition) {
        return (
            <div>
                <AdminSidebar />
                <div>
                    <div>
                        <div>{error || "Compétition non trouvée"}</div>
                        <button onClick={goToBack}>
                            Retour
                        </button>
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
                        <button onClick={goToBack}>
                            Retour
                        </button>
                    </div>
                    <div>
                        <h1>Détails de la compétition</h1>
                    </div>

                </div>

                <div>
                    <div>
                        {competition.image && (
                            <div>
                                <img
                                    src={competition.image}
                                    alt={competition.name}
                                />
                            </div>
                        )}

                        <div>
                            <div>
                                <h2>name : {competition.name}</h2>
                                <div>Description : {competition.description}</div>
                            </div>

                            <div>
                                <div>
                                    {/* <h3>Informations de la compétition</h3> */}

                                    <div>
                                        <div>
                                            <div>Date de début : {formatDate(competition.start_date)}</div>
                                            <div></div>
                                        </div>

                                        <div>
                                            <div>Date de fin : {formatDate(competition.end_date)}</div>
                                            <div></div>
                                        </div>

                                        <div>
                                            <div>Valeur du vote : {competition.vote_value} XOF</div>
                                            <div></div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    {/* <h3>Candidats</h3> */}
                                    <div>
                                   Nombre de Candidats : {competition.candidates && competition.candidates.length > 0 ? (
                                            <div>
                                            Nombre de Candidats :     {competition.candidates.length} candidat(s) participent à cette compétition
                                            </div>
                                        ) : (
                                            <div>Aucun candidat pour le moment</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button onClick={handleEdit}>
                            Modifier
                        </button>
                        <button onClick={handleDelete}>
                            Supprimer
                        </button>
                    </div>
                    <div>
                        {/* <button onClick={goToBack}>
                            Retour à la liste
                        </button> */}
                        {/* <button onClick={handleEdit}>
                            Modifier la compétition
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
}