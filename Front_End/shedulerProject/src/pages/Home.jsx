import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";

function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">

      

      <main className="flex flex-1 flex-col items-center justify-center text-center px-6">

        <img
          src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png"
          alt="task"
          className="w-48 mb-6"
        />

        <h2 className="text-4xl font-bold mb-4">
          Manage Your Tasks Easily
        </h2>

        <p className="text-gray-400 max-w-xl">
          Plan your schedule, organize tasks, and stay productive every day.
        </p>

      </main>

      

    </div>
  );
}

export default Home;