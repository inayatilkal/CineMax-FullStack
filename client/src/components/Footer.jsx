import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <footer className="px-6 md:px-16 lg:px-36 mt-40 w-full text-gray-300">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-14">
                <div className="md:max-w-96">
                    <img className="w-36 h-auto" src={assets.logo} alt="logo" />
                    <p className="mt-6 text-sm">
                        Book your movie tickets online with ease and convenience. We offer a reliable, secure, and user-friendly platform to explore the latest movies, check showtimes, select your favorite seats, and enjoy a seamless booking experience.
                    </p>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
                    <div>
                        <h2 className="font-semibold mb-5">Get in touch</h2>
                        <div className="text-sm space-y-2">
                            <p>+91 9591040205</p>
                            <p>inayatilkal@gmail.com</p>
                            <p>+91 7026917102</p>
                            <p>ckdevalatkar@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center text-sm pb-5">
                Copyright {new Date().getFullYear()} © Cinemax. All Right Reserved.
            </p>
        </footer>
    )
}

export default Footer
