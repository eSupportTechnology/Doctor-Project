import React, { useEffect, useState } from 'react';  
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Truck, Shield, Package, Clock } from 'lucide-react';
import { Star } from 'lucide-react'; 

// Image
import Background from '../assest/images/pro.details.jpg';

const ProductDetails = () => {
  const { id } = useParams();  
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product with ID:', id);
        const response = await axios.get(`http://localhost:8081/pharmacy/product/${id}`);
        console.log('API Response:', response.data); 
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <p className="text-gray-600 text-[20px] text-lg">Product not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleBackNavigation = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${Background})` }}>
      <Header />

      {/* Navigation Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl px-4 py-3 mx-auto">
          <div className="flex items-center space-x-2 text-sm">
            <button className="p-2 transition rounded-full hover:bg-gray-100" onClick={handleBackNavigation}>
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-gray-600 text-[16px]">Pharmacy</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 text-[16px] font-medium">{product.productName}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl px-5 mx-auto py-9">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative">
            <div className="p-6 bg-white shadow-sm rounded-2xl">
            {product.discountPercentage && (
              <div className="absolute px-3 py-1 text-sm font-medium text-white bg-[#FF0000] rounded-full top-4 left-4">
                {product.discountPercentage}% OFF
              </div>
            )}
              <img
                src={`http://localhost:8081${product.image}`}
                alt={product.productName}
                className="w-full h-[400px] object-contain rounded-lg"
                onError={(e) => (e.target.src = '/fallback-image.jpg')} // Default image fallback
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="p-6 bg-white shadow-sm rounded-2xl">
              <h1 className="mb-4 text-2xl font-semibold">{product.productName}</h1>
              {/* Rating and Reviews */}
            <div className="flex items-center mb-4 space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
              <div className="flex items-baseline mb-6 space-x-3">
                <span className="text-3xl font-bold text-gray-900">{product.basePrice}.00 LKR</span>
              </div>
              <p className="text-gray-600">{product.description}</p>
            </div>

          

            {/* Additional Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Fast Delivery */}
              <div className="p-4 bg-white shadow-sm rounded-xl">
                <div className="flex items-center space-x-3">
                  <Truck className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="font-medium">Fast Delivery</p>
                    <p className="text-sm text-gray-500">Essential medications delivered promptly</p>
                  </div>
                </div>
              </div>

              {/* Genuine Medications */}
              <div className="p-4 bg-white shadow-sm rounded-xl">
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="font-medium">Genuine Medications</p>
                    <p className="text-sm text-gray-500">100% authentic and certified products</p>
                  </div>
                </div>
              </div>

              {/* Safe Packaging */}
              <div className="p-4 bg-white shadow-sm rounded-xl">
                <div className="flex items-center space-x-3">
                  <Package className="w-6 h-6 text-purple-500" />
                  <div>
                    <p className="font-medium">Safe Packaging</p>
                    <p className="text-sm text-gray-500">Hygienic and tamper-proof seals</p>
                  </div>
                </div>
              </div>

              {/* 24/7 Support */}
              <div className="p-4 bg-white shadow-sm rounded-xl">
                <div className="flex items-center space-x-3">
                  <Clock className="w-6 h-6 text-orange-500" />
                  <div>
                    <p className="font-medium">24/7 Support</p>
                    <p className="text-sm text-gray-500">Around-the-clock customer care</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;
