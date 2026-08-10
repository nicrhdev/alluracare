// src/app/[locale]/contact/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ContactPageProps {
  params: {
    locale: string;
  };
}

export default function ContactPage({ params }: ContactPageProps) {
  const { locale } = params;
  const isPersian = locale === 'fa';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate email sending
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, you would send to your API:
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData),
      // });

      setSubmitted(true);
      toast.success(isPersian ? '✅ پیام شما ارسال شد!' : '✅ Your message was sent!');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      toast.error(isPersian ? 'خطا در ارسال پیام' : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12" style={{ background: 'linear-gradient(180deg, #FFFFFF 0%, #EDEDFA 30%, #C1EODF 70%, #FFFFFF 100%)' }}>
      <div className="container-custom max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-sm font-medium text-white bg-[#874A58] px-4 py-1.5 rounded-full inline-block mb-3">
            {isPersian ? '📧 تماس با ما' : '📧 Contact Us'}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-2">
            {isPersian ? 'با ما در ارتباط باشید' : 'Get In Touch'}
          </h1>
          <p className="text-[#8A8A8A] max-w-md mx-auto">
            {isPersian
              ? 'ما دوست داریم از شما بشنویم! سوال، نظر یا بازخورد دارید؟'
              : 'We\'d love to hear from you! Have a question, comment, or feedback?'}
          </p>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-brand-secondary/20 p-6">
              <h3 className="font-semibold text-[#2D2D2D] mb-4">
                {isPersian ? 'اطلاعات تماس' : 'Contact Info'}
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#874A58] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#2D2D2D]">Email</p>
                    <p className="text-sm text-[#8A8A8A]">support@alluracare.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#874A58] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#2D2D2D]">Phone</p>
                    <p className="text-sm text-[#8A8A8A]">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#874A58] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-[#2D2D2D]">Address</p>
                    <p className="text-sm text-[#8A8A8A]">
                      {isPersian ? 'تهران، ایران' : 'Tehran, Iran'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#EDEDFA] to-[#C1EODF] rounded-xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-white/50 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💬</span>
              </div>
              <h4 className="font-semibold text-[#2D2D2D]">
                {isPersian ? 'پشتیبانی ۲۴/۷' : '24/7 Support'}
              </h4>
              <p className="text-sm text-[#8A8A8A]">
                {isPersian
                  ? 'تیم ما همیشه آماده کمک به شماست'
                  : 'Our team is always ready to help'}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-brand-secondary/20 p-6">
              <h3 className="font-semibold text-[#2D2D2D] mb-4">
                {isPersian ? 'ارسال پیام' : 'Send a Message'}
              </h3>

              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h4 className="font-semibold text-[#2D2D2D]">
                    {isPersian ? '✅ پیام شما ارسال شد!' : '✅ Message Sent!'}
                  </h4>
                  <p className="text-sm text-[#8A8A8A]">
                    {isPersian
                      ? 'از شما متشکریم! در اسرع وقت با شما تماس خواهیم گرفت.'
                      : 'Thank you! We\'ll get back to you as soon as possible.'}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                      {isPersian ? 'نام کامل' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={isPersian ? 'نام خود را وارد کنید' : 'Enter your name'}
                      className="w-full px-4 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition text-[#2D2D2D] placeholder:text-[#8A8A8A] bg-white/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                      {isPersian ? 'ایمیل' : 'Email'} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={isPersian ? 'ایمیل خود را وارد کنید' : 'Enter your email'}
                      className="w-full px-4 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition text-[#2D2D2D] placeholder:text-[#8A8A8A] bg-white/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                      {isPersian ? 'موضوع' : 'Subject'} *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder={isPersian ? 'موضوع پیام' : 'Message subject'}
                      className="w-full px-4 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition text-[#2D2D2D] placeholder:text-[#8A8A8A] bg-white/50"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                      {isPersian ? 'پیام' : 'Message'} *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder={isPersian ? 'پیام خود را بنویسید...' : 'Write your message...'}
                      className="w-full px-4 py-2.5 border border-brand-secondary/30 rounded-lg focus:ring-2 focus:ring-[#874A58] focus:border-transparent outline-none transition text-[#2D2D2D] placeholder:text-[#8A8A8A] bg-white/50 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-2.5 text-base flex items-center justify-center gap-2 group"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        {isPersian ? 'در حال ارسال...' : 'Sending...'}
                      </span>
                    ) : (
                      <>
                        {isPersian ? 'ارسال پیام' : 'Send Message'}
                        <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}