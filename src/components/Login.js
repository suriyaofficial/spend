import './Login.css';
import React, { useState } from "react";
import { app } from "../firebaseconfig";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import GoogleButton from 'react-google-button'
import axios from 'axios';

function Login() {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    const [userData, setUserData] = useState()
    const port = "http://localhost:3100"

    const signInWithGoogle = async () => {
        console.log("🚀 ~ file: login.js:27 ~ signInWithGoogle ~ signInWithGoogle:");
        try {
            let result = await signInWithPopup(auth, provider);
            console.log("🚀 ~ file: Login.js:21 ~ signInWithGoogle ~ result:", result.user.providerData[0])
            const data = {
                "username": result.user.providerData[0].email,
                "name": result.user.providerData[0].displayName,
                "photoUrl": result.user.providerData[0].photoURL,
            };

            const response = await axios.post(`${port}/login/`, data);
            console.log("🚀 ~ file: Login.js:29 ~ signInWithGoogle ~ response:", response.data.data)
            localStorage.setItem("user", JSON.stringify(response.data.data))
            window.location.reload();

        } catch (error) {
            console.error("🚀 ~ file: login.j:22 ~ signInWithGoogle ~ error:", error);
        }
    };
    return (
        <>
            <div className='mainDiv'>
                <h3>Welcome...</h3>
                <GoogleButton type="light" onClick={signInWithGoogle} />
            </div>

        </>
    );
}

// const response = await axios.get(`${port}/getStatus/`, {
//     headers: {
//         Authorization: `Bearer ${jwt}`
//     }
// });
// let data = { "mssg": "hi" };

// jwt = document.cookie.split("jwtToken=")[1]
// console.log("🚀 ~ file: Dash.js:257 ~ logout ~ jwt:", jwt)
// const response = await axios.post(`${port}/logout/`, data, {
//     headers: {
//         Authorization: `Bearer ${jwt}`
//     }
// });
// let data = {
//     "username": values.username,
//     "password": values.signinconfirmPassword
// };

//     const response = await axios.post(`${port}/register/`, data);

export default Login