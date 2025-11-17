import './Modale.css'
import Loader from '../Loader/Loader';
import z from 'zod';
import { useState } from 'react';
import { VoteApi } from '../../api/votes/vote';


type VoteModaleProps = {
    show: boolean;
    onClose: () => void;
    candidateId?: number;
    candidateName: string;
    errors?: Record<string, string>;
    voteCallBack: (state: boolean) => void;
};

const voteSchema = z.object({
    candidate_id: z.string("Le candidat est requis").nonempty("ID du candidat manquant"),
    full_name: z.string("Le nom complet est requis").min(3, "Le nom complet doit contenir au moins 3 caractères"),
    phone_number: z.string("Le numéro de téléphone est requis").min(8, "Numéro de téléphone invalide"),
    vote_number: z.string("Le nombre de vote est requis").refine(val => parseInt(val) > 0, {
        message: "Le nombre de votes doit être au moins 1"
    }),
});

export default function VoteModale({ show, onClose, candidateId, candidateName, voteCallBack }: VoteModaleProps) {

    const [isLoading, setIsLoading] = useState(false);

    const [fullName, setFullName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [voteNumber, setVoteNumber] = useState("");

    const [errors, setErrors] = useState<{
        candidate_id?: string;
        full_name?: string;
        phone_number?: string;
        vote_number?: string;
        global?: string;
    }>({});

    const handleVote = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const validation = voteSchema.safeParse({
            candidate_id: String(candidateId),
            full_name: fullName,
            phone_number: phoneNumber,
            vote_number: voteNumber
        });

        if (!validation.success) {
            const fieldErrors: {
                candidate_id?: string;
                full_name?: string;
                phone_number?: string;
                vote_number?: string;
            } = {};

            validation.error.issues.forEach((err) => {
                const fieldName = err.path[0] as keyof typeof fieldErrors;
                fieldErrors[fieldName] = err.message;
            });

            setErrors(fieldErrors);
            return;
        }

        try {
            setIsLoading(true);

            const formData = new FormData();


            formData.set("candidate_id", String(candidateId));
            formData.set("full_name", fullName.trim());
            formData.set("phone_number", phoneNumber.trim());
            formData.set("vote_number", voteNumber.trim());

            const response = await VoteApi.createVote(formData);


            const paymentUrl = response.payment_url;

            console.log("Payment URL:", paymentUrl);

            window.location.href = paymentUrl;

            // console.log(response);

            voteCallBack(true);

        } catch (error) {
            console.error(error);
            setErrors({ global: "Une erreur est survenue lors de l'envoi." });
        } finally {
            setIsLoading(false);
        }
    };

    if (!show) return null;

    return (
        <div className="div-parent" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                <button onClick={onClose} className="close-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    Fermer
                </button>

                <h2 className="text-center">Voter pour {candidateName ?? "Inconnu"}</h2>

                {errors.global && (
                    <p style={{ color: "red", textAlign: "center" }}>{errors.global}</p>
                )}

                <form onSubmit={handleVote}>

                    <input type="hidden" name="candidate_id" value={candidateId} />

                    <div className="input-cover">
                        <label>Nom complet</label><br />
                        <input
                            type="text"
                            name="full_name"
                            value={fullName}
                            onChange={(e) => {
                                setFullName(e.target.value);
                                setErrors((prev) => ({ ...prev, full_name: undefined }));
                            }}
                        />
                        {errors.full_name && (
                            <p className="error-text" style={{ color: "red" }}>{errors.full_name}</p>
                        )}
                    </div>

                    <br />
                    <div className="input-cover">
                        <label>N° de Téléphone</label><br />
                        <input
                            type="text"
                            name="phone_number"
                            placeholder="Ex: +228XXXXXXXX"
                            value={phoneNumber}
                            onChange={(e) => {
                                setPhoneNumber(e.target.value);
                                setErrors((prev) => ({ ...prev, phone_number: undefined }));
                            }}
                        />
                        {errors.phone_number && (
                            <p className="error-text" style={{ color: "red" }}>{errors.phone_number}</p>
                        )}
                    </div>

                    <br />
                    <div className="input-cover">
                        <label>Nombre de votes souhaité</label><br />
                        <input
                            type="number"
                            name="vote_number"
                            min="1"
                            value={voteNumber}
                            onChange={(e) => {
                                setVoteNumber(e.target.value);
                                setErrors((prev) => ({ ...prev, vote_number: undefined }));
                            }}
                        />
                        {errors.vote_number && (
                            <p className="error-text" style={{ color: "red" }}>{errors.vote_number}</p>
                        )}
                    </div>
                    <br />
                    <button type="submit" className="full-width primary-button">
                        {isLoading ? <Loader /> : "Valider"}
                    </button>

                </form>
            </div>
        </div>
    );
}
