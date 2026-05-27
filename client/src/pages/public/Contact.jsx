import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaPaperPlane, FaInstagram, FaFacebookF, FaPinterestP } from 'react-icons/fa';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert(t('contact.success_msg'));
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: t('contact.info_1_title'),
      details: t('contact.info_1_desc')
    },
    {
      icon: FaPhone,
      title: t('contact.info_2_title'),
      details: "0908 099 708 - 0913 099 708"
    },
    {
      icon: FaEnvelope,
      title: t('contact.info_3_title'),
      details: "noithatdaidong84@gmail.com"
    },
    {
      icon: FaClock,
      title: t('contact.info_4_title'),
      details: t('contact.info_4_desc')
    }
  ];

  return (
    <div className="min-h-screen bg-daidong-white">
      {/* Hero Section */}
      <section className="relative bg-daidong-black text-daidong-white pt-40 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img src="https://images.unsplash.com/photo-1574739782594-db4ead022697?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Contact Background" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg">{t('contact.hero_title')}</h1>
            <p className="text-xl leading-relaxed mb-8 text-daidong-light-gray font-medium opacity-90">
              {t('contact.hero_subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-24 bg-daidong-light-gray">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
              
              {/* Contact Information Sidebar */}
              <div className="lg:col-span-2 space-y-12 bg-daidong-white p-12 rounded-[2rem] shadow-sm">
                <div>
                  <h2 className="text-3xl font-bold text-daidong-black mb-8">{t('contact.details_title')}</h2>
                  <div className="space-y-8">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start group">
                        <div className="text-daidong-red mt-1 mr-6 bg-daidong-light-gray p-4 rounded-full group-hover:bg-daidong-red group-hover:text-daidong-white transition-colors duration-300">
                          <info.icon size={24} />
                        </div>
                        <div className="pt-2">
                          <h3 className="text-lg font-bold text-daidong-black mb-1">{info.title}</h3>
                          <p className="text-daidong-gray font-medium">{info.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-daidong-border">
                  <h3 className="text-xl font-bold text-daidong-black mb-6">{t('contact.follow_title')}</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="w-12 h-12 bg-daidong-light-gray rounded-full flex items-center justify-center text-daidong-gray hover:bg-daidong-red hover:text-daidong-white hover:shadow-md transition-all duration-300">
                      <FaInstagram size={20} />
                    </a>
                    <a href="#" className="w-12 h-12 bg-daidong-light-gray rounded-full flex items-center justify-center text-daidong-gray hover:bg-daidong-red hover:text-daidong-white hover:shadow-md transition-all duration-300">
                      <FaPinterestP size={20} />
                    </a>
                    <a href="#" className="w-12 h-12 bg-daidong-light-gray rounded-full flex items-center justify-center text-daidong-gray hover:bg-daidong-red hover:text-daidong-white hover:shadow-md transition-all duration-300">
                      <FaFacebookF size={20} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-3 bg-daidong-white p-10 md:p-14 shadow-xl rounded-[2rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-daidong-red opacity-10 rounded-bl-full pointer-events-none"></div>
                <h2 className="text-3xl font-bold text-daidong-black mb-8">{t('contact.form_title')}</h2>
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label htmlFor="name" className="block text-daidong-gray text-sm uppercase tracking-wider mb-3 font-bold">
                        {t('contact.form_name')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-6 py-4 bg-daidong-light-gray border-none focus:ring-2 focus:ring-daidong-red text-daidong-black transition-all rounded-full font-medium placeholder-daidong-gray"
                        placeholder={t('contact.form_name_ph')}
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-daidong-gray text-sm uppercase tracking-wider mb-3 font-bold">
                        {t('contact.form_phone')}
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-6 py-4 bg-daidong-light-gray border-none focus:ring-2 focus:ring-daidong-red text-daidong-black transition-all rounded-full font-medium placeholder-daidong-gray"
                        placeholder={t('contact.form_phone_ph')}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-daidong-gray text-sm uppercase tracking-wider mb-3 font-bold">
                      {t('contact.form_email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-6 py-4 bg-daidong-light-gray border-none focus:ring-2 focus:ring-daidong-red text-daidong-black transition-all rounded-full font-medium placeholder-daidong-gray"
                      placeholder={t('contact.form_email_ph')}
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-daidong-gray text-sm uppercase tracking-wider mb-3 font-bold">
                      {t('contact.form_msg')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-6 py-4 bg-daidong-light-gray border-none focus:ring-2 focus:ring-daidong-red text-daidong-black transition-all rounded-[2rem] font-medium resize-none placeholder-daidong-gray"
                      placeholder={t('contact.form_msg_ph')}
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="bg-daidong-red text-daidong-white px-10 py-5 uppercase tracking-wider text-sm font-bold rounded-full hover:bg-daidong-red-dark transition-all duration-300 w-full sm:w-auto flex items-center justify-center space-x-3 shadow-lg transform hover:-translate-y-1"
                    >
                      <span>{t('contact.btn_submit')}</span>
                      <FaPaperPlane className="text-xs" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-daidong-white pb-0">
        <div className="h-[600px] w-full relative grayscale hover:grayscale-0 transition-all duration-1000">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.2022346437752!2d105.80402657460556!3d21.028174180621!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab00240f9d4b%3A0xd105bd1a99f4e51c!2zTuG7mWkgdGjhuqV0IMSQ4bqhaSDEkOG7k25n!5e1!3m2!1svi!2s!4v1779684156073!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
            title="Winboss Flagship Location"
          />
        </div>
      </section>
    </div>
  );
};

export default Contact;