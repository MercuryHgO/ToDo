import {useContext, } from "react";
import {Context} from "../App.tsx";
import Cookies from "universal-cookie";

const cookies = new Cookies()

const Profile = () => {
	
	const [_,setRegisterScreen,loggedIn] = useContext(Context)
	
	const handleLogInClick = () => {
		setRegisterScreen(true)
	}
	
	const handleLogOutClick = () => {
		cookies.remove('todoAuthTokens')
		window.location.reload()
	}
	
	return (
		<div>
			{
				loggedIn ?
					<button onClick={handleLogOutClick}>
						Log out </button>
					:
					<button onClick={handleLogInClick}>Log in</button>
			}
		</div>
	);
};

export default Profile;