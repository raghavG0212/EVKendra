import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  Label,
  TextInput,
  Select,
  Spinner,
  Modal,
} from "flowbite-react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function Login() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    phoneNo: "",
    aadharNo: "",
    password: "",
    nationality: "",
  });

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [vIDShow, setVIDShow] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/v1/voter/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseData = await response.json();
        setShowModal(true);
        setVIDShow(responseData.voterID);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/login");
  };
  return (
    <div className="flex min-h-screen lg:justify-between justify-center">
      <div className="hidden bg-blue-100 dark:bg-blue-200 w-1/2 left-0 lg:flex justify-center items-center m-1">
        <img
          src="/Electronic-Voting-Blog---Image----1-.png"
          alt="sign-in"
          className="size-full shadow-sm shadow-blue-500"
        />
      </div>
      <div className="text-center lg:mr-20">
        <div className="font-medium text-4xl mb-10 mt-12 capitalize flex flex-col">
          <span>Welcome to EVkendra</span>
          <span className="text-blue-600 italic">create your account</span>
        </div>
        <form
          onSubmit={handleSignup}
          className="flex flex-col gap-4 mt-4 items-center sm:items-start"
        >
          <div className="sm:flex sm:space-x-24">
            <div className="sm:mt-2 sm:mr-0.5">
              <Label className="text-md" htmlFor="name" value="Name" />
            </div>
            <TextInput
              id="name"
              type="text"
              placeholder="Your name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-80 sm:w-64"
            />
          </div>
          <div className="sm:flex sm:space-x-12">
            <div className="sm:mt-2 text-nowrap">
              <Label className="text-md" htmlFor="dob" value="Date of Birth" />
            </div>
            <TextInput
              id="dob"
              type="date"
              required
              value={formData.dob}
              onChange={handleChange}
              className="w-80 sm:w-64"
            />
          </div>
          <div className="sm:flex sm:space-x-16">
            <div className="sm:mt-2 text-nowrap">
              <Label className="text-md" htmlFor="phoneNo" value="Phone No." />
            </div>
            <TextInput
              id="phoneNo"
              type="tel"
              placeholder="Your phone number"
              required
              value={formData.phoneNo}
              onChange={handleChange}
              className="w-80 sm:w-64"
            />
          </div>
          <div className="sm:flex sm:space-x-14">
            <div className="sm:mt-2 text-nowrap sm:mr-0.5">
              <Label
                className="text-md"
                htmlFor="aadharNo"
                value="Aadhar No."
              />
            </div>
            <TextInput
              id="aadharNo"
              type="text"
              placeholder="Your Aadhar number"
              required
              value={formData.aadharNo}
              onChange={handleChange}
              className="w-80 sm:w-64"
            />
          </div>
          <div className="sm:flex sm:space-x-16">
            <div className="sm:mt-2 sm:mr-2">
              <Label className="text-md" htmlFor="password" value="Password" />
            </div>
            <div className="relative w-80 sm:w-64">
              <input
                id="password"
                type={!showPassword ? "text" : "password"}
                placeholder="Your Password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-gray-50 dark:bg-gray-700 dark:placeholder:text-gray-400 placeholder:text-[15px] placeholder:font-sans dark:border-gray-600"
              />
              <div className="absolute inset-y-0 right-3 flex items-center">
                {showPassword ? (
                  <AiFillEyeInvisible
                    className="text-2xl cursor-pointer dark:text-black"
                    onClick={() => setShowPassword((prevState) => !prevState)}
                  />
                ) : (
                  <AiFillEye
                    className="text-2xl cursor-pointer dark:text-black"
                    onClick={() => setShowPassword((prevState) => !prevState)}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="sm:flex sm:space-x-14">
            <div className="sm:mt-2 sm:mr-1">
              <Label
                className="text-md"
                htmlFor="nationality"
                value="Nationality"
              />
            </div>
            <Select
              id="nationality"
              required
              value={formData.nationality}
              onChange={handleChange}
              className="w-80 sm:w-64"
            >
              <option value="" disabled>
                Select your nationality
              </option>
              <option value="Indian">Indian</option>
              <option value="American">American</option>
              <option value="British">British</option>
            </Select>
          </div>
          <div className="flex gap-2 mt-3">
            <Checkbox id="remember" className="mt-1" />
            <Label htmlFor="remember" className="text-md">
              Remember me
            </Label>
          </div>
          <Button
            gradientDuoTone="purpleToBlue"
            type="submit"
            disabled={loading}
            className="w-[97%]"
          >
            {loading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>
        <div className="flex flex-row justify-center mt-3 mb-10">
          <h1>Have an account...?</h1>
          <div className="text-blue-400 hover:text-blue-700 ml-1">
            <Link to="/login">Click here</Link>
          </div>
        </div>
      </div>
      <Modal show={showModal} size="md" popup onClose={handleModalClose}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center mx-auto">
            <div className="flex justify-center mb-5">
              <FaCheckCircle color="green" size="50" />
            </div>
            <h3 className="mb-5 text-2xl font-semibold">
              Sign up successful !
            </h3>
            <div className="space-x-1 bg-slate-100 p-3 rounded-lg">
              <span className="text-red-600">*Please Note -</span>
              <span className="font-medium">Your Voter ID is {vIDShow}.</span>
            </div>
            <p className="mb-5 text-xs text-blue-600">
              Voter ID must be noted down for reference.
            </p>
            <div className="justify-center flex">
              <Button
                gradientDuoTone="tealToLime"
                onClick={handleModalClose}
                pill
              >
                OK
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
