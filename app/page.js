"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>CareerConnect | Find Your Dream Job</title>
        <meta
          name="description"
          content="Connect with top employers and find your perfect job match"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div
        className={`min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-950 to-black transition-opacity duration-1000 ${
          isMounted ? "opacity-100" : "opacity-0"
        } text-white`}
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {/* Navigation */}
        <nav className="w-full py-4 px-6 bg-gray-800 shadow-md">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                CareerConnect
              </span>
            </Link>
            <div className="flex space-x-4">
              <Link
                href="/auth"
                className="px-4 py-2 text-gray-300 hover:text-white font-medium"
              >
                Sign In
              </Link>
              <Link
                href="/auth"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
              >
                Register
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex-grow flex items-center justify-center py-12 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
              Find Your{" "}
              <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                Dream Job
              </span>{" "}
              Today
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              Join thousands of companies and candidates connecting through our
              platform. Whether you're hiring or looking for work, we've got you
              covered.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/auth"
                className="px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-lg transition duration-300 transform hover:scale-105"
              >
                Browse Jobs
              </Link>
              <Link
                href="/auth"
                className="px-8 py-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-semibold text-lg shadow-lg border border-gray-600 transition duration-300 transform hover:scale-105"
              >
                Post a Job
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-6 bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Why Choose CareerConnect?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "10,000+ Jobs",
                  description:
                    "Access a wide range of job opportunities from top companies across various industries.",
                  iconColor: "text-blue-400",
                  bgColor: "bg-gray-800",
                  svg: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  ),
                },
                {
                  title: "Smart Matching",
                  description:
                    "Our AI-powered system matches your skills and preferences with the perfect job opportunities.",
                  iconColor: "text-indigo-400",
                  bgColor: "bg-gray-800",
                  svg: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  ),
                },
                {
                  title: "Quick Hiring",
                  description:
                    "Streamlined application process with direct communication to hiring managers.",
                  iconColor: "text-purple-400",
                  bgColor: "bg-gray-800",
                  svg: (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  ),
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className={`${feature.bgColor} p-8 rounded-xl hover:shadow-md transition`}
                >
                  <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-6 w-6 ${feature.iconColor}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      {feature.svg}
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-6 bg-gray-800">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              Success Stories
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  initials: "JS",
                  name: "Pradeep Kumar Saran",
                  role: "Software Engineer at TechCorp",
                  color: "bg-blue-800 text-blue-300",
                  quote:
                    "CareerConnect helped me find my dream job in just two weeks. The platform is intuitive and the matching system really understands my skills.",
                },
                {
                  initials: "AD",
                  name: "Shailendra Singh Mandal",
                  role: "HR Director at InnovateCo",
                  color: "bg-purple-800 text-purple-300",
                  quote:
                    "We've hired over 50 talented professionals through CareerConnect. The quality of candidates is exceptional and the hiring process is so efficient.",
                },
              ].map((testimonial, idx) => (
                <div
                  key={idx}
                  className="bg-gray-900 p-8 rounded-xl shadow-md text-gray-300"
                >
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center mr-4 font-bold`}
                    >
                      {testimonial.initials}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="italic">{testimonial.quote}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-6 bg-gradient-to-r from-blue-700 to-indigo-700 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to take the next step in your career?
            </h2>
            <p className="text-xl mb-8 text-indigo-200">
              Join thousands of professionals who found their dream jobs through
              our platform.
            </p>
            <Link
              href="/auth"
              className="inline-block px-8 py-4 rounded-lg bg-white hover:bg-gray-100 text-blue-700 font-semibold text-lg shadow-lg transition duration-300 transform hover:scale-105"
            >
              Get Started Now
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full py-8 px-6 bg-black text-gray-400">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">
                  CareerConnect
                </h3>
                <p className="mb-4">
                  Connecting talent with opportunity since 2023.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="hover:text-white">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="..." />
                    </svg>
                  </a>
                  {/* Add other icons here */}
                </div>
              </div>
              {/* Add additional footer columns here if needed */}
            </div>
            <p className="text-center text-sm text-gray-600">
              © 2025 CareerConnect. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
