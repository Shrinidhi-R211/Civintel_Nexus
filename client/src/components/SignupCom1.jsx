import React from 'react';
import { MdOutlineOutlinedFlag } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';

export default function Signupcom1({
  setNextStep,
  formData,
  handleChange,
}) {
  return (
    <div className="xl:w-96 lg:w-[62%] md:w-[60%] sm:w-[60%] w-[100vw] mx-auto pb-10 xl:px-0 lg:px-20 md:px-14 sm:px-12 px-12 mt-0 sm:mt-14">
      <MdOutlineOutlinedFlag
        size={40}
        className="mt-16 mx-auto border rounded-md px-1 py-1"
      />
      <h1 className="font-bold text-2xl text-center opacity-85 mt-4">
        Your details
      </h1>

      <p className="text-sm text-gray-700 text-center mt-2 w-full">
        Please provide your valid name and email.
      </p>

      <button className="h-10 border rounded-md mt-5 w-full text-center font-semibold">
        <FcGoogle
          size={20}
          className="inline-block mr-2"
        />
        Signup with Google
      </button>

      <div className="flex flex-row gap-2 justify-center items-center w-full mt-5">
        <hr className="bg-black/40 h-0.5 w-full" />
        <p>OR</p>
        <hr className="bg-black/40 h-0.5 w-full" />
      </div>

      <form className="flex flex-col gap-1">
        <label
          htmlFor="name"
          className="mt-4 font-semibold"
        >
          First name
        </label>
        <input
          type="text"
          id="name"
          name="firstname"
          value={formData.firstname}
          className="pl-3 rounded-md h-10 border"
          onChange={handleChange}
        />

        <label
          htmlFor="name"
          className="mt-4 font-semibold"
        >
          Last name
        </label>
        <input
          type="text"
          id="name"
          name="lastname"
          value={formData.lastname}
          className="pl-3 rounded-md h-10 border"
          onChange={handleChange}
        />

        <label
          htmlFor="Email"
          className="mt-4 font-semibold"
        >
          Email
        </label>
        <input
          type="Email"
          id="Email"
          name="email"
          value={formData.email}
          className="pl-3 rounded-md h-10 border"
          onChange={handleChange}
        />

        <button
          className={`h-10 mt-6 bg-blue-500 rounded-md`}
          onClick={(e) => {
            e.preventDefault();

            setNextStep(true);
          }}
        >
          Continue
        </button>
      </form>
    </div>
  );
}
