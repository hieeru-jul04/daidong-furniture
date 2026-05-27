import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { useTranslation } from 'react-i18next';
import Logo from '../shared/Logo';

const Footer = () => {
    const [email, setEmail] = useState('');
    const { t } = useTranslation();

    return (
        <footer className="bg-daidong-black text-daidong-white py-20 border-t border-daidong-dark-gray">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="mb-6">
                            <Logo className="text-daidong-white" textClassName="text-3xl" />
                        </div>
                        <p className="text-sm font-medium leading-relaxed text-daidong-gray mb-8">
                            {t('footer.about_desc')}
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com/noithatdaidong" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-daidong-dark-gray flex items-center justify-center text-daidong-white hover:bg-daidong-red transition-colors duration-300">
                                <FaFacebookF size={16} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-daidong-dark-gray flex items-center justify-center text-daidong-white hover:bg-daidong-red transition-colors duration-300">
                                <FaTwitter size={16} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-daidong-dark-gray flex items-center justify-center text-daidong-white hover:bg-daidong-red transition-colors duration-300">
                                <FaInstagram size={16} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-daidong-dark-gray flex items-center justify-center text-daidong-white hover:bg-daidong-red transition-colors duration-300">
                                <FaYoutube size={16} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-8 uppercase tracking-wider">{t('footer.links')}</h4>
                        <ul className="space-y-4 text-sm font-semibold text-daidong-gray">
                            <li><Link to="/" className="hover:text-daidong-red transition-colors duration-300">{t('header.home')}</Link></li>
                            <li><Link to="/shop" className="hover:text-daidong-red transition-colors duration-300">{t('header.shop')}</Link></li>
                            <li><Link to="/about" className="hover:text-daidong-red transition-colors duration-300">{t('header.about')}</Link></li>
                            <li><Link to="/contact" className="hover:text-daidong-red transition-colors duration-300">{t('header.contact')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-8 uppercase tracking-wider">{t('footer.contact')}</h4>
                        <ul className="space-y-4 text-sm font-semibold text-daidong-gray">
                            <li>{t('footer.address')}</li>
                            <li>{t('footer.phone')}</li>
                            <li>{t('footer.email')}</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-8 uppercase tracking-wider">Newsletter</h4>
                        <p className="text-sm font-medium text-daidong-gray mb-6">Subscribe to get special offers and updates</p>
                        <div className="flex flex-col space-y-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Your email address"
                                className="w-full px-5 py-4 bg-daidong-dark-gray text-daidong-white text-sm font-medium focus:outline-none rounded-full placeholder-daidong-gray focus:ring-2 focus:ring-daidong-red transition-all duration-300"
                            />
                            <button className="w-full bg-daidong-red text-daidong-white uppercase font-bold text-sm py-4 rounded-full hover:bg-daidong-red-dark transition-colors duration-300">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
                <div className="border-t border-daidong-dark-gray pt-8 text-center text-xs font-bold text-daidong-gray uppercase tracking-widest">
                    <p>&copy; {new Date().getFullYear()} Winboss. {t('footer.rights')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;