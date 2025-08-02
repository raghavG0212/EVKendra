import { Button, Label, Spinner, TextInput } from "flowbite-react";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { setCurrentUser } from "../../redux/authSlice";
import { toast } from "react-toastify";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";

export default function AdminProfile() {
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [username, setUsername] = useState(currentUser?.name || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [editDetails, setEditDetails] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `/api/v1/admin/update-admin/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: username, password: password }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        dispatch(setCurrentUser(data.admin));
        setEditDetails(false);
        setPassword("");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred while updating admin details");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex-grow">
      <div className="flex flex-col items-center p-3 shadow m-6 sm:m-12 border dark:border-blue-950 rounded-lg min-h-screen">
        <h1 className="text-center uppercase font-semibold text-4xl mt-10">
          Your profile
        </h1>
        <div className="rounded-full border-2 border-black dark:border-white bg-purple-700 h-24 w-24 flex items-center justify-center my-7 ">
          <img src="/admin.webp" alt="admin-image" className="h-20 w-20" />
        </div>
        <div>
          <form onSubmit={handleUpdate}>
            <div className="min-w-96 my-5">
              <div className="block my-4 text-center">
                <Label
                  htmlFor="username"
                  value="Your Name"
                  className="text-xl"
                />
              </div>
              <TextInput
                id="username"
                type="text"
                placeholder="Your Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!editDetails}
              />
            </div>
            {editDetails && (
              <div className="min-w-96 my-5">
                <div className="my-4 block text-center">
                  <Label
                    htmlFor="password"
                    value="Your Password"
                    className="text-xl"
                  />
                </div>
                <div className="relative">
                  <input
                    id="password"
                    placeholder="Your Password"
                    type={!showPassword ? "text" : "password"}
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
            )}
            {!editDetails && (
              <Button
                className="w-full mt-8 mb-20"
                onClick={() => setEditDetails((prevState) => !prevState)}
                gradientDuoTone="redToYellow"
                outline
              >
                Edit Details
              </Button>
            )}
            {editDetails && (
              <Button
                type="submit"
                color="success"
                className={`w-full mb-20 mt-8`}
                gradientDuoTone="redToYellow"
                disabled={loading}
                outline
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
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
