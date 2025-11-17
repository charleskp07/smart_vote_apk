
import { useNavigate, useParams } from "react-router";
import AdminSidebar from "../../../../components/AdminSidebar/AdminSidebar"
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { competitionApi } from "../../../../api/competitions/crud.api";
import Input from "../../../../components/Input/Input";
import Loader from "../../../../components/Loader/Loader";

type Errors = Partial<Record<
    | "image"
    | "name"
    | "description"
    | "start_date"
    | "end_date"
    | "vote_value"
    | "_form",
    string
>>;

export default function Edit() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const goToBack = () => navigate(-1);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [voteValue, setVoteValue] = useState("");
    const [image, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [errors, setErrors] = useState<Errors>({});

    // Charger les données de la compétition
    useEffect(() => {
        const fetchCompetition = async () => {
            if (!id) {
                toast.error("ID de compétition manquant");
                navigate(-1);
                return;
            }

            try {
                setIsLoadingData(true);
                const competitionId = parseInt(id);
                const competition = await competitionApi.read(competitionId);
                
                setName(competition.name);
                setDescription(competition.description);
                setStartDate(competition.start_date.split('T')[0]);
                setEndDate(competition.end_date.split('T')[0]);
                setVoteValue(competition.vote_value.toString());
                
                if (competition.image) {
                    setImagePreview(competition.image);
                }
            } catch (error) {
                console.error(error);
                toast.error("Erreur lors du chargement de la compétition");
                navigate(-1);
            } finally {
                setIsLoadingData(false);
            }
        };

        fetchCompetition();
    }, [id, navigate]);

    const isPastDate = (value: string) => {
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return false;
        const today = new Date();
        const dUTC = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
        const tUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
        return dUTC <= tUTC;
    };

    const validate = (): Errors => {
        const e: Errors = {};
        if (!name.trim()) e.name = "Nom est obligatoire.";
        if (!startDate) e.start_date = "Date de début de la compétition ou de l'evenement obligatoire.";
        if (!endDate) e.end_date = "Date de cloture de la compétition ou de l'evenement obligatoire.";
        else if (isPastDate(endDate)) e.end_date = "Date de cloture de la compétition ou de l'evenement doit être valide et future.";

        const v = Number(voteValue);
        if (!voteValue) e.vote_value = "Poids obligatoire.";
        else if (Number.isNaN(v)) e.vote_value = "Poids invalide.";
        else if (v < 100 || v > 1000) e.vote_value = "La valeur d'un vote doit etre entre 100 XOF et 1000 XOF .";

        if (description.trim().length > 1000) {
            e.description = "La description doit être entre 0 et 1000 caractères).";
        }

        if (image) {
            const allowed = ["image/png", "image/jpeg", "image/jpg"];
            if (!allowed.includes(image.type)) {
                e.image = "Format accepté: PNG ou JPG/JPEG.";
            }
            const sizeMB = image.size / (1024 * 1024);
            if (sizeMB > 5) e.image = "Taille max 5 Mo.";
        }

        return e;
    };

    const OnImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setImageFile(file);

        setErrors(prev => ({ ...prev, image: undefined }));

        if (file) {
            const allowed = ["image/png", "image/jpeg", "image/jpg"];
            if (!allowed.includes(file.type)) {
                setErrors(prev => ({ ...prev, image: "Format accepté: PNG ou JPG/JPEG." }));
                setImagePreview(null);
                return;
            }
            const sizeMB = file.size / (1024 * 1024);
            if (sizeMB > 5) {
                setErrors(prev => ({ ...prev, image: "Taille max 5 Mo." }));
                setImagePreview(null);
                return;
            }
            const url = URL.createObjectURL(file);
            setImagePreview(url);
        } else {
            setImagePreview(null);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({});

        const e = validate();
        if (Object.keys(e).length > 0) {
            setErrors(e);
            return;
        }

        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.set("name", name.trim());
            formData.set("description", description.trim());
            formData.set("start_date", startDate);
            formData.set("end_date", endDate);
            formData.set("vote_value", String(Number(voteValue)));

            if (image) {
                formData.append("image", image);
            }

            if (!id) {
                throw new Error("ID de compétition manquant");
            }

            // NOTE: Vous devez ajouter la méthode update dans votre API
            const competitionId = parseInt(id);
            await competitionApi.create(formData); // À remplacer par update

            toast.success("Compétition ou évenement modifié avec succès");

            // Reset
            setName("");
            setDescription("");
            setStartDate("");
            setEndDate("");
            setImageFile(null);
            setVoteValue("");
            setImagePreview(null);

        } catch (error) {
            console.error(error);
            setErrors({ _form: "Une erreur est survenue lors de la modification." });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoadingData) {
        return (
            <div>
                <AdminSidebar />
                <div className="loading-container">
                    <Loader />
                    <p>Chargement de la compétition...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <AdminSidebar />

            <ToastContainer />
            <div>
                <h1>Modifier la compétition</h1>
            </div>

            <div>
                {errors._form && <div className="">{errors._form}</div>}

                <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>

                    <div>
                        <Input
                            label="Nom de la competition ou évenement"
                            reference="name"
                            type="text"
                            placeholder="Saisir le nom de la competition ou évenement ici..."
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setName(e.target.value);
                                if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                            }}
                            value={name}
                        />
                        {errors.name && <p className="field-error">{errors.name}</p>}
                    </div>

                    <br />
                    <div>
                        <Input
                            label="Date de début"
                            reference="start_date"
                            type="date"
                            placeholder=""
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setStartDate(e.target.value);
                                if (errors.start_date) setErrors(prev => ({ ...prev, start_date: undefined }));
                            }}
                            value={startDate}
                        />
                        {errors.start_date && <p className="field-error">{errors.start_date}</p>}
                    </div>

                    <br />
                    <div>
                        <Input
                            label="Date de clôture"
                            reference="end_date"
                            type="date"
                            placeholder=""
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setEndDate(e.target.value);
                                if (errors.end_date) setErrors(prev => ({ ...prev, end_date: undefined }));
                            }}
                            value={endDate}
                        />
                        {errors.end_date && <p className="field-error">{errors.end_date}</p>}
                    </div>

                    <br />
                    <div>
                        <Input
                            label="Valeur d'un vote (XOF)"
                            reference="voteValue"
                            type="number"
                            placeholder="ex: 200 XOF"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setVoteValue(e.target.value);
                                if (errors.vote_value) setErrors(prev => ({ ...prev, vote_value: undefined }));
                            }}
                            value={voteValue}
                        />
                        {errors.vote_value && <p className="field-error">{errors.vote_value}</p>}
                        <span className="help-text">Prix plausible: 100 et 1000 XOF.</span>
                    </div>

                    <br />

                    <div>
                        <label className="field-label" htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            className={errors.description ? "field-invalid" : ""}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
                            }}
                            value={description}
                        />
                        {errors.description && <p className="field-error">{errors.description}</p>}
                    </div>

                    <br />

                    <label className="field-label" htmlFor="image">Image de couverture</label>
                    <div className="file-row">
                        <input
                            id="image"
                            name="image"
                            type="file"
                            accept="image/png,image/jpg,image/jpeg"
                            onChange={OnImageChange}
                        />
                        {imagePreview && (
                            <img className="file-preview" src={imagePreview} alt="Aperçu"  />
                        )}
                    </div>
                    {errors.image && <p className="field-error">{errors.image}</p>}
                    <span className="help-text">PNG ou JPG/JPEG, 5 Mo max.</span>

                    <div>
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? <Loader /> : <span>Modifier</span>}
                        </button>

                        <button type="button" onClick={goToBack}>
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}