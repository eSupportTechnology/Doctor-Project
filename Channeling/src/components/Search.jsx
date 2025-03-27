import React from 'react';
import { IoIosSearch } from "react-icons/io";

const Search = () => {
    return (
        <div className="flex justify-end">
            <div className="relative xl:w-3/12 lg:w-3/12 md:w-8/12 mr-5">
                <IoIosSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                <input
                    type="text"
                    placeholder="Specialization / Doctor Name"
                    className="w-full bg-lightgray h-11 my-4 rounded-2xl pl-12 pr-5 border border-green shadow-lg"
                />
            </div>
        </div>
    );
};

export default Search;
