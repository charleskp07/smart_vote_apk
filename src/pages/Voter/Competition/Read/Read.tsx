import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { VoterCompetitionApi } from "../../../../api/competitions/voter.api";
import type { candidate } from "../../../../data/models/candidate.model";
import type { competition } from "../../../../data/models/competition.model";
import Loader from "../../../../components/Loader/Loader";
import defaultImage from "../../../../assets/images/image-coming.webp";
import "./Read.css";

export default function Read() {
    const navigate = useNavigate();
    const params = useParams();

    const goToBack = () => navigate(-1);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [candidates, setCandidates] = useState<Array<candidate>>([]);

    const [id, setId] = useState<number>();
    const [name, setName] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [description, setDescription] = useState("");
    const [voteValue, setVoteValue] = useState<number>();
    const [image, setImage] = useState("");

    useEffect(() => {
        const fetchCompetition = async () => {
            if (params.id) {
                try {
                    setIsLoading(true);
                    const data: Array<competition> = await VoterCompetitionApi.read(
                        parseInt(params.id || "0", 10)
                    );

                    const competition = data[0];
                    setId(competition.id);
                    setName(competition.name);
                    setStartDate(competition.start_date);
                    setEndDate(competition.end_date);
                    setDescription(competition.description);
                    setVoteValue(competition.vote_value);
                    setImage(competition.image);
                    setCandidates(competition.candidates);
                } catch (error) {
                    console.log(error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchCompetition();
    }, [params]);

    const handleReadCandidate = (id: number) => {
        navigate(`/voter/candidates/${id}/read`);
    };

    if (isLoading) {
        return (
            <div className="loader-container">
                <Loader />
            </div>
        );
    }

    return (
        <div className="read-container">
            <button className="back-button" type="button" onClick={goToBack}>
                Retour
            </button>

            {/* Couverture */}
            <div className="header-image-container">
                <img
                    src={image ? `http://127.0.0.1:8000/storage/${image}` : defaultImage}
                    alt={name}
                    className="header-image"
                />
            </div>

            {/* Infos de la compétition */}
            <div className="competition-info">
                <h1 className="competition-title">{name}</h1>

                <p>
                    <b>Date de début :</b>{" "}
                    {new Date(startDate).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    })}
                </p>

                <p>
                    <b>Date de fin :</b>{" "}
                    {new Date(endDate).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    })}
                </p>

                <p>
                    <b>Description :</b>{" "}
                    {description || "Aucune description disponible"}
                </p>

                <p>
                    <b>Prix unitaire du vote :</b> {voteValue} FCFA
                </p>
            </div>

            {/* Liste des candidats */}
            <h2 className="candidates-title">Liste des candidats</h2>

            {candidates.length === 0 ? (
                <div className="empty-message">
                    Aucun candidat n'a été créé.
                </div>
            ) : (
                <div className="candidates-grid">
                    {candidates.map((candidate) => (
                        <div key={candidate.id} className="candidate-card">
                            <p>
                                <b>Nom : </b> {candidate.last_name}
                            </p>
                            <p>
                                <b>Prénoms : </b> {candidate.first_name}
                            </p>
                            <p>
                                <b>Date de naissance : </b>
                                {new Date(candidate.birth_date).toLocaleString("fr-FR", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                            <p>
                                <b>Nombre de votes :</b> {candidate.accumulated_vote}
                            </p>

                            <button
                                className="candidate-button"
                                onClick={() => handleReadCandidate(candidate.id)}
                            >
                                Voir les détails
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
