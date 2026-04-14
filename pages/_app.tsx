import React, { useState, useEffect } from "react";
import "../styles/globals.css";
import StudentVue from "studentvue";
import { useRouter } from "next/router";
import { Flowbite, Toast } from "flowbite-react";
import Topbar from "../components/TopBar";
import SideBar from "../components/SideBar";
import MobileBar from "../components/MobileBar";
import { Grades } from "../utils/grades";
import Head from "next/head";
import Script from "next/script";
import { HiX } from "react-icons/hi";
import BackgroundColor from "../components/BackgroundColor";
import { AnimateSharedLayout } from "framer-motion";

const noShowNav = ["/login", "/", "/privacy", "/letter"];

function MyApp({ Component, pageProps }) {
	const router = useRouter();
	const [districtURL, setDistrictURL] = useState("https://edupoint.com");
	const [client, setClient] = useState(undefined);
	const [studentInfo, setStudentInfo] = useState(undefined);
	const [toasts, setToasts] = useState([]);
	const [grades, setGrades] = useState();
	const [period, setPeriod] = useState();
	const [loading, setLoading] = useState(false);

	const login = async (username, password, save, url) => {
		setLoading(true);
		try {
			// FIXED: Added appVersion: "5.3.0" to satisfy StudentVUE server version checks
			const res = await StudentVue.login(url || districtURL, { 
				username, 
				password, 
				appVersion: "5.3.0" 
			});
			setClient(res);
			if (save) {
				localStorage.setItem("remember", "true");
				localStorage.setItem("username", username);
				localStorage.setItem("password", password);
				localStorage.setItem("districtURL", districtURL);
			}
			setLoading(false);
			return true;
		} catch (err) {
			setToasts((prev) => [...prev, { title: err.message, type: "error" }]);
			setTimeout(() => setToasts((prev) => prev.slice(1)), 5000);
			setLoading(false);
			return false;
		}
	};

	const logout = async () => {
		setClient(undefined);
		router.push("/login");
		setStudentInfo(undefined);
		setGrades(undefined);
		localStorage.removeItem("username");
		localStorage.removeItem("password");
	};

	useEffect(() => {
		let username = localStorage.getItem("username");
		let password = localStorage.getItem("password");
		let remember = localStorage.getItem("remember");
		let storedDistrictURL = localStorage.getItem("districtURL");
		storedDistrictURL && setDistrictURL(storedDistrictURL);
		if (remember === "true" && username && password && storedDistrictURL) {
			login(username, password, true, storedDistrictURL);
		}
	}, []);

	useEffect(() => {
		if (client !== undefined) {
			client.studentInfo().then((res) => setStudentInfo(res));
			if (router.pathname === "/login" || router.pathname === "/") {
				router.push("/grades");
			}
		}
	}, [client]);

	return (
		<Flowbite>
			<Head><title>Grade Melon</title></Head>
			<div className="absolute p-5 z-20">
				{toasts.map(({ title }, i) => (
					<div className="mb-5 z-50" key={i}>
						<Toast>
							<div onClick={() => setToasts((p) => p.filter((_, idx) => idx !== i))} className="text-red-500"><HiX /></div>
							<div className="ml-3 text-sm font-normal">{title}</div>
						</Toast>
					</div>
				))}
			</div>
			<BackgroundColor />
			<div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
				<Topbar studentInfo={studentInfo} logout={logout} client={client} />
				{noShowNav.includes(router.pathname) ? (
					<Component {...pageProps} districtURL={districtURL} setDistrictURL={setDistrictURL} login={login} client={client} loading={loading} />
				) : (
					<div className="flex"><SideBar studentInfo={studentInfo} logout={logout} /><Component {...pageProps} client={client} login={login} /></div>
				)}
			</div>
		</Flowbite>
	);
}
export default MyApp;
