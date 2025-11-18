import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import SignupCom1 from './SignupCom1';
import SignupCom2 from './SignupCom2';
import { useState } from 'react';
import ModalLoading from '../modals/Modalloading.jsx';
import ModalSignup from '../modals/ModalSignup.jsx';
import { MdError } from 'react-icons/md';
import { AiOutlineApi } from 'react-icons/ai';
import { RxCross1 } from 'react-icons/rx';
import { TbLockOpen } from 'react-icons/tb'; 
import { LoginContext } from '../context/LoginContext.jsx';
export default function Signup() {
  const { isLogin, setisLogin, setdata } = useContext(LoginContext);
   const [validate, setvalidate] = useState('');
  const [nextStep, setNextStep] = useState(false);
  const [ismodalopen, setmodalopen] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });
  const [modal, setmodal] = useState(false);

  const [info, setinfo] = useState({
    logo: '',
    message: '',
    moreinfo: '',
    path: '',
    content: '',
  });



  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlesubmit = async function () {  
     if (
      !formData.firstname ||
      !formData.lastname ||
      !formData.email ||
      !formData.password
    ) {
      return setvalidate('⚠️Please Enter valid info');
    } else {
      setvalidate('');
    }  
    try {
      setmodalopen(true);
      let response = await fetch(
        'http://localhost:5000/User',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      let result = await response.json();
      console.log(result)
      setmodalopen(false);
      setmodal(true);
      if (response.status == 201) {
        setinfo({
          logo: (
            <TbLockOpen className="text-6xl font-extrabold mb-5 text-green-500 self-center p-2 rounded-lg bg-green-100" />
          ),
          message: 'You Registered successfully✅',
          moreinfo: 'Now go to login page for login',
          path: 'login',
          content: 'Go to login',
        });
      } else if (response.status == 400) {
        setinfo({
          logo: (
            <RxCross1 className="text-6xl font-extrabold mb-5 text-red-500 self-center p-2 rounded-lg bg-red-100" />
          ),
          message: 'You Already Registered  ⛔',
          moreinfo: 'Please enter different email to Registere and try again',
          path: 'Signup',
          content: 'Try again',
        });
      }else {
        setinfo({
          logo: (
            <MdError className="text-6xl font-extrabold mb-5 text-red-500 self-center p-2 rounded-lg bg-red-100" />
          ),
          message: 'Server Error ❌',
          moreinfo:
            'There is server error please wait 2 to 3 minutes and try again',
          path: 'Signup',
          content: 'Try again',
        });
      }
    } catch (err) {
      console.log('Cant reach to a server', err);
      setmodal(true);
      setinfo({
        logo: (
          <MdError className="text-6xl font-extrabold mb-5 text-red-500 self-center p-2 rounded-lg bg-red-100" />
        ),
        message: "Can't reach the server ❗",
        moreinfo: 'Please check the network connetion',
        path: 'signup',
        content: 'Try again',
      });
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[100vh]">
      <div className="flex flex-col justify-center items-center 2xl:h-screen">
        <div className="mx-auto flex flex-row rounded-lg bg-white lg:w-[80vw] w-[100vw] lg:border relative">
          <div className="hidden sm:block lg:w-[38%] sm:w-[40%] rounded-l-lg bg-green-50 h-auto">
            <div className="flex py-10 xl:px-10 lg:px-6 md:px-4 sm:px-3 lg:mt-0 md:mt-10 sm:mt-6 items-center gap-2">
              <Link
                to={`/Home`}
                className="border-4 w-7 h-7 block rounded-full border-blue-700"
              ></Link>
              <Link
                to={`/Home`}
                className="text-xl font-semibold tracking-wider"
              >
                Civintel Nexus
              </Link>
            </div>

            <div
              onClick={() => setNextStep(false)}
              className={`flex flex-col cursor-pointer ${
                nextStep
                  ? 'opacity-50'
                  : 'opacity-100'
              }`}
            >
              <div className="flex flex-wrap gap-2 mt-8 items-center">
                <button className="border-2 px-[7px] py-[1px] xl:ml-10 lg:ml-6 md:ml-4 sm:ml-3  rounded-full border-blue-400">
                  ✓
                </button>
                <h1 className="text-lg font-semibold tracking-wide">
                  Your details
                </h1>
              </div>
              <p className="text-gray-700 xl:ml-[76px] lg:ml-[65px] md:ml-[56px] sm:ml-[47px] mt-1 text-base xl:pr-10 lg:pr-3 sm:pr-2">
                Please provide your valid name and
                email
              </p>
            </div>

            <div
              onClick={() => setNextStep(true)}
              className={`flex flex-col cursor-pointer  ${
                nextStep
                  ? 'opacity-100'
                  : 'opacity-50'
              }`}
            >
              <div className="flex flex-wrap gap-2 mt-5 items-center">
                <button className="border-2 px-[7px] py-[1px] xl:ml-10 lg:ml-6 md:ml-4 sm:ml-3  rounded-full border-blue-400">
                  ✓
                </button>
                <h1 className="text-lg font-semibold tracking-wide">
                  Choose password
                </h1>
              </div>
              <p className="text-gray-700 xl:ml-[76px] lg:ml-[65px] md:ml-[58px] sm:ml-[47px] mt-1 text-base xl:pr-10 lg:pr-3 sm:pr-2">
                Must be at least 8 characters
              </p>
            </div>
          </div>

          {nextStep ? (
            <SignupCom2
              formData={formData}
              handleChange={handleChange}
              handlesubmit={handlesubmit}
              setvalidate={setvalidate}
              validate={validate}
            />
          ) : (
            <SignupCom1
              setNextStep={setNextStep}
              formData={formData}
              handleChange={handleChange}
               setvalidate={setvalidate}
               validate={validate}
            />
          )}
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

      <ModalLoading isOpen={ismodalopen}></ModalLoading>
      </div>
    </div>
  );
}
