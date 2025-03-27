import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { IoIosSearch } from 'react-icons/io';
import { Link } from 'react-router-dom';

import PharmacyBg from '../assest/images/PharmacyBg.png';

const Pharmacy = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8081/pharmacy/all');
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    setFilteredProducts(products.filter((product) =>
      product.productName.toLowerCase().includes(value)
    ));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
        <main
          className="flex-grow bg-cover bg-center"
          style={{ backgroundImage: `url(${PharmacyBg})`, backgroundPosition: 'center', backgroundSize: 'cover' }}
        > 
      <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-end mb-8">
            <div className="relative flex items-center w-full sm:w-[498px] h-[44px] border border-gray-400 shadow-md rounded-full bg-white ml-auto">
              <input
                type="text"
                placeholder="Search Here"
                value={searchTerm}
                onChange={handleSearch}
                className="pl-4 w-full h-full text-center text-gray-400 bg-transparent focus:outline-none placeholder-gray-400"
              />
              <button className="absolute right-2 bg-[#B3B3B3] rounded-full p-2 w-10 sm:w-14 h-8 flex items-center justify-center">
                <IoIosSearch className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[15]" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-1 justify-center">
            {filteredProducts.map((product) => (
              <Link to={`/product/${product.id}`} key={product.id}>
                <div className="w-full max-w-xs sm:max-w-sm mx-auto mt-4">
                  <div className="bg-white shadow-sm p-2 sm:p-4 relative mb-4 rounded-lg">
                    <div className="relative flex justify-center">
                      <img
                        src={`http://localhost:8081${product.image}`}
                        alt={product.productName}
                        className="transition-transform duration-300 hover:scale-105 hover:brightness-100 hover:opacity-190"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 px-2">
                    <h2 className="font-normal text-base sm:text-[18px] text-black text-center sm:text-left">{product.productName}</h2>
                    <p className="text-xs sm:text-[15px] font-normal text-black text-center sm:text-left">{product.description}</p>
                    <p className="text-xs sm:text-sm font-normal text-center sm:text-left">{product.basePrice}.00 LKR</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Pharmacy;
