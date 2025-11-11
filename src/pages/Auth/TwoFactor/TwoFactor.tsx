import { Fragment } from "react/jsx-runtime";
import Input from "../../../components/Input/Input";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { authenticationApi } from "../../../api/users/authentication.api";
import { RoleEnums } from "../../../data/models/user.model";



export default function TwoFactor() {

  const navigate = useNavigate();

  // const [isLoading, setIsLoading] = useState<boolean>(false)

  const location = useLocation();
  const email = location.state?.email
  const [code, setCode] = useState("")


  const OnCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.set("email", email.trim())
      formData.set("code", code.trim())

      const result = await authenticationApi.twoFactor(formData);

      if (result.success) {

        console.log('success')
        localStorage.setItem("auth_token", result.token);

        if (result.user.role === RoleEnums.SYSTEME_ADMIN) {

          navigate("/dashboard"); 

        } else if (result.user.role === RoleEnums.ADMIN) {

          navigate("/organizer-dashboard"); 

        } else {

          console.log("Rôle inconnu");
          navigate("/"); 
          
        }
      } else {
        console.log("echec")
      }
    } catch (error) {
      console.log(error)
    } finally {
      // setIsLoading(false);
    }

  }

  return (

    <Fragment >
      <div className="contenair">

        <h1>Verification de code</h1>
        <form onSubmit={handleSubmit} method="post">

          <Input label="Code de verfication" reference='code' type='text' placeholder="Saisir le code de confirmation ici ..." onChange={OnCodeChange} value={code} />

          <button type="submit">Verifier</button>

        </form>

      </div>
    </Fragment>

  )
}
