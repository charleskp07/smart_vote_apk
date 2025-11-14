import { useNavigate, useParams } from 'react-router';
import './Edit.css'
import { useEffect, useState } from 'react';
import z from 'zod';
import { userApi } from '../../../../api/users/crud.api';
import { toast, ToastContainer } from 'react-toastify';
import Input from '../../../../components/Input/Input';
import AdminSidebar from '../../../../components/AdminSidebar/AdminSidebar';
import Loader from '../../../../components/Loader/Loader';

const userUpdateSchema = z.object({
  name: z
    .string("le nom complet est requis")
    .min(5, "le nom complet doit etre de 5 caractère au moins"),
  email: z
    .string("L'adresse e-mail est requise")
    .email("L'adresse e-mail doit être valide"),
  phone: z
    .string("Le numero de téléphone est requis")
    .min(8, "Le numero de téléphone doit contenir au moins 8 caractères"),
})

export default function Edit() {

  const navigate = useNavigate();
  const goToBack = () => {
    navigate(-1)
  }

  const params = useParams()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; global?: string }>({});

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = userUpdateSchema.safeParse({ name, email, phone, });

    if (!validation.success) {
      const fieldErrors: { name?: string; email?: string; phone?: string; } = {};
      validation.error.issues.forEach((err) => {
        const fieldName = err.path[0] as "name" | "email" | "phone";
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setIsLoading(true)
      const formData = new FormData();
      formData.set("name", name.trim());
      formData.set("email", email.trim());
      formData.set("phone", phone.trim());

      await userApi.update(parseInt(params.id || "0", 10), formData)

      toast.success("Utilisateur mise à jour avec succès")

    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }


  useEffect(() => {
    const fetchUser = async () => {
      if (params.id) {
        try {
          const data = await userApi.read(parseInt(params.id || "0", 10));

          setName(data.name || "")
          setEmail(data.email || "")
          setPhone(data.phone || "")

        } catch (error) {
          console.log(error)
        } finally {
          setIsLoading(false)
        }
      }
    }
    fetchUser()

  }, [params]);


  return (
    <div>
      <AdminSidebar />

      <ToastContainer />

      <button type="button" onClick={goToBack}>
        retour
      </button>

      <div>
        <h1>Modifier un utilisateur</h1>
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


          <button type="submit" disabled={isLoading}>
            {isLoading ? <Loader /> : <span>Mettre à jour</span>}
          </button>
        </form>
      </div>

    </div>
  )
}
