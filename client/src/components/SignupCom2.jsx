/* import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { LuLockKeyhole } from 'react-icons/lu';

export default function SignupCom2({
  formData,
  handleChange,
  handlesubmit,
  setvalidate,
  validate
})

{

  const [indicate, setindicate] = useState('');
  const [confirm, setconfirm] = useState('');
  const hasrendered = useRef(false);
  const[state,setstate]= useState(false)
  const getpassword = (e) => {
    let value = e.target.value;
    setconfirm(value);

     if (formData.password.length > 0 && formData.password == confirm) {
      setindicate('Password matched');
      setstate(true);
      setvalidate('');
      hasrendered.current = true;
    }
    if (formData.password != confirm && hasrendered.current) {
      setindicate('Password missmatch');
    }
  };

  useEffect(() => {
    setindicate('Password matched');
  }, [confirm]);

  return (
    <div className="xl:w-96 lg:w-[62%] md:w-[60%] sm:w-[60%] w-[100vw] mx-auto pt-16 pb-28 xl:px-0 lg:px-20 md:px-14 sm:px-12 px-12 mt-0 sm:mt-14">
      <LuLockKeyhole
        size={30}
        className="mt-16 mx-auto border rounded-md px-1 py-1"
      />
      <h1 className="font-bold text-2xl text-center opacity-85 mt-4">
        Choose a password
      </h1>

      <p className="text-sm text-gray-700 text-center mt-2">
        Must be at least 8 characters
      </p>

      <form className="flex flex-col gap-1">
        <label
          htmlFor="name"
          className="mt-8 font-semibold"
        >
          Password
        </label>
        <input
          type="text"
          id="name"
          name="password"
          value={formData.password}
          className="pl-3 rounded-md h-10 border"
          onChange={handleChange}
        />

        <label
          htmlFor="confirm"
          className="mt-4 font-semibold"
        >
          Confirm password
        </label>
        <input
        onChange={getpassword}
          type="password"
          id="confirm"
          name="password"
          value={confirm}
          className="pl-3 rounded-md h-10 border"
        />

          {indicate && (
          <p
            className={`${
              formData.password == confirm ? 'text-green-500' : 'text-red-500'
            } text-[10px] my-1`}
          >
            {indicate}
          </p>
        )}

        {validate && <p className="text-red-500 text-sm my-2">{validate}</p>}

        <button
          className={`h-10 mt-6 rounded-md font-semibold ${state ? 'cursor-pointer bg-blue-500':'cursor-not-allowed bg-gray-200'}`}
          onClick={(e) => {
            e.preventDefault();
            handlesubmit();
          }}
        >
          Complete signup
        </button>
      </form>
    </div>
  );
}
 */



import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { LockKeyhole } from 'lucide-react';

export default function SignupCom2({
  formData,
  handleChange,
  handlesubmit,
  setvalidate,
  validate
})

{

  const [indicate, setindicate] = useState('');
  const [confirm, setconfirm] = useState('');
  const hasrendered = useRef(false);
  const[state,setstate]= useState(false);
  
  const getpassword = (e) => {
    let value = e.target.value;
    setconfirm(value);
    hasrendered.current = true;
  };

  useEffect(() => {
    if (hasrendered.current && confirm.length > 0) {
      if (formData.password === confirm && formData.password.length >= 8) {
        setindicate('Password matched');
        setstate(true);
        setvalidate('');
      } else if (formData.password !== confirm) {
        setindicate('Password mismatch');
        setstate(false);
      } else if (formData.password.length < 8) {
        setindicate('Password must be at least 8 characters');
        setstate(false);
      }
    } else if (confirm.length === 0) {
      setindicate('');
      setstate(false);
    }
  }, [confirm, formData.password, setvalidate]);

  return (
    <div className="xl:w-96 lg:w-[62%] md:w-[60%] sm:w-[60%] w-[100vw] mx-auto pt-16 pb-28 xl:px-0 lg:px-20 md:px-14 sm:px-12 px-12 mt-0 sm:mt-14">
      <LockKeyhole
        size={30}
        className="mt-16 mx-auto border rounded-md px-1 py-1"
      />
      <h1 className="font-bold text-2xl text-center opacity-85 mt-4">
        Choose a password
      </h1>

      <p className="text-sm text-gray-700 text-center mt-2">
        Must be at least 8 characters
      </p>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="name"
          className="mt-8 font-semibold"
        >
          Password
        </label>
        <input
          type="password"
          id="name"
          name="password"
          value={formData.password}
          className="pl-3 rounded-md h-10 border"
          onChange={handleChange}
        />

        <label
          htmlFor="confirm"
          className="mt-4 font-semibold"
        >
          Confirm password
        </label>
        <input
        onChange={getpassword}
          type="password"
          id="confirm"
          name="confirmPassword"
          value={confirm}
          className="pl-3 rounded-md h-10 border"
        />

          {indicate && (
          <p
            className={`${
              formData.password === confirm ? 'text-green-500' : 'text-red-500'
            } text-[10px] my-1`}
          >
            {indicate}
          </p>
        )}

        {validate && <p className="text-red-500 text-sm my-2">{validate}</p>}

        <button
          className={`h-10 mt-6 rounded-md font-semibold ${state ? 'cursor-pointer bg-blue-500 text-white':'cursor-not-allowed bg-gray-200'}`}
          onClick={(e) => {
            e.preventDefault();
            handlesubmit();
          }}
          disabled={!state}
        >
          Complete signup
        </button>
      </div>
    </div>
  );
}