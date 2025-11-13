import { Fragment } from "react/jsx-runtime";
import Input from "../../../components/Input/Input";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { authenticationApi } from "../../../api/users/authentication.api";
import { RoleEnums } from "../../../data/models/user.model";
import Loader from "../../../components/Loader/Loader";
import z from "zod";

const twoFactorSchema = z.object({
  code: z
    .string("Le code de verification est requis")
    .min(6, "Le code de verification doit contenir au moins 6 caractères")
    .max(6, "Le code de verification doit contenir au plus 6 caractères"),
});

export default function TwoFactor() {

  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const location = useLocation();
  const email = location.state?.email
  const [code, setCode] = useState("")

  const [errors, setErrors] = useState<{ code?: string; }>({});

  const OnCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
    setErrors((prev) => ({ ...prev, code: undefined }));
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validation = twoFactorSchema.safeParse({ code });

    if (!validation.success) {
      const fieldErrors: { code?: string } = {};
      validation.error.issues.forEach((err) => {
        const fieldName = err.path[0] as "code";
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.set("email", email.trim())
      formData.set("code", code.trim())

      const result = await authenticationApi.twoFactor(formData);

      if (result.success) {

        // console.log('success')
        localStorage.setItem("auth_token", result.token);

        if (result.user.role === RoleEnums.SYSTEME_ADMIN) {

          navigate("/admin/dashboard");

        } else if (result.user.role === RoleEnums.ADMIN) {

          navigate("/organizer/dashboard");

        } else {

          console.log("Rôle inconnu");
          navigate("/");

        }
      } else {
        const backendError = "code incorrect";
        setErrors({ code: backendError });
      }
    } catch (error) {
      console.log(error)
      const backendError = "code incorrect";
        setErrors({ code: backendError });
    } finally {
      setIsLoading(false);
    }

  }

  return (

    <Fragment >
      <div className="contenair">

        <h1>Verification de code</h1>
        <form onSubmit={handleSubmit} method="post">

          <div>
            <Input label="Code de verfication" reference='code' type='text' placeholder="Saisir le code de confirmation ici ..." onChange={OnCodeChange} value={code} />
            {errors.code && (
              <p className="error-text" style={{ color: "red", fontSize: "0.9em" }}>
                {errors.code}
              </p>
            )}
          </div>

          <button type="submit">
            {isLoading ? <Loader /> : <span>Verifier</span>}</button>

        </form>

      </div>
    </Fragment>

  )
}
