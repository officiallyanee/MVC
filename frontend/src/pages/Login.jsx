import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../provider/AuthProvider';

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EmailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2, ease: "easeIn" } }
};

const LoginForm = ({ valuesLogin, setValuesLogin, handleLogin, setIsLoginView }) => (
    <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full flex flex-col items-center"
    >
        <div className="w-full text-center justify-start text-white text-5xl font-normal font-['Pompiere'] underline decoration-white/30 tracking-wide mb-12">Login</div>
        
        <div className="w-full max-w-sm">
            <label className="block text-left text-white text-3xl font-normal font-['Pompiere'] tracking-wide mb-2">Username
            <div className="relative mt-1 w-full h-14 bg-white/5 rounded-[32px] shadow-[inset_0px_0px_8px_4px_rgba(255,255,255,0.20)] border border-white/50 flex items-center px-6">
                <UserIcon />
                <input onChange={e=>setValuesLogin({...valuesLogin, Name: e.target.value})} type="text" value={valuesLogin.Name} placeholder="Enter your username" className="w-full h-full bg-transparent text-white text-xl font-['Pompiere'] tracking-wide pl-4 focus:outline-none placeholder-white/30" required/>
            </div>
            </label>
        </div>

        <div className="w-full max-w-sm mt-4">
            <label className="block text-left text-white text-3xl font-normal font-['Pompiere'] tracking-wide mb-2">Password
            <div className="relative mt-1 w-full h-14 bg-white/5 rounded-[32px] shadow-[inset_0px_0px_8px_4px_rgba(255,255,255,0.20)] border border-white/50 flex items-center px-6">
                <LockIcon />
                <input onChange={e => setValuesLogin({...valuesLogin, Password: e.target.value})} type="password" value={valuesLogin.Password} placeholder="Enter your password" className="w-full h-full bg-transparent text-white text-xl font-['Pompiere'] tracking-wide pl-4 focus:outline-none placeholder-white/30" required/>
            </div>
            </label>
        </div>

        <button onClick={handleLogin} type="submit" className="w-44 h-14 mt-12 bg-white/60 rounded-[32px] shadow-[inset_0px_0px_8px_4px_rgba(0,0,0,0.20)] outline outline-1 outline-offset-[-1px] outline-white/50 text-center text-black/80 text-3xl font-normal font-['Pompiere'] tracking-wide hover:bg-white/80 transition-colors duration-300">
            LOGIN
        </button>
        <div className="mt-6 text-center justify-center">
            <span className="text-white text-2xl font-normal font-['Pompiere'] tracking-wide">Don't have an account? </span>
            <button onClick={() => setIsLoginView(false)} className="text-white text-2xl font-normal font-['Pompiere'] underline tracking-wide hover:text-yellow-300 transition-colors">SignUp</button>
        </div>
    </motion.div>
);

const SignupForm = ({ valuesSignup, setValuesSignup, handleSignup, setIsLoginView }) => (
    <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full flex flex-col items-center"
    >
        <div className="w-full text-center justify-start text-white text-5xl font-normal font-['Pompiere'] underline decoration-white/30 tracking-wide mb-10">SignUp</div>
        
        <div className="w-full max-w-sm">
            <label className="block text-left text-white text-3xl font-normal font-['Pompiere'] tracking-wide mb-2">Username
            <div className="relative w-full h-14 bg-white/5 rounded-[32px] shadow-[inset_0px_0px_8px_4px_rgba(255,255,255,0.20)] border border-white/50 flex items-center px-6">
                <UserIcon />
                <input onChange={e => setValuesSignup({...valuesSignup, Name: e.target.value})} type="text" value={valuesSignup.Name} placeholder="Choose a username" className="w-full h-full bg-transparent text-white text-xl font-['Pompiere'] tracking-wide pl-4 focus:outline-none placeholder-white/30" required/>
            </div>
            </label>
        </div>

        <div className="w-full max-w-sm mt-4">
            <label className="block text-left text-white text-3xl font-normal font-['Pompiere'] tracking-wide mb-2">Password
            <div className="relative w-full h-14 bg-white/5 rounded-[32px] shadow-[inset_0px_0px_8px_4px_rgba(255,255,255,0.20)] border border-white/50 flex items-center px-6">
                <LockIcon />
                <input onChange={e => setValuesSignup({...valuesSignup, Password: e.target.value})} type="password" value={valuesSignup.Password} placeholder="Create a password" pattern=".{8,}" title="Must contain at least 8 or more characters" className="w-full h-full bg-transparent text-white text-xl font-['Pompiere'] tracking-wide pl-4 focus:outline-none placeholder-white/30" required/>
            </div>
            </label>
        </div>
        <div className="w-full max-w-sm mt-4">
            <label className="block text-left text-white text-3xl font-normal font-['Pompiere'] tracking-wide mb-2">Email
            <div className="relative w-full h-14 bg-white/5 rounded-[32px] shadow-[inset_0px_0px_8px_4px_rgba(255,255,255,0.20)] border border-white/50 flex items-center px-6">
                <EmailIcon />
                <input onChange={e => setValuesSignup({...valuesSignup, Email: e.target.value})} type="email" value={valuesSignup.Email} placeholder="Choose a email" className="w-full h-full bg-transparent text-white text-xl font-['Pompiere'] tracking-wide pl-4 focus:outline-none placeholder-white/30" required/>
            </div>
            </label>
        </div>

        <button onClick={handleSignup} type="button" className="w-44 h-14 mt-12 bg-white/60 rounded-[32px] shadow-[inset_0px_0px_8px_4px_rgba(0,0,0,0.20)] outline outline-1 outline-offset-[-1px] outline-white/50 text-center text-black/80 text-3xl font-normal font-['Pompiere'] tracking-wide hover:bg-white/80 transition-colors duration-300">
            SIGNUP
        </button>
         <div className="mt-4 text-center justify-center">
            <span className="text-white text-2xl font-normal font-['Pompiere'] tracking-wide">Already have an account? </span>
            <button onClick={() => setIsLoginView(true)} className="text-white text-2xl font-normal font-['Pompiere'] underline tracking-wide hover:text-yellow-300 transition-colors">Login</button>
        </div>
    </motion.div>
);

function Login() {
    const {login, signup} = useAuth();
    const [isLoginView, setIsLoginView] = useState(true);
    
    const[valuesSignup, setValuesSignup] = useState({   
        Name: '',
        Email: '',
        Password: ''
    })
    const[valuesLogin, setValuesLogin] = useState({   
        Name: '',
        Password: ''
    })

const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Values before sending:", valuesLogin);
    
    try {
        await login(valuesLogin);
    } catch (error) {
        console.error("Login error:", error);
    }
}

const handleSignup = async (e) => {
    e.preventDefault();
    console.log("Values before sending:", valuesSignup);
    
    try {
        await signup(valuesSignup);
    } catch (error) {
        console.error("Signup error:", error);
    }
}

    return (
        <div className="z-50 w-full min-h-screen flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 sm:py-16 font-['Pompiere']">
            <div className="w-full max-w-6xl flex flex-col lg:flex-row rounded-3xl shadow-2xl overflow-hidden">

                <div className="w-full lg:w-1/2 bg-black/70 rounded-t-3xl lg:rounded-tr-none lg:rounded-l-3xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.50)] shadow-[inset_0px_0px_16px_1px_rgba(255,255,255,0.25)] outline outline-1 outline-offset-[-1px] outline-white/30 backdrop-blur-[32px] p-8 sm:p-16 flex flex-col justify-center min-h-[70vh]">
                    <AnimatePresence mode="wait">
                        {isLoginView ? (
                            <LoginForm 
                                key="login"
                                valuesLogin={valuesLogin}
                                setValuesLogin={setValuesLogin}
                                handleLogin={handleLogin}
                                setIsLoginView={setIsLoginView}
                            />
                        ) : (
                            <SignupForm 
                                key="signup"
                                valuesSignup={valuesSignup}
                                setValuesSignup={setValuesSignup}
                                handleSignup={handleSignup}
                                setIsLoginView={setIsLoginView}
                            />
                        )}
                    </AnimatePresence>
                </div>

                <div className="w-full lg:w-1/2 bg-gradient-to-b from-white/20 to-black/20 rounded-b-3xl lg:rounded-bl-none lg:rounded-r-3xl shadow-[0px_4px_4px_0px_rgba(0,0,0,0.50)] shadow-[inset_0px_0px_16px_2px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-white/30 backdrop-blur-[32px] p-8 sm:p-12 flex flex-col items-center justify-center text-center min-h-[30vh] lg:min-h-auto">
                    <h2 className="text-white text-5xl font-normal tracking-wide mb-6">
                        {isLoginView ? 'New here?' : 'Already have an account?'}
                    </h2>
                    <button 
                        onClick={() => setIsLoginView(!isLoginView)}
                        className="w-48 h-14 bg-black/50 rounded-[32px] shadow-[inset_0px_0px_8px_4px_rgba(0,0,0,0.20)] outline outline-1 outline-offset-[-1px] outline-white/50 text-white/80 text-3xl font-normal tracking-wide hover:bg-black/70 transition-colors duration-300"
                    >
                        {isLoginView ? 'SIGNUP' : 'LOGIN'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;