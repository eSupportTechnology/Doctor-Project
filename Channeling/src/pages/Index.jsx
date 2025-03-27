import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Instructions from '../components/InstructionNav';
import Category from '../components/Categories';
import Search from '../components/Search';

const Index = () => {
  const [categoryData, setCategoryData] = useState([]);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8081/category/categories'); // Replace with your backend URL
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        setCategoryData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div>
      <Header />
      <Instructions />
      <Search />

      <div className="grid w-full h-auto grid-cols-1 sm:grid-cols-1 md:grid-cols-2">
        {categoryData.length > 0 ? (
          categoryData.map((category) => (
            <Category 
              key={category.id} 
              name={category.eng_name} 
              image={category.image 
                ? `http://localhost:8081/Upload/Categories/${category.image}` 
                : '/default_image.png'}  
              sinname={category.sin_name}
              categoryId={category.id}
            />
          ))
        ) : (
          <p className="text-center">No categories available</p>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;


