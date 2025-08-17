'use client'
import Footer from "@/components/footer";
import Image from "next/image";
import Link from "next/link";

export default function Home() {


  return (
    <div className="min-h-screen bg-gray-100 font-sans">


      <section className="bg-blue-500 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Madad Sab ke liye</h2>
          <p className="text-lg md:text-xl mb-6">
            A community platform to help each other without expecting anything in return.
          </p>
          <div className="flex justify-center">
            <Image
              src="https://source.unsplash.com/random/800x400/?community"
              alt="Community helping"
              width={800}
              height={400}
              className="rounded-lg shadow-lg"
            />
          </div>
          <Link
            href="#get-started"
            className="mt-6 inline-block bg-yellow-500 text-black px-6 py-3 rounded-lg hover:bg-yellow-600"
          >
            Get Started
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">About Web Madad</h2>
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <Image
                src="https://source.unsplash.com/random/600x400/?helping"
                alt="Helping hands"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 md:pl-8">
              <p className="text-lg">
                Web Madad is a platform where people come together to offer and request help selflessly. Whether you need assistance or want to lend a hand, our community connects you with others who share the spirit of giving without expecting rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Help Section */}
      <section id="offer" className="bg-gray-200 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Offer Your Help</h2>
          <div className="flex flex-col md:flex-row-reverse items-center">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <Image
                src="https://source.unsplash.com/random/600x400/?volunteer"
                alt="Volunteering"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2 md:pr-8">
              <p className="text-lg">
                Have a skill or resource to share? Post what you can offer, from tutoring to fixing something, and let others in the community benefit from your generosity.
              </p>
              <Link
                href="/offer"
                className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
              >
                Post an Offer
              </Link>
            </div>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
}