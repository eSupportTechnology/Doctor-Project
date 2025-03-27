import React from 'react'

const InstructionNav = () => {
    return (
        <div>
            <div className="
                flex items-start justify-start bg-slate-300 p-3
            ">{/**third section nav */}
                <div className="">
                    <h1 className='text-start text-[0.9rem] font-bold tracking-wide uppercase text-fontDark leading-7'>ඔබගේ වෛද්‍යවරයා හමුවීමට වෙලාවක් වෙන් කර ගැනීම සඳහා <span className="bg-red p-1 text-white rounded-full">Make Appointment</span> යටතේ අදාළ වෛද්‍යවරයා පැමිණෙන ආසන්නතම දිනය ක්ලික් කර හමුවීම වෙන් කරවාගන්න</h1>
                </div>

            </div>

            <div className="leading-7 

            flex items-start justify-start bg-slate-200 p-3

            ">{/**forth section nav */}
                <div className="">
                    <h1 className='text-start text-[0.9rem] font-bold tracking-wide uppercase text-fontDark'><span className="bg-red p-1 text-white rounded-full">OPN</span> -  වෛද්‍යවරයා මෙම මොහොතේ පරීක්ෂා කරන රෝගී අංක මෙහි සඳහන් වේ.</h1>
                </div>


            </div>
        </div>
    )
}

export default InstructionNav