import { useState } from "react";
import { useDispatch } from "react-redux";
import { setAdmin, setCurrentUser } from "../redux/authSlice";
import {
  Button,
  Checkbox,
  Label,
  TextInput,
  Spinner,
  Modal,
} from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function AdminLogin() {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/v1/admin/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        dispatch(setAdmin(true));
        dispatch(setCurrentUser(data.user));
        setShowModal(true);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <div className="flex min-h-screen lg:justify-between justify-center">
      <div className="hidden bg-blue-100 dark:bg-blue-200 h-screen w-1/2 left-0 lg:flex justify-center items-center m-1">
        <img
          src="/Electronic-Voting-Blog---Image----1-.png"
          alt="sign-in"
          className="size-full shadow-sm shadow-blue-500"
        />
      </div>
      <div className="flex flex-grow justify-center items-center">
        <div className="text-center">
          <div className="text-center">
            <div className="font-medium text-4xl mb-20 mt-12 capitalize flex flex-col">
              <span>Welcome Admin</span>
              <span className="text-blue-600 italic">
                log into your account
              </span>
            </div>
            <form
              className="flex max-w-md flex-col gap-4 mt-4 w-80 items-center sm:items-start"
              onSubmit={handleSubmit}
            >
              <div className="sm:flex space-x-10">
                <div className="block mt-2">
                  <Label
                    htmlFor="username"
                    value="Username"
                    className="text-md"
                  />
                </div>
                <TextInput
                  id="username"
                  type="text"
                  placeholder="Your Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-80 sm:w-64"
                />
              </div>
              <div className="sm:flex space-x-11">
                <div className="mt-2 block">
                  <Label
                    htmlFor="password"
                    value="Password"
                    className="text-md"
                  />
                </div>
                <div className="relative w-80 sm:w-64">
                  <input
                    id="password"
                    type={!showPassword ? "text" : "password"}
                    placeholder="Your Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-gray-50 dark:bg-gray-700 dark:placeholder:text-gray-400 placeholder:text-[15px] placeholder:font-sans dark:border-gray-600"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center">
                    {showPassword ? (
                      <AiFillEyeInvisible
                        className="text-xl cursor-pointer"
                        onClick={() =>
                          setShowPassword((prevState) => !prevState)
                        }
                      />
                    ) : (
                      <AiFillEye
                        className="text-xl cursor-pointer"
                        onClick={() =>
                          setShowPassword((prevState) => !prevState)
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Remember me</Label>
              </div>
              <Button
                type="submit"
                gradientDuoTone="purpleToBlue"
                disabled={loading}
                className="w-96 ml-8 sm:ml-0"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
            <div className="flex flex-row justify-center mt-3 mb-10">
              <h1>Not An Admin...?</h1>
              <div className="text-blue-400 hover:text-blue-700 ml-1">
                <Link to="/login">Click here</Link>
              </div>
            </div>
            <Modal show={showModal} size="md" popup onClose={handleModalClose}>
              <Modal.Header />
              <Modal.Body>
                <div className="text-center mx-auto space-y-5">
                  <div className="flex justify-center">
                    <FaCheckCircle color="green" size="50" />
                  </div>
                  <h3 className="mb-5 text-2xl font-semibold">
                    Login successful!
                  </h3>
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
        </div>
      </div>
    </div>
  );
}
