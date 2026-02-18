export default function Home() {
  return (
    <div className="w-full">

      {/* HERO SECTION */}
      <section className="bg-indigo-700 text-white py-24 px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">

          {/* LEFT TEXT */}
          <div>
            <h1 className="text-4xl font-bold mb-4">
              College Directory Management System
            </h1>
            <p className="text-lg opacity-90">
              A centralized platform designed to efficiently manage student
              and faculty information, streamline administrative operations,
              and provide real-time academic insights.
            </p>
            <button className="mt-8 bg-white text-indigo-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition">
              Explore Dashboard
            </button>
          </div>

          {/* RIGHT IMAGE */}
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
            alt="College Students"
            className="rounded-xl shadow-xl"
          />
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-gray-50 text-center px-6">
        <h2 className="text-3xl font-semibold mb-12">Core Functionalities</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          <FeatureCard
            img="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
            title="Student Records"
            desc="Create, update, and maintain comprehensive student profiles with secure data handling and instant updates."
          />

          <FeatureCard
            img="https://cdn-icons-png.flaticon.com/512/1995/1995574.png"
            title="Faculty Management"
            desc="Organize faculty information, departmental assignments, and academic responsibilities efficiently."
          />

          <FeatureCard
            img="https://cdn-icons-png.flaticon.com/512/1828/1828919.png"
            title="Analytics & Reports"
            desc="Visualize institutional data through interactive charts and dashboards for better decisions."
          />
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-20 px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">

          {/* IMAGE */}
          <img
            src="https://images.unsplash.com/photo-1497493292307-31c376b6e479"
            alt="Administration Office"
            className="rounded-xl shadow-lg"
          />

          {/* TEXT */}
          <div>
            <h2 className="text-3xl font-semibold mb-6">About the Platform</h2>
            <p className="text-gray-600 leading-relaxed">
              The College Directory Management System simplifies academic
              administration by providing a unified interface for managing
              institutional records. It enhances transparency, reduces manual
              workload, and ensures accurate data accessibility for
              administrators, faculty, and students.
            </p>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-indigo-100 py-20 text-center px-6">
        <h2 className="text-3xl font-semibold mb-12">Institution Overview</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <StatCard number="500+" label="Active Students" />
          <StatCard number="45+" label="Faculty Members" />
          <StatCard number="10+" label="Departments" />
        </div>
      </section>

    </div>
  );
}

/* ---------- COMPONENTS ---------- */

function FeatureCard({ img, title, desc }) {
  return (
    <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition">
      <img src={img} alt={title} className="w-16 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <h3 className="text-4xl font-bold text-indigo-700 mb-2">{number}</h3>
      <p className="text-gray-700 font-medium">{label}</p>
    </div>
  );
}
