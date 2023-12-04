"use client";

const LoginPage = () => {
    return (<form className="w-[100wh] h-[100vh] flex flex-col justify-center items-center bg-gray-4 ">
        <p className="text-primary text-gray-11 m-8 ">Log in to view your dashboard</p>
        <input className="bg-gray-3 text-gray-11 placeholder:italic rounded-[33px] px-[30px] py-[20px] w-[400px] m-2 focus:border-none outline-none " type="email" placeholder="Email..."/>
        <input className="bg-gray-3 text-gray-11 placeholder:italic rounded-[33px] px-[30px] py-[20px] w-[400px] m-2 focus:border-none outline-none " type="password" placeholder="Password..." />
        <div className="gap-2"></div>
        <button className="bg-gray-5 rounded-[33px] px-[30px] py-[15px] w-[400px] mx-2 mt-5 mb-20 text-white text-medium shadow-md drop-shadow-0 drop-shadow-y-3 blur-6 ">Login</button>
        <p className="text-white text-primary font-semibold">Don't have an account yet?</p>
        <p className="max-w-[330px] text-gray-9 text-center">Download the FieldAR app on Apple App Store or Google Play and register for a free account.</p>
    </form>)
} 

export default LoginPage;