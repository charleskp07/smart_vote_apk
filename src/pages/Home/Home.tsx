import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { competition } from "../../data/models/competition.model";
import Loader from "../../components/Loader/Loader";
import { VoterCompetitionApi } from "../../api/competitions/voter.api";
import defaultImage from '../../../src/assets/images/image-coming.webp';
import './Home.css'

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
    navigate(`/voter/competitions/${id}/read`);
  }

  useEffect(() => {

    fetchCompetitions();

  }, []);

  return (
    <div>
      <h1>Liste des competitions</h1>


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
                <div className="competitions-cover">
                  {competitions.map((competition, index) => {
                    return (
                      <div key={index}>
                        <div onClick={() => handleReadCompetiton(competition.id)} className="competition-cover">
                          <div>
                            <img src={competition.image ? `http://127.0.0.1:8000/storage/${competition.image}` : defaultImage}
                              alt={competition.name} width="200" />
                          </div>
                          <span>{competition.name}</span> <br />
                          <span><b>Du</b> {new Date(competition.start_date).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                            <b> au</b> {new Date(competition.end_date).toLocaleString("fr-FR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })} </span> <br />
                          <b>Prix unitaire du vote :</b> {competition.vote_value} FCFA


                          <br /><br />
                          <button type="button" onClick={() => handleReadCompetiton(competition.id)}>
                            Voir les candidats

                          </button>
                        </div>

                        <br /><br /><br />
                      </div>
                    )
                  })}
                </div>
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
