import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { VoterCompetitionApi } from "../../../../api/competitions/voter.api";
import type { candidate } from "../../../../data/models/candidate.model";
import type { competition } from "../../../../data/models/competition.model";
import Loader from "../../../../components/Loader/Loader";



export default function Read() {
    const navigate = useNavigate();
    const goToBack = () => {
        navigate(-1)
    }

    const params = useParams()

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [candidates, setCandidates] = useState<Array<candidate>>([]);


    const [id, setId] = useState<number>()
    const [name, setName] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [description, setDescription] = useState("")
    const [voteValue, setVoteValue] = useState<number>()


    useEffect(() => {
        const fetchCompetition = async () => {
            if (params.id) {
                try {
                    setIsLoading(true)
                    const data: Array<competition> = await VoterCompetitionApi.read(parseInt(params.id || "0", 10));
                    setId(data[0].id)
                    setName(data[0].name)
                    setStartDate(data[0].start_date)
                    setEndDate(data[0].end_date)
                    setDescription(data[0].description)
                    setVoteValue(data[0].vote_value)
                    setCandidates(data[0].candidates)
                    console.log(data)
                } catch (error) {
                    console.log(error)
                } finally {
                    setIsLoading(false)
                }
            }
        }
        fetchCompetition()
    }, [params]);


    const handleReadCandidate = async (id: number) => {
        navigate(`/voter/candidates/${id}/read`);
    }

    if (isLoading) {
        return (
            <div>
                <Loader />
            </div>
        )
    }


    return (
        <div>
            <button type="button" onClick={goToBack}>
                retour
            </button>
            <h1> {name} </h1>
            <b>Nom :</b> {name} <br />
            <b>Date de debut :</b> {new Date(startDate).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })} <br />
            <b>Date de fin :</b> {new Date(endDate).toLocaleString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })} <br />
            <b>Description :</b> {description ?? "Aucune description disponible"}<br />
            <b>Prix unitaire du vote :</b> {voteValue} FCFA <br />


            <h2>Liste des candidates</h2>

            {

                candidates.length === 0 ? (
                    <div>
                        Aucun candidat n'a été créé
                    </div>
                ) : (

                    candidates.map((candidate, index) => {
                        return (
                            <div key={index}>
                                <b>Nom</b> {candidate.last_name}, <br />
                                <b>Prénoms</b> {candidate.first_name}, <br />
                                <b>Date de naissance</b>  {new Date(candidate.birth_date).toLocaleString("fr-FR", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })} , <br />
                                <b>Nombre de vote : </b>{candidate.accumulated_vote} Votes
                                <br />
                                <button type="button" onClick={() => handleReadCandidate(candidate.id)}>
                                    Voir les details du candidat
                                </button>
                            </div>
                        )
                    })
                )
            }




        </div>
    )
}
