import Link from 'next/link'
import { ArrowRight, Heart, Shield, Clock, Users } from 'lucide-react'

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-white to-secondary/5 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-heading font-bold text-foreground mb-6">
              Empowering{' '}
              <span className="text-primary">Personal Health</span>
            </h1>
            <p className="text-lg text-muted mb-8 leading-relaxed">
              At Aliento, we believe healthcare should be personalised, compassionate,
              and accessible. Experience the future of medicine with our cutting-edge
              approach to your wellbeing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
              >
                Book a Consultation
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/services"
                className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-semibold hover:bg-primary/5 transition-colors inline-flex items-center justify-center"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">Our Services</h2>
            <p className="text-muted max-w-2xl mx-auto">
              Comprehensive healthcare designed around you and your family.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Heart, title: 'Consultations', desc: 'Personalised one-on-one sessions with our experienced practitioners.' },
              { icon: Shield, title: 'Diagnostics', desc: 'Advanced diagnostic tools for accurate and timely health assessments.' },
              { icon: Clock, title: 'Treatment', desc: 'Customised treatment plans tailored to your unique health needs.' },
              { icon: Users, title: 'Follow-up Care', desc: 'Ongoing support and monitoring to ensure lasting health outcomes.' },
            ].map((service) => (
              <div
                key={service.title}
                className="group p-6 bg-background rounded-2xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="text-primary" size={24} />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">{service.title}</h3>
                <p className="text-muted leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Trust Section */}
      <section className="py-20 bg-surface-raised">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6">
              Why Choose Aliento?
            </h2>
            <p className="text-muted text-lg mb-12 leading-relaxed">
              We combine cutting-edge medical technology with genuine human compassion.
              Our patient-centred approach means you're never just a number — you're
              a partner in your own health journey.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { number: '10+', label: 'Years Experience' },
                { number: '5000+', label: 'Patients Helped' },
                { number: '98%', label: 'Patient Satisfaction' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl lg:text-5xl font-heading font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-6">
            Ready to Start Your Health Journey?
          </h2>
          <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
            Book a consultation with our team and discover how personalised
            healthcare can transform your life.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold hover:bg-white/90 transition-colors"
          >
            Get in Touch
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  )
}
