import './Modale.css'

type VoteModaleProps = {
    show: boolean;
    onClose: () => void;
    onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    candidateId?: number; 
    candidateName : string;
};

export default function VoteModale({ show, onClose, onSubmit, candidateId, candidateName }: VoteModaleProps) {
    if (!show) return null;

    return (
        <div className="div-parent" onClick={onClose}>
            <div className='modal-content' onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} >
                    Fermer
                </button>

                <h3>Voter pour {candidateName ?? "Inconnu"}</h3>

                <form onSubmit={onSubmit}>

                    <input type="hidden" name="candidate_id" value={candidateId} />



                    <div >
                        <label>Nom complet</label><br />
                        <input type="text" name="full_name"  />
                    </div>

                    <div >
                        <label>N° de Téléphone</label><br />
                        <input type="text" name="phone_number" placeholder="Ex: +228XXXXXXXX" />
                    </div>

                    <div >
                        <label>Nombre de votes souhaité</label><br />
                        <input type="number" name="vote_number" min="1" />
                    </div>

                    <button type="submit">
                        Valider
                    </button>
                </form>
            </div>
        </div>
    );
}
