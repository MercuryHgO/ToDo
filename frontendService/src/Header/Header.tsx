import Profile from "./Profile.tsx";

const Header = () => {
	return (
		<header className={"flex justify-between items-center p-6 bg-white w-full h-12 text-black"}>
			<h1>ToDo List</h1>
			<Profile />
		</header>
	);
};

export default Header;