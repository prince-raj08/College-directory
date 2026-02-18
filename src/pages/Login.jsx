export default function Login() {
  return (
    <div className="flex justify-center mt-20">
      <div className="bg-white shadow p-8 rounded w-80">
        <h2 className="text-xl font-bold mb-4">Login</h2>

        <input className="border p-2 w-full mb-3" placeholder="Email" />
        <input type="password" className="border p-2 w-full mb-3" placeholder="Password" />

        <button className="bg-indigo-600 text-white w-full py-2 rounded">
          Login
        </button>
      </div>
    </div>
  );
}
