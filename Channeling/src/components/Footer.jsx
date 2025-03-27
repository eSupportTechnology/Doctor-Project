import React from 'react'
import Logo from '../assest/images/37a39cb7092d94d7297953ad09f2dee5.png'
import { FaFacebookF, FaYoutube, FaPhoneAlt } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaLocationDot } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { IoLogoWhatsapp } from "react-icons/io";

const Footer = () => {
    return (
        <>

            <div className='h-auto bg-fontDark flex justify-between px-7 flex-col sm:flex-col md:flex-row'>
                <div className="sectionFooter h-90 mt-8">
                    <img src={Logo} className='h-24' alt="" />

                    <h1 className='text-lightColor font-bold text-3xl uppercase mt-6'><span className='text-green'>Amarasingha</span> Medicare</h1>
                    <h2 className='text-lightColor xl:text-[18px] lg:text-[18px] md:text-[16px] sm:text-[16px] xsm:text-[14px] capitalize'>In front of Eheliyagoda Primary Hospital</h2>
                    <div className="socialMedia flex mt-7 gap-x-6">
                        <FaFacebookF className='text-3xl text-lightColor cursor-pointer hover:scale-125 duration-200' />

                        <RiInstagramFill className='text-3xl text-lightColor cursor-pointer hover:scale-125 duration-200' />

                        <FaYoutube className='text-3xl text-lightColor cursor-pointer hover:scale-125 duration-200' />
                    </div>
                </div>

                <div className="sectionFooter flex items-center justify-center flex-col h-56 sm:h-56 md:h-96 gap-3">
                    <h1 className="text-green text-xl font-bold h-fit">Terms</h1>

                    <div className="flex flex-col items-center justify-center gap-3">
                        <h1 className="text-lightColor text-lg">Privacy Policy</h1>
                        <h1 className="text-lightColor text-lg">Settings</h1>
                        <h1 className="text-lightColor text-lg">Setup</h1>
                        <h1 className="text-lightColor text-lg">Help</h1>
                    </div>
                </div>
                <div className="sectionFooter flex items-center justify-center flex-col h-56 sm:h-56 md:h-96 gap-3">
                    <h1 className="text-green text-xl font-bold h-fit">Support</h1>

                    <div className="flex flex-col items-center justify-center gap-3">
                        <h1 className="text-lightColor text-lg">Getting Started</h1>
                        <h1 className="text-lightColor text-lg">Help Center</h1>
                        <h1 className="text-lightColor text-lg">Server Status</h1>
                        <h1 className="text-lightColor text-lg">Report a bug</h1>
                    </div>
                </div>
                <div className="sectionFooter flex justify-center flex-col h-64 sm:h-64 md:h-96 gap-3">
                    <h1 className="text-green text-xl font-bold h-fit">Contact Us</h1>

                    <div className="flex flex-col gap-3">
                        <h1 className="text-lightColor text-lg uppercase">Amarasinghe Medicare(PVT) LTD</h1>
                        <h1 className="text-lightColor text-lg flex gap-2"><FaLocationDot className='text-2xl' />178/A/1, Hospital Road, Eheliyagoda.</h1>
                        <h1 className="text-lightColor text-lg flex gap-2"><MdOutlineEmail className='text-2xl' />amarasinghamedicare@gmail.com</h1>

                        <div className='flex gap-5'>
                            <h1 className="text-lightColor text-lg flex gap-2"><FaPhoneAlt className='text-2xl' />036 2259 545</h1>
                            <h1 className="text-lightColor text-lg flex gap-2"><IoLogoWhatsapp className='text-2xl text-green' />036 2259 545</h1>
                        </div>
                    </div>


                </div>


            </div>

            <div className="w-full bg-slate-900 p-2">

                <div className="">
                    <h1 className='text-start text-[0.9rem] p-2  tracking-wide uppercase text-white'> © Amarasingha Medicare | 2024</h1>
                </div>

            </div>
        </>
    )
}

export default Footer