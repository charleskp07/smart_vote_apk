import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import type { competition } from "../../data/models/competition.model";
import Loader from "../../components/Loader/Loader";
import { VoterCompetitionApi } from "../../api/competitions/voter.api";
import defaultImage from '../../../src/assets/images/image-coming.webp';
import './Home.css';

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [competitions, setCompetitions] = useState<Array<competition>>([]);
  const navigate = useNavigate();

  const fetchCompetitions = async () => {
    try {
      const data = await VoterCompetitionApi.getAll();
      setCompetitions(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadCompetiton = (id: number) => {
    navigate(`/voter/competitions/${id}/read`);
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  return (
    <div className="home-container">
      <h1 className="home-title">Liste des compétitions</h1>

      {isLoading ? (
        <Loader />
      ) : (
        <>
          {competitions.length === 0 ? (
            <div className="empty-message">Aucune compétition n'a été créée.</div>
          ) : (
            <div className="competitions-grid">
              {competitions.map((competition) => (
                <div
                  key={competition.id}
                  className="competition-card"
                  onClick={() => handleReadCompetiton(competition.id)}
                >
                  <img
                    src={competition.image ? `http://127.0.0.1:8000/storage/${competition.image}` : defaultImage}
                    alt={competition.name}
                    className="competition-image"
                  />

                  <h2 className="competition-name">{competition.name}</h2>

                  <p className="competition-date">
                    Du {new Date(competition.start_date).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }) }
                     au {new Date(competition.end_date).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  <p className="competition-price">
                    Prix du vote : <b>{competition.vote_value} FCFA</b>
                  </p>

                  <button className="read-button">
                    Voir les candidats
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="login-link">
        <Link to="/login">Se connecter</Link>
      </div>
    </div>
  );
}
