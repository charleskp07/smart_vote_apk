import { Fragment } from "react/jsx-runtime";
import Input from "../../../components/Input/Input";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { authenticationApi } from "../../../api/users/authentication.api";


export default function Login() {

  const goToBack = () => navigate(-1);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")


  const OnEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const OnPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.set("email", email.trim())
      formData.set("password", password.trim())

      const result = await authenticationApi.login(formData);
      if (result.success) {
        navigate("/two-factor", { state: { email } });
      } else {
        console.log("echec")
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false);
    }

  }


  return (
    <div className="">
      <Fragment >
        <Link to="/">Home</Link>
        <div className="contenair">

          <button type="button" className="btn btn--ghost" onClick={goToBack}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12 10.5 4.5M3 12h18" />
            </svg>
            Retour
          </button>
          <h1>Se connecter</h1>
          <form onSubmit={handleSubmit} method="post">

            <Input label='Adresse e-mail' reference='email' type='email' placeholder='Saisir votre email' onChange={OnEmailChange} value={email} />
            <Input label='Mot de passe' reference='password' type='password' placeholder='Saisir votre mot de passe' onChange={OnPasswordChange} value={password} />


            <button type="submit">Se connecter</button>

          </form>

        </div>
      </Fragment>

    </div >
  )
}
