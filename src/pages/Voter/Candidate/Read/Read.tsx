import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { VoterCandidateApi } from "../../../../api/candidates/voter.api";
import defaultAvatar from '../../../../assets/images/default-avatar.jpg';
import { GenderEnums } from "../../../../data/models/candidate.model";
import VoteModale from "../../../../components/Modale/Modale";
import Loader from "../../../../components/Loader/Loader"; // ✅ ton composant loader

export default function Read() {
    const navigate = useNavigate();
    const goToBack = () => {
        navigate(-1)
    }

    const params = useParams()

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [showModal, setShowModal] = useState(false);

    const [id, setId] = useState<number>()
    // const [competition_id, setCompetitionId] = useState<number>()
    const [photo, setPhoto] = useState<string | null>("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [gender, setGender] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [height, setHeight] = useState<number>()
    const [weight, setWeight] = useState<number>()
    const [nationality, setNationality] = useState("")
    const [description, setDescription] = useState("")
    const [accumulatedVote, setAccumulatedVote] = useState<number>()

    useEffect(() => {
        const fetchCandidate = async () => {
            if (params.id) {
                try {
                    setIsLoading(true)
                    const data = await VoterCandidateApi.read(parseInt(params.id || "0", 10));
                    setId(data.id)
                    // setCompetitionId(data.competition_id)
                    setPhoto(data.photo === "null" ? null : data.photo)
                    setLastName(data.last_name)
                    setFirstName(data.first_name)
                    setGender(data.gender)
                    setNationality(data.nationality)
                    setBirthDate(data.birth_date)
                    setWeight(data.weight)
                    setHeight(data.height)
                    setDescription(data.description)
                    setAccumulatedVote(data.accumulated_vote)

                    console.log(data)
                } catch (error) {
                    console.log(error)
                } finally {
                    setIsLoading(false)
                }
            }
        }
        fetchCandidate()

    }, [params]);

    const handleVote = () => {
        console.log("Vote soumis :");
    };

    const fullName = `${lastName} ${firstName}`;

    if (isLoading) {
        return (
            <div>
                <Loader />
            </div>
        )
    }

    return (
        <div>
            <button onClick={goToBack}>
                retour
            </button>
            <h1>Details {gender === GenderEnums.MASCULIN ? "du candidat" : "de la candidate"}  {firstName} {lastName} </h1>

            <img src={photo ? `http://127.0.0.1:8000/storage/${photo}` : defaultAvatar}
                alt={fullName}
                className="detail-photo" width="200" /> <br />

            <b>Nom :</b> {lastName} <br />
            <b>Prénoms :</b> {firstName} <br />
            <b>Sexe :</b> {gender === GenderEnums.MASCULIN ? "Masculin" : "Féminin"} <br />
            <b>Date de naissance</b>  {new Date(birthDate).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            })} , <br />
            <b>Taille :</b> {height} m<br />
            <b>Poids :</b> {weight} kg<br />
            <b>Nationalité :</b> {nationality} <br />
            <b>Description :</b> {description} <br />
            <b>Votes accumulés :</b> {accumulatedVote} votes <br />

            <button type="button" onClick={() => setShowModal(true)}>
                voter
            </button>

            <VoteModale
                show={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={handleVote}
                candidateId={id}
                candidateName={`${lastName} ${firstName}`}
            />
        </div>
    )
}
