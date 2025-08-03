import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Checkbox,
  Label,
  TextInput,
  Spinner,
  Modal,
  Select,
} from "flowbite-react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { GiCrossMark } from "react-icons/gi";
import { MdDone, MdDoneAll } from "react-icons/md";
import { LiaExclamationSolid } from "react-icons/lia";

export default function Login() {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    phoneNo: "",
    aadharNo: "",
    password: "",
    nationality: "",
  });
  const [eligible, setEligible] = useState({
    dob: false,
    phoneNo: false,
    aadharNo: false,
    password: false,
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [vIDShow, setVIDShow] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const reqMet =
    eligible.dob && eligible.phoneNo && eligible.aadharNo && eligible.password;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    const updatedFormData = { ...formData, [id]: value };
    setFormData(updatedFormData);

    const birthDate = new Date(updatedFormData.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    setEligible({
      dob: age >= 18,
      phoneNo: /^\d{10}$/.test(updatedFormData.phoneNo.trim()),
      aadharNo: /^\d{12}$/.test(updatedFormData.aadharNo.trim()),
      password: updatedFormData.password.length >= 8,
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
      <div className="flex flex-grow justify-center">
        <div>
          <div className="text-center font-medium text-4xl mb-10 mt-12 capitalize flex flex-col">
            <span>Welcome to EVkendra</span>
            <span className="text-blue-600 italic">create your account</span>
          </div>
          <form
            onSubmit={handleSignup}
            className="flex flex-col gap-4 mt-4 items-center sm:items-start text-center"
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
                <Label
                  className="text-md"
                  htmlFor="dob"
                  value="Date of Birth"
                />
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
                <Label
                  className="text-md"
                  htmlFor="phoneNo"
                  value="Phone No."
                />
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
                <Label
                  className="text-md"
                  htmlFor="password"
                  value="Password"
                />
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
                <option value="Others">Others</option>
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
              className="w-[100%]"
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
          <div
            className={`p-4 mt-3 rounded-md transition-all duration-200 ease-in-out overflow-hidden transform ${
              reqMet ? "bg-green-200" : "bg-red-200"
            } ${
              formData.dob ||
              formData.aadharNo ||
              formData.phoneNo ||
              formData.password
                ? "max-h-96 opacity-100 scale-100"
                : "max-h-0 opacity-0 scale-95"
            }`}
          >
            {reqMet ? (
              <div
                className={`flex flex-row gap-2  text-green-600 items-center`}
              >
                <MdDoneAll className=" size-5 mt-0.5" />
                <div className="capitalize font-semibold text-xl">
                  Good to go
                </div>
              </div>
            ) : (
              <div className={`flex flex-row   text-red-600 items-center`}>
                <div className="font-semibold text-xl">Hey User</div>
                <LiaExclamationSolid className=" size-5 mt-0.5" />
              </div>
            )}
            <div className="mt-5 font-medium flex flex-col ">
              {formData.dob ? (
                <>
                  {eligible.dob ? (
                    <div className="flex flex-row items-center gap-3 text-green-600">
                      <MdDone className="mt-0.5" />
                      <span className="text-[19px]">Age 18+</span>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center gap-3 text-red-600">
                      <GiCrossMark className="mt-0.5" />
                      <span className="text-[19px]">Age 18+</span>
                    </div>
                  )}
                </>
              ) : (
                <></>
              )}
              {formData.phoneNo ? (
                <>
                  {" "}
                  {eligible.phoneNo ? (
                    <div className="flex flex-row items-center gap-3 text-green-600">
                      <MdDone className="mt-0.5" />
                      <span className="text-[19px]">
                        Phone no. must be of 10 digits
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center gap-3 text-red-600">
                      <GiCrossMark className="mt-0.5" />
                      <span className="text-[19px]">
                        Phone no. must be of 10 digits
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <></>
              )}
              {formData.aadharNo ? (
                <>
                  {eligible.aadharNo ? (
                    <div className="flex flex-row items-center gap-3 text-green-600">
                      <MdDone className="mt-0.5" />
                      <span className="text-[19px]">
                        Aadhar no. must be of 12 digits
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center gap-3 text-red-600">
                      <GiCrossMark className="mt-0.5" />
                      <span className="text-[19px]">
                        Aadhar no. must be of 12 digits
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <></>
              )}
              {formData.password ? (
                <>
                  {" "}
                  {eligible.password ? (
                    <div className="flex flex-row items-center gap-3 text-green-600">
                      <MdDone className="mt-0.5" />
                      <span className="text-[19px]">
                        Password length must be 8+
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-row items-center gap-3 text-red-600">
                      <GiCrossMark className="mt-0.5" />
                      <span className="text-[19px]">
                        Password length must be 8+
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="flex flex-row justify-center mt-3 mb-10">
            <h1>Have an account...?</h1>
            <div className="text-blue-400 hover:text-blue-700 ml-1">
              <Link to="/login">Click here</Link>
            </div>
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
