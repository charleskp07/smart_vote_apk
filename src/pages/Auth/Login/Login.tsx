import { Fragment } from "react/jsx-runtime";
import Input from "../../../components/Input/Input";
import { useState } from "react";
import { useNavigate } from "react-router";
import { authenticationApi } from "../../../api/users/authentication.api";
import Loader from "../../../components/Loader/Loader";
import z from "zod";

const loginSchema = z.object({
  email: z
    .string("L'adresse e-mail est requise")
    .email("L'adresse e-mail doit être valide"),
  password: z
    .string("Le mot de passe est requis")
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export default function Login() {

  const goToBack = () => navigate(-1);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [errors, setErrors] = useState<{ email?: string; password?: string; global?: string }>({});

  const OnEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setErrors((prev) => ({ ...prev, email: undefined, global: undefined }));
  }

  const OnPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setErrors((prev) => ({ ...prev, password: undefined, global: undefined }));
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = loginSchema.safeParse({ email, password });

    if (!validation.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      validation.error.issues.forEach((err) => {
        const fieldName = err.path[0] as "email" | "password";
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.set("email", email.trim())
      formData.set("password", password.trim())

      const result = await authenticationApi.login(formData);
      if (result.success) {
        navigate("/two-factor", { state: { email } });
      } else {
        setErrors({ global: "Identifiants incorrects" });
      }

    } catch (error) {
      console.log(error)
      const backendError = "E-mail ou mot de passe incorrects, veuillez réessayer.";
      setErrors({ global: backendError });
    } finally {
      setIsLoading(false);
    }

  }


  return (
    <div className="">
      <Fragment >
        <div className="contenair">
          <button type="button" className="btn btn--ghost" onClick={goToBack}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12 10.5 4.5M3 12h18" />
            </svg>
            Retour
          </button>
          <h1>Se connecter</h1>

          {errors.global && (
            <div style={{ color: "red", marginBottom: "10px", fontSize: "0.9em" }}>
              {errors.global}
            </div>
          )}

          <form onSubmit={handleSubmit} method="post">

            <div>
              <Input label='Adresse e-mail' reference='email' type='email' placeholder='Saisir votre email' onChange={OnEmailChange} value={email} />
              {errors.email && (
                <p className="error-text" style={{ color: "red", fontSize: "0.9em" }}>
                  {errors.email}
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

            <button type="submit" disabled={isLoading} >
              {isLoading ? <Loader /> : <span>se connecter</span>}
            </button>

          </form>

        </div>
      </Fragment>

    </div >
  )
}
