import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { VoterCandidateApi } from "../../../../api/candidates/voter.api";
import defaultAvatar from '../../../../assets/images/default-avatar.jpg';
import { GenderEnums } from "../../../../data/models/candidate.model";
import VoteModale from "../../../../components/Modale/Modale";
import Loader from "../../../../components/Loader/Loader";
import "./Read.css";

export default function Read() {
    const navigate = useNavigate();
    const params = useParams();

    const goToBack = () => navigate(-1);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showModal, setShowModal] = useState(false);

    const [id, setId] = useState<number>();
    const [photo, setPhoto] = useState<string | null>("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [height, setHeight] = useState<number>();
    const [weight, setWeight] = useState<number>();
    const [nationality, setNationality] = useState("");
    const [description, setDescription] = useState("");
    const [accumulatedVote, setAccumulatedVote] = useState<number>();

    useEffect(() => {
        const fetchCandidate = async () => {
            if (params.id) {
                try {
                    setIsLoading(true);
                    const data = await VoterCandidateApi.read(parseInt(params.id || "0", 10));

                    setId(data.id);
                    setPhoto(data.photo === "null" ? null : data.photo);
                    setLastName(data.last_name);
                    setFirstName(data.first_name);
                    setGender(data.gender);
                    setNationality(data.nationality);
                    setBirthDate(data.birth_date);
                    setWeight(data.weight);
                    setHeight(data.height);
                    setDescription(data.description);
                    setAccumulatedVote(data.accumulated_vote);
                } catch (error) {
                    console.log(error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchCandidate();
    }, [params]);

    const fullName = `${lastName} ${firstName}`;

    const voteCallBack = (state: boolean) => {
        if (state) {
            setShowModal(false);
        }
    };

    if (isLoading) {
        return (
            <div className="loader-container">
                <Loader />
            </div>
        );
    }

    return (
        <div className="candidate-container">
            <button className="back-button" onClick={goToBack}>
                Retour
            </button>

            {/* Photo */}
            <div className="candidate-photo-container">
                <img
                    src={photo ? `http://127.0.0.1:8000/storage/${photo}` : defaultAvatar}
                    alt={fullName}
                    className="candidate-photo"
                />
            </div>

            {/* Informations */}
            <h1 className="candidate-title">
                Détails {gender === GenderEnums.MASCULIN ? "du candidat" : "de la candidate"} {firstName} {lastName}
            </h1>

            <div className="candidate-info">
                <p><b>Nom :</b> {lastName}</p>
                <p><b>Prénoms :</b> {firstName}</p>
                <p><b>Sexe :</b> {gender === GenderEnums.MASCULIN ? "Masculin" : "Féminin"}</p>
                <p>
                    <b>Date de naissance :</b>{" "}
                    {new Date(birthDate).toLocaleString("fr-FR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    })}
                </p>
                <p><b>Taille :</b> {height} m</p>
                <p><b>Poids :</b> {weight} kg</p>
                <p><b>Nationalité :</b> {nationality}</p>
                <p><b>Description :</b> {description}</p>
                <p><b>Votes accumulés :</b> {accumulatedVote}</p>
            </div>

            {/* Bouton voter */}
            <button className="vote-button" onClick={() => setShowModal(true)}>
                Voter
            </button>

            <VoteModale
                voteCallBack={voteCallBack}
                show={showModal}
                onClose={() => setShowModal(false)}
                candidateId={id}
                candidateName={fullName}
            />
        </div>
    );
}
