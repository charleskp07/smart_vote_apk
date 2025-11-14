import z from 'zod'
import AdminSidebar from '../../../../components/AdminSidebar/AdminSidebar'
import './Create.css'
import { useNavigate } from 'react-router'
import { useState } from 'react'
import { userApi } from '../../../../api/users/crud.api'
import { toast, ToastContainer } from 'react-toastify'
import Input from '../../../../components/Input/Input'
import Loader from '../../../../components/Loader/Loader'

const userCreateSchema = z.object({
  name: z
    .string("le nom complet est requis")
    .min(5, "le nom complet doit etre de 5 caractère au moins"),

  email: z
    .string("L'adresse e-mail est requise")
    .email("L'adresse e-mail doit être valide"),
  phone: z
    .string("Le numero de téléphone est requis")
    .min(8, "Le numero de téléphone doit contenir au moins 8 caractères"),
  password: z
    .string("Le mot de passe est requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
})

export default function Create() {

  const navigate = useNavigate();
  const goToBack = () => navigate(-1);

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")


  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; password?: string; global?: string }>({});

  const OnNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setErrors((prev) => ({ ...prev, name: undefined, global: undefined }));
  }
  const OnEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setErrors((prev) => ({ ...prev, email: undefined, global: undefined }));
  }
  const OnPhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(event.target.value);
    setErrors((prev) => ({ ...prev, phone: undefined, global: undefined }));
  }

  const OnPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setErrors((prev) => ({ ...prev, password: undefined, global: undefined }));
  }


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = userCreateSchema.safeParse({ name, email, phone, password });

    if (!validation.success) {
      const fieldErrors: { name?: string; email?: string; phone?: string; password?: string } = {};
      validation.error.issues.forEach((err) => {
        const fieldName = err.path[0] as "name" | "email" | "phone" | "password";
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.set("name", name.trim());
      formData.set("email", email.trim());
      formData.set("phone", phone.trim());
      formData.set("password", password.trim());


      await userApi.create(formData);

      toast.success("Ajouter avec succès")

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");

    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }

  }


  return (
    <div>
      <AdminSidebar />

      <ToastContainer />

      <button type="button" onClick={goToBack}>
        retour
      </button>
      <div>
        <h1>Ajouter un utilisateur</h1>
      </div>

      <div>
        <form onSubmit={handleSubmit} method="post">

          <div>
            <Input label='Nom complet' reference='name' type='text' placeholder='Saisir le nom complet ici ' value={name} onChange={OnNameChange} />
            {errors.name && (
              <p className="error-text" style={{ color: "red", fontSize: "0.9em" }}>
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <Input label='Adresse e-mail' reference='email' type='email' placeholder='Saisir votre email' onChange={OnEmailChange} value={email} />
            {errors.email && (
              <p className="error-text" style={{ color: "red", fontSize: "0.9em" }}>
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <Input label='Numéro de téléphone' reference='phone' type='text' placeholder='Ex : +228 90 XX XX XX' value={phone} onChange={OnPhoneChange} />
            {errors.phone && (
              <p className="error-text" style={{ color: "red", fontSize: "0.9em" }}>
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <Input label='Mot de passe' reference='password' type='password' placeholder='Saisir votre mot de passe' onChange={OnPasswordChange} value={password} />
            {errors.password && (
              <p className="error-text" style={{ color: "red", fontSize: "0.9em" }}>
                {errors.password}
              </p>
            )}
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? <Loader /> : <span>Créer</span>}
          </button>
        </form>
      </div>

    </div>
  )
}
