import { Link, useLocation, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { TbFidgetSpinner } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import useAuth from "../../hooks/useAuth";
import { imageUpload, saveOrUpdateUser } from "../../utils";
import { MdOutlineReportProblem } from "react-icons/md";

const SignUp = () => {
  const { createUser, updateUserProfile, signInWithGoogle, loading } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const { name, email, password, image } = data;
    const imageFile = image?.[0];
    try {
      const imageURL = imageFile ? await imageUpload(imageFile) : undefined;
      await createUser(email, password);
      await updateUserProfile(name, imageURL);
      await saveOrUpdateUser({ name, email, image: imageURL });
      toast.success("Signup Successful");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { user } = await signInWithGoogle();
      await saveOrUpdateUser({
        name: user?.displayName,
        email: user?.email,
        image: user?.photoURL,
      });
      toast.success("Signup Successful");
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err?.message || "Google sign in failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="flex flex-col max-w-md w-full p-8 rounded-2xl shadow-lg bg-white text-gray-900">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-3">
            <MdOutlineReportProblem className="text-blue-600 text-5xl" />
          </div>
          <h1 className="text-3xl font-bold text-blue-700">Create Account</h1>
          <p className="text-sm text-gray-400 mt-1">
            Join CivicFix – Report. Track. Resolve.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              type="text"
              placeholder="Your full name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-400 bg-gray-50"
              {...register("name", {
                required: "Name is required",
                maxLength: { value: 40, message: "Name too long" },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Image */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-500
                file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0
                file:font-semibold file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100 border border-dashed border-blue-300 rounded-lg py-2"
              {...register("image")}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-400 bg-gray-50"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-blue-400 bg-gray-50"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "At least 6 characters required",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 w-full rounded-lg py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            {loading ? (
              <TbFidgetSpinner className="animate-spin mx-auto" />
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200"></div>
          <p className="text-sm text-gray-400">or</p>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <div
          onClick={handleGoogleSignIn}
          className="flex justify-center items-center gap-3 border border-gray-300
            rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition"
        >
          <FcGoogle size={24} />
          <p className="font-medium">Continue with Google</p>
        </div>

        <p className="mt-5 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
