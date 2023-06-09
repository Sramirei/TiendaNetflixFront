import React, {  useState, useContext } from 'react'
import CustomLogin  from './functions';
import UserContext from '../../Contexts/UserContext';
import { Navigate } from 'react-router-dom';
import Swal from "sweetalert2"
import './login.css'


const Login = ({session}) => {

  const [user, setUser] = useState('')
	const [password, setPassword] = useState('')

	const { login }  = useContext(UserContext)

	const handleLogin = async (e) =>{
		e.preventDefault()
		try {
			
			// eslint-disable-next-line no-unused-vars
			const data = await login({
				login: user,
				contrasena: password
			})

			setUser('')
			setPassword('')

		} catch (error) {
      console.log(error);
			Swal.fire({
				title: 'Error!',
				text: 'Revise sus credenciales',
				icon: 'warning',
				confirmButtonText: 'Ok'
		})
		}
  }

  if (session) {
		return <Navigate to="/home" replace />;
	}

  return (
    <>
    <div className="container">
   <form className="login-form">
      <p className="login-text">
         <span className="fa-stack fa-lg">
           <img className="custom-icon" src="../../Img/logo1.jpg" alt="Icon"/>
         </span>
       </p>
      <input type="text" className="login-username" autoFocus required placeholder="Usuario" 
      value={user}
			onChange={({target}) => setUser(target.value)}
      />
      <input type="password" className="login-password" required placeholder="Contraseña" 
      value={password}
			onChange={({target}) => setPassword(target.value)}
      />
      <input type="submit" name="Login" value="Iniciar Sesion" className="login-submit" onClick={handleLogin} />
    </form>
    {/* <a href={'#'} className="login-forgot-pass">Olvidaste tu contraseña?</a> */}
    <div className="underlay-photo"></div>
    <div className="underlay-black"></div>
    <CustomLogin />
   </div>
    </>
  )
}

export default Login
