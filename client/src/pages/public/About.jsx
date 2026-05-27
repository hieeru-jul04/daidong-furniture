import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaTruck, FaShieldAlt, FaAward, FaUsers, FaLightbulb, FaHeart, FaStar, FaCheck } from 'react-icons/fa';

const About = () => {
  const { t } = useTranslation();
  const features = [
    {
      icon: FaTruck,
      title: t('about.diff_1_title'),
      description: t('about.diff_1_desc')
    },
    {
      icon: FaShieldAlt,
      title: t('about.diff_2_title'), 
      description: t('about.diff_2_desc')
    },
    {
      icon: FaAward,
      title: t('about.diff_3_title'),
      description: t('about.diff_3_desc')
    }
  ];

  const values = [
    {
      icon: FaLightbulb,
      title: t('about.tenet_1_title'),
      description: t('about.tenet_1_desc')
    },
    {
      icon: FaHeart,
      title: t('about.tenet_2_title'),
      description: t('about.tenet_2_desc')
    },
    {
      icon: FaUsers,
      title: t('about.tenet_3_title'),
      description: t('about.tenet_3_desc')
    }
  ];

  const stats = [
    { number: "25+", label: t('about.stats_years') },
    { number: "10K+", label: t('about.stats_spaces') },
    { number: "500+", label: t('about.stats_pieces') },
    { number: "24/7", label: t('about.stats_support') }
  ];

  const team = [
    {
      name: "Eleanor Vance",
      role: t('about.team_1_role'),
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: t('about.team_1_desc')
    },
    {
      name: "Arthur Chen", 
      role: t('about.team_2_role'),
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: t('about.team_2_desc')
    },
    {
      name: "Isabella Rossi",
      role: t('about.team_3_role'), 
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: t('about.team_3_desc')
    },
    {
      name: "Marcus Sterling",
      role: t('about.team_4_role'),
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", 
      description: t('about.team_4_desc')
    }
  ];

  const testimonials = [
    {
      name: "Victoria Kensington",
      rating: 5,
      text: "The bespoke sofa we commissioned is simply breathtaking. The attention to detail and the quality of the velvet are unparalleled. A true masterpiece.",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Jonathan Pierce",
      rating: 5,
      text: "Exceptional from start to finish. The white-glove delivery was flawless, and the dining table has become the stunning centerpiece of our home.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    },
    {
      name: "Madeleine Dubois",
      rating: 5,
      text: "I was looking for something truly unique for my study. The artisan armchair I received is not just furniture; it's functional art.",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80"
    }
  ];

  return (
    <div className="min-h-screen bg-daidong-white">
      {/* Hero Section */}
      <section className="relative bg-daidong-black text-daidong-white pt-40 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
            <img src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight drop-shadow-lg">{t('about.hero_title')}</h1>
            <p className="text-xl leading-relaxed mb-10 text-daidong-light-gray font-medium max-w-3xl mx-auto opacity-90">
              {t('about.hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to={"/shop"} className="bg-daidong-red text-daidong-white px-10 py-4 uppercase tracking-wider text-sm font-bold rounded-full hover:bg-daidong-red-dark transition-all duration-300 shadow-lg transform hover:-translate-y-1">
                {t('about.btn_discover')}
              </Link>
              <Link to={"/contact"} className="bg-daidong-white text-daidong-black px-10 py-4 uppercase tracking-wider text-sm font-bold rounded-full hover:bg-daidong-light-gray transition-all duration-300 shadow-lg transform hover:-translate-y-1">
                {t('about.btn_contact')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-daidong-white">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-8 text-daidong-black">{t('about.story_title')}</h2>
                <div className="w-16 h-1 bg-daidong-red mb-8 rounded-full"></div>
                <div className="space-y-6 text-daidong-gray font-medium leading-relaxed text-lg text-justify">
                  <p>
                    {t('about.story_p1')}
                  </p>
                  <p>
                    {t('about.story_p2')}
                  </p>
                  <p>
                    {t('about.story_p3')}
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-daidong-red translate-x-6 translate-y-6 rounded-[2rem]"></div>
                <img 
                  src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Our heritage atelier" 
                  className="relative z-10 rounded-[2rem] shadow-2xl w-full object-cover h-[500px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-daidong-black text-daidong-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-5xl md:text-6xl font-bold text-daidong-red mb-4 group-hover:scale-110 transition-transform duration-300">{stat.number}</div>
                <div className="text-daidong-light-gray uppercase tracking-wider text-sm font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-daidong-light-gray">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-daidong-black mb-4">{t('about.tenets_title')}</h2>
            <div className="w-16 h-1 bg-daidong-red mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {values.map((value, index) => (
              <div key={index} className="bg-daidong-white p-12 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
                <div className="text-daidong-red mb-8 group-hover:scale-110 transition-transform duration-300">
                  <value.icon size={56} />
                </div>
                <h3 className="text-2xl font-bold text-daidong-black mb-4">{value.title}</h3>
                <p className="text-daidong-gray font-medium leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-daidong-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-daidong-black mb-4">{t('about.diff_title')}</h2>
            <div className="w-16 h-1 bg-daidong-red mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-daidong-light-gray w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-daidong-red transition-colors duration-300 shadow-sm group-hover:shadow-lg">
                  <feature.icon size={36} className="text-daidong-red group-hover:text-daidong-white transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-daidong-black mb-4">{feature.title}</h3>
                <p className="text-daidong-gray font-medium leading-relaxed max-w-sm mx-auto">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-daidong-black text-daidong-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t('about.testimonials_title')}</h2>
            <div className="w-16 h-1 bg-daidong-red mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-daidong-dark-gray p-10 rounded-[2rem] shadow-xl relative transform hover:-translate-y-2 transition-transform duration-300">
                <div className="text-daidong-red opacity-20 absolute top-6 right-8 text-8xl font-serif leading-none">"</div>
                <div className="flex mb-6 relative z-10">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} size={16} className="text-daidong-red fill-current mr-1" />
                  ))}
                </div>
                <p className="text-daidong-light-gray mb-8 italic leading-relaxed font-medium relative z-10 text-lg">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center relative z-10">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full mr-4 object-cover border-2 border-daidong-red"
                  />
                  <div>
                    <div className="font-bold text-lg">{testimonial.name}</div>
                    <div className="text-xs uppercase tracking-wider text-daidong-red mt-1 font-bold">{t('about.client_tag')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-32 bg-daidong-red text-daidong-white relative overflow-hidden">
        <div className="absolute inset-0 bg-daidong-black opacity-10"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{t('about.cta_title')}</h2>
          <p className="text-xl mb-12 font-medium max-w-2xl mx-auto opacity-90">
            {t('about.cta_desc')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/shop" className="bg-daidong-black text-daidong-white px-10 py-5 uppercase tracking-wider text-sm font-bold rounded-full hover:bg-daidong-dark-gray transition-all duration-300 shadow-lg transform hover:-translate-y-1">
              {t('about.btn_explore')}
            </Link>
            <Link to="/contact" className="bg-daidong-white text-daidong-red px-10 py-5 uppercase tracking-wider text-sm font-bold rounded-full hover:bg-daidong-light-gray transition-all duration-300 shadow-lg transform hover:-translate-y-1">
              {t('about.btn_request')}
            </Link>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default About;