import { Button, Checkbox, TextField } from "@mui/material"
import { FC, useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { Link, useLocation } from "react-router-dom"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import FormControlLabel from "@mui/material/FormControlLabel"
import PasswordField from "components/ui/fields/PasswordField"
import { useTranslation } from "react-i18next"
import { ErrorMessage } from "components/ui/text/ErrorMessage"
import { login } from "store/user/user.actions"
import { useDispatch } from "react-redux"
import { AppDispatch } from "store/store"
import { SnackbarContext } from "providers/Snackbar.provider"
import { useRedirect } from "hooks/useRedirect"
import { ErrorCodes } from "enums/ErrorCodes"
import { useAppSelector } from "hooks/userAppSelector"
import { IStandardError } from "interfaces/responseError.interface"
import { Subscription } from "react-hook-form/dist/utils/createSubject"
import { yupLocale } from "utils/yupLocale"

yup.setLocale(yupLocale);

type FormDataType = {
	email: string
	password: string
	rememberMe: boolean
}

const schema = yup
	.object({
		email: yup.string().required().trim().email(),
		password: yup.string().required().trim().min(8),
		rememberMe: yup.boolean().required()
	})
	.required()

const Login: FC = () => {
	const {
		register,
		setFocus,
		clearErrors,
		watch,
		setError,
		handleSubmit,
		getFieldState,
		formState: { errors }
	} = useForm<FormDataType>({
		resolver: yupResolver(schema),
		mode: "onTouched"
	})

	type ServerError = {
		dependentFields: Array<"email" | "password">
		error: string
	}

	const [serverError, setServerError] = useState<ServerError | null>(null);

	let serverErrorSubscription: Subscription
	const unsubscribe = () => {
		clearErrors(serverError?.dependentFields)
		setServerError(null)
		serverErrorSubscription.unsubscribe()
	}

	const [showPassword, setShowPassword] = useState(false)

	const { t } = useTranslation(["common\\form", "login", "common\\errors"])
	const dispatch = useDispatch<AppDispatch>()
	const redirect = useRedirect()
	const { setSnack } = useContext(SnackbarContext)
	const onSubmit = async (data: FormDataType) => {
		try {
			await dispatch(login(data)).unwrap()
			redirect()
		} catch (e) {	
			const { errorCode } = e as IStandardError
			if (errorCode === ErrorCodes.InvalidCredentials) {
				const errorFields: Array<"email" | "password"> = ["email", "password"]
				setFocus(errorFields[0])
				errorFields.forEach(field =>
					setError(field, { type: errorCode.toString() })
				)
				setServerError({
					dependentFields: errorFields,
					error: t(`common\\errors:${ErrorCodes[errorCode]}`)
				})
				serverErrorSubscription = watch(unsubscribe)

				//setError('password', {type: errorCode.toString(), message: t(`common\\errors:${ErrorCodes[errorCode]}`) as string})
			} else {
				setSnack({
					message: t(`common\\errors:${ErrorCodes[errorCode]}`),
					color: "error",
					open: true
				})
			}
		}
	}

	const isLoading = useAppSelector(state => state.user.isLoading)

	const location = useLocation();

	return (
		<>
			<div className="mx-auto max-w-sm">
				<div>
					<h2 className="text-center text-2xl font-bold tracking-tight">
						{t("login:title")}
					</h2>
				</div>
				<div className="mt-6">
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="flex flex-col justify-start">
							<div className="space-y-4">
								<TextField
									{...register("email")}
									fullWidth
									label={`${t("fields.email")}*`}
									error={errors.email !== undefined}
									helperText={
										<ErrorMessage
											error={errors.email?.message}
											field={t("common\form:fields.email") as string}
										/>
									}
									variant="outlined"
								/>
								<PasswordField
									{...register("password")}
									error={errors.password !== undefined}
									helperText={
										<ErrorMessage
											error={errors.password?.message || serverError?.error}
											field={t("fields.password") as string}
										/>
									}
									showPassword={showPassword}
									onClick={() => setShowPassword(showPassword => !showPassword)}
									label={`${t("fields.password")}*`}
									isTouched={getFieldState("password").isTouched}
								/>
							</div>
							<div className="flex flex-wrap justify-between">
								<FormControlLabel
									{...register("rememberMe")}
									control={<Checkbox />}
									label={t("login:rememberMe")}
								/>
								<Link className="self-center whitespace-nowrap" to={"#"}>
									{t("login:forgotPassword")}
								</Link>
							</div>

							<div className="mt-4">
								<Button
									className="h-10"
									fullWidth
									variant="contained"
									type="submit"
									disabled={isLoading || serverError !== null}
								>
									{t("login:signIn")}
								</Button>
							</div>
						</div>
					</form>
					<p className="mt-6 text-center text-base">
						{t("login:notMember")}{" "}
						<Link
							color="secondary"
							to={"/signup"}
							state={{from: location.state?.from}}
							className="whitespace-nowrap font-semibold leading-6"
						>
							{t("login:createAccount")}
						</Link>
					</p>
				</div>
			</div>
		</>
	)
}

export default Login

// Basic FormControl
/* <FormControl
  fullWidth
  error={getFieldState('password').isTouched && !!errors.password} 
  variant="outlined">
  <InputLabel>Password</InputLabel>
  <OutlinedInput
    {...register('password')}
    type={showPassword ? 'text' : 'password'}
    label="Password"
    endAdornment={
      <InputAdornment position="end">
        <IconButton
          aria-label="toggle password visibility"
          onClick={() => setShowPassword((showPassword) => !showPassword)}
          edge="end"
        >
          {showPassword ? <VisibilityOff/> : <Visibility/>}
          </IconButton>
      </InputAdornment>
    }
  />
  {getFieldState('password').isTouched && <FormHelperText>{errors.password?.message}</FormHelperText>}
</FormControl> */
