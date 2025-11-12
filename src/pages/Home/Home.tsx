import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { competition } from "../../data/models/competition.model";
import Loader from "../../components/Loader/Loader";
import { VoterCompetitionApi } from "../../api/competitions/voter.api";

export default function Home() {


  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [competitions, setCompetitions] = useState<Array<competition>>([]);


  const navigate = useNavigate();


  const fetchCompetitions = async () => {
    try {
      const data = await VoterCompetitionApi.getAll();
      setCompetitions(data);
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReadCompetiton = async (id: number) => {
    navigate(`voter/competitions/${id}/read`);
  }

  useEffect(() => {

    fetchCompetitions();

  }, []);

  return (
    <div>
      <h2> Home pages
        (Listes des competitions)</h2>


      {
        isLoading ?
          <Loader /> :
          <>
            {
              competitions.length === 0 ? (
                <div>
                  Aucune competition n'a été créé
                </div>
              ) : (
                competitions.map((competition, index) => {
                  return (
                    <div key={index}>
                      <div  onClick={() => handleReadCompetiton(competition.id)}>
                        <b>Nom :</b> {competition.name} <br />
                        <b>Date de debut :</b> {new Date(competition.start_date).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })} <br />
                        <b>Date de fin :</b> {new Date(competition.end_date).toLocaleString("fr-FR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })} <br />
                        <b>Description :</b> {competition.description ?? "Aucune description disponible"}<br />
                        <b>Prix unitaire du vote :</b> {competition.vote_value} FCFA <br />

                      </div>
                      <button type="button" onClick={() => handleReadCompetiton(competition.id)}>
                        Voir les candidats
                      </button>

                      <br /><br /><br />
                    </div>
                  )
                })
              )
            }
          </>
      }
      <div>
        <Link to="/login">Se connecter</Link>
      </div>



    </div>
  )
}
