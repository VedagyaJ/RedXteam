import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    rating: 5,
    text: "RedXteam has been a game-changer for our security posture. The quality of the bug reports and the responsiveness of the researchers have been exceptional.",
    author: {
      name: "David Miller",
      title: "CISO, FinTech Banking",
      initials: "DM"
    }
  },
  {
    rating: 4.5,
    text: "As a security researcher, I've tried several platforms, but RedXteam stands out for its fair bounties and transparent communication. The dashboard is intuitive and makes tracking my submissions easy.",
    author: {
      name: "Elena Kowalski",
      title: "Security Researcher",
      initials: "EK"
    }
  },
  {
    rating: 5,
    text: "The quality of bug reports we receive through RedXteam is consistently high. The platform's verification process ensures we only deal with valid vulnerabilities, saving our team valuable time.",
    author: {
      name: "James Wong",
      title: "Security Lead, SecureCloud",
      initials: "JW"
    }
  }
];

export default function Testimonials() {
  return (
    <section className="py-16 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">What Our Community Says</h2>
          <p className="text-neutral-300 max-w-2xl mx-auto">
            Join thousands of security researchers and organizations who trust RedXteam
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mb-1">
                  {Array(Math.floor(testimonial.rating)).fill(0).map((_, i) => (
                    <Star key={i} className="fill-current" size={16} />
                  ))}
                  {testimonial.rating % 1 > 0 && (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-yellow-400">
                      <path fill="currentColor" d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      <path fill="currentColor" d="M12 2V17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  )}
                  {Array(5 - Math.ceil(testimonial.rating)).fill(0).map((_, i) => (
                    <Star key={i} size={16} />
                  ))}
                </div>
              </div>
              <p className="text-neutral-300 mb-4">{testimonial.text}</p>
              <div className="flex items-center mt-4">
                <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center">
                  <span className="text-xs font-medium">{testimonial.author.initials}</span>
                </div>
                <div className="ml-3">
                  <div className="font-medium text-white">{testimonial.author.name}</div>
                  <div className="text-sm text-neutral-400">{testimonial.author.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
