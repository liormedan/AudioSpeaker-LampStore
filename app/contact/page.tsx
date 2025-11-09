"use client"

import type React from "react"

import { useState } from "react"
import { Navigation } from "@/components/navigation"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would typically send the form data to your backend
    alert("Thank you for your message! We will get back to you soon.")
    setFormData({ name: "", email: "", phone: "", message: "" })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1d23] to-[#0f1115] text-white">
      <Navigation />

      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent">
              Get In Touch
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Visit our showroom, contact our design team, or inquire about custom lighting solutions
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-8 text-amber-400">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-amber-400 transition-all text-white placeholder-white/40"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-amber-400 transition-all text-white placeholder-white/40"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-white/80 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-amber-400 transition-all text-white placeholder-white/40"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-amber-400 transition-all text-white placeholder-white/40 resize-none"
                    placeholder="Tell us about your lighting needs..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/30"
                >
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              {/* Showroom */}
              <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-amber-400">Showroom Location</h3>
                    <p className="text-white/70 leading-relaxed">
                      123 Design Avenue
                      <br />
                      Manhattan, New York
                      <br />
                      NY 10001, USA
                    </p>
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🕐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-amber-400">Opening Hours</h3>
                    <p className="text-white/70 leading-relaxed">
                      Monday - Friday: 9:00 AM - 7:00 PM
                      <br />
                      Saturday: 10:00 AM - 6:00 PM
                      <br />
                      Sunday: 12:00 PM - 5:00 PM
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10 p-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-amber-400">Contact Details</h3>
                    <p className="text-white/70 leading-relaxed">
                      Phone: +1 (555) 123-4567
                      <br />
                      Email: info@lumiere.com
                      <br />
                      Support: support@lumiere.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointment */}
              <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 backdrop-blur-xl rounded-3xl border border-amber-400/30 p-8">
                <h3 className="text-xl font-bold mb-3 text-amber-400">Book a Private Consultation</h3>
                <p className="text-white/70 mb-4 leading-relaxed">
                  Schedule a one-on-one session with our lighting designers to create the perfect ambiance for your
                  space.
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/30">
                  Schedule Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
