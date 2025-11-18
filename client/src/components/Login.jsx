import { IoPersonAddOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';
//import ModalSignup from '../Modals/ModalSignup';
import ModalLoading from '../modals/Modalloading.jsx';
import { LoginContext } from '../context/LoginContext.jsx';
import { MdError } from 'react-icons/md';
import { RxCross1 } from 'react-icons/rx';
import { MdBlockFlipped } from 'react-icons/md';
import { TbLockOpen } from 'react-icons/tb';
import ModalSignup from '../modals/ModalSignup.jsx';

export default function Login() {
const { isLogin, setisLogin, setdata } = useContext(LoginContext);

const [info, setinfo] = useState({
    logo: '',
    message: '',
    moreinfo: '',
    path: '',
    content: '',
  });

  const [logindata, setlogindata] = useState({
    email: '',
    password: '',
  });

  //console.log(logindata);

  const [ismodalopen, setmodalopen] = useState(false);
  const [modal, setmodal] = useState(false);
  const handlechange = function (e) {
    setlogindata((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlelogin = async (e) => {
    e.preventDefault();
    setmodalopen(true);
    try {
      const res = await fetch(
        'http://localhost:5000/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(logindata),
        }
      );

      const data = await res.json();
      setmodalopen(false);
      setmodal(true)

      if (res.status == 200) {
         setisLogin(true);
        setdata(data);
        setinfo({
          logo: (
            <TbLockOpen className="text-6xl font-extrabold mb-5 text-green-500 self-center p-2 rounded-lg bg-green-100" />
          ),
          message: 'Login successful ✅',
          moreinfo: 'You unlocked some features',
          path: '#home',
          content: 'Go to Dashbord',
        });
        return
      } else if (res.status == 400) {
        setinfo({
          logo: (
            <RxCross1 className="text-6xl font-extrabold mb-5 text-red-500 self-center p-2 rounded-lg bg-red-100" />
          ),
          message: 'Invalid Emil or Password ⛔',
          moreinfo: 'Please enter valid email and password',
          path: 'login',
          content: 'Try again',
        });

      } else if (res.status == 404) {
         setinfo({
          logo: (
            <MdBlockFlipped className="text-6xl font-extrabold mb-5 text-red-500 text-opacity-70 self-center p-2 rounded-lg bg-red-100" />
          ),
          message: 'User not found ❗',
          moreinfo: 'Please sign up and continue login',
          path: 'signup',
          content: 'Go to Signup',
        });

      } else {
        setinfo({
          logo: (
            <MdError className="text-6xl font-extrabold mb-5 text-red-500 self-center p-2 rounded-lg bg-red-100" />
          ),
          message: 'Server Error ❌',
          moreinfo:
            'There is server error please wait 2 to 3 minutes and try again',
          path: 'login',
          content: 'Try again',
        });

      }
    } catch (err) {
      console.log('Cant reach to a server', err);
      setinfo({
        logo: (
          <MdError className="text-6xl font-extrabold mb-5 text-red-500 self-center p-2 rounded-lg bg-red-100" />
        ),
        message: "Can't reach the server ❗",
        moreinfo: 'Please check the network connetion',
        path: 'login',
        content: 'Try again',
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[100vh] w-[60vw] mx-auto">
      <div className="flex flex-col self-center sm:flex-row rounded-lg bg-white xl:w-[55vw] lg:w-[85vw] w-[100vw] lg:border relative">
        <div className="xl:w-[33%] sm:w-[38%] hidden sm:block rounded-l-lg bg-green-50  h-[75vh]">
          <div className="flex py-10 lg:px-10 md:px-6 sm:ml-2 sm:mt-6 md:mt-0 items-center gap-2 ">
            <button className="border-4 w-7 h-7 rounded-full border-blue-700"></button>
            <h1 className="text-xl font-semibold tracking-wider">
              Civintel Nexus
            </h1>
          </div>

          <div className="flex flex-col hover:bg-[#00000010] hover:rounded-3xl cursor-pointer">
            <div className="flex flex-wrap gap-2 mt-8 items-center">
              <button className="border-2 w-7 h-7 lg:ml-10 md:ml-6 sm:ml-2  rounded-full border-blue-400">
                ✓
              </button>
              <h1 className="font-semibold tracking-wide text-2xl">Login</h1>
            </div>
            <p className="text-gray-700 lg:ml-[76px] md:ml-[60px] sm:ml-[40px] mt-1 text-xl lg:pr-10 sm:pr-3">
              Please login to unlock all the features
            </p>
          </div>

          <Link
            to={`/Signup`}
            className="flex flex-col  hover:bg-[#00000010] hover:rounded-3xl cursor-pointer"
          >
            <div className="flex flex-wrap gap-2 mt-8 items-center">
              <button className="border-2 w-7 h-7 lg:ml-10 md:ml-6 sm:ml-2 rounded-full border-blue-400">
                ✓
              </button>
              <h1 className="font-semibold tracking-wide text-2xl">Signup</h1>
            </div>
            <p className="text-gray-700 lg:ml-[76px] md:ml-[60px] sm:ml-[40px] mt-1 text-xl lg:pr-10 sm:pr-3">
              Please signup to get membership of our project.
            </p>
          </Link>
        </div>

        <div className="xl:w-[67%] sm:w-[58%] w-[70%] sm:mt-32  sm:my-0  xl:px-40 lg:px-20 md:px-16 sm:px-14 mx-auto">
          <IoPersonAddOutline size={30} className="mx-auto sm:mt-8" />

          <h1 className="tracking-wider font-semibold text-xl text-center mt-2">
            Login
          </h1>

          <p className="text-sm text-gray-700 text-center mt-2">
            Please Enter the valid details below
          </p>

          <form className="flex flex-col gap-1 flex-wrap ">
            <label htmlFor="name" className="mt-8 font-semibold">
              Email
            </label>
            <input
              type="text"
              id="name"
              name="email"
              className="pl-3 rounded-md  h-10 border"
              placeholder="Enter Email"
              onChange={handlechange}
            />

            <label htmlFor="password" className="mt-4 font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="pl-3 rounded-md  h-10 border"
              placeholder="Enter password"
              onChange={handlechange}
            />

            <button
            type='button'
              onClick={handlelogin}
              className="h-10 mt-6 bg-blue-500 rounded-md"
            >
              Login
            </button>

            <p className="text-black text-center mt-6">
              Can't login?{' '}
              <Link to={`/Signup`} className="text-blue-800 cursor-pointer">
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
       <ModalSignup isOpen={modal} onClose={() => setmodal(false)}>
          <div className="flex flex-col justify-center p-5">
            {info.logo}
            <h1 className="text-2xl text-center font-semibold">
              {info.message}
            </h1>
            <p className="text-gray-700 text-base text-center mt-2">
              {info.moreinfo}
            </p>
            <Link
              to={`/${info.path}`}
              onClick={() => setmodal(false)}
              className="px-10 py-2 rounded-lg mt-8 bg-black bg-opacity-80 text-white text-center mx-auto"
            >
              {info.content}
            </Link>
          </div>
        </ModalSignup>
      <ModalLoading isOpen={ismodalopen}> </ModalLoading>
    </div>
  );
}
