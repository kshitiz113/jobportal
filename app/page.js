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
                  initials: "PK",
                  name: "Pradeep Kumar Saran",
                  role: "Software Engineer at TechCorp",
                  color: "bg-blue-800 text-blue-300",
                  quote:
                    "CareerConnect helped me find my dream job in just two weeks. The platform is intuitive and the matching system really understands my skills.",
                },
                {
                  initials: "SS",
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
<footer className="w-full py-12 px-6 bg-black text-gray-400">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            CareerConnect
          </span>
        </h3>
        <p className="text-gray-400">
          Connecting top talent with world-class companies to build the future of work.
        </p>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">For Job Seekers</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:text-white transition">Browse Jobs</a></li>
          <li><a href="#" className="hover:text-white transition">Create Profile</a></li>
          <li><a href="#" className="hover:text-white transition">Job Alerts</a></li>
          <li><a href="#" className="hover:text-white transition">Career Advice</a></li>
          <li><a href="#" className="hover:text-white transition">Salary Calculator</a></li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">For Employers</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:text-white transition">Post a Job</a></li>
          <li><a href="#" className="hover:text-white transition">Browse Candidates</a></li>
          <li><a href="#" className="hover:text-white transition">Recruiting Solutions</a></li>
          <li><a href="#" className="hover:text-white transition">Pricing</a></li>
          <li><a href="#" className="hover:text-white transition">HR Resources</a></li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Company</h3>
        <ul className="space-y-2">
          <li><a href="#" className="hover:text-white transition">About Us</a></li>
          <li><a href="#" className="hover:text-white transition">Careers</a></li>
          <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
          <li><a href="#" className="hover:text-white transition">Press</a></li>
          <li><a href="#" className="hover:text-white transition">Blog</a></li>
        </ul>
      </div>
    </div>

    <div className="border-t border-gray-800 pt-8">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4 md:mb-0">
          <a href="#" className="text-sm hover:text-white transition">Privacy Policy</a>
          <span className="text-gray-600">•</span>
          <a href="#" className="text-sm hover:text-white transition">Terms of Service</a>
          <span className="text-gray-600">•</span>
          <a href="#" className="text-sm hover:text-white transition">Cookie Policy</a>
          <span className="text-gray-600">•</span>
          <a href="#" className="text-sm hover:text-white transition">GDPR</a>
        </div>
        <div className="text-center md:text-right">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} CareerConnect. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </div>
</footer>
       
      </div>
    </>
  );
}
