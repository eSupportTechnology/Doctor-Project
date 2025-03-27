import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; 
import { Toaster } from 'react-hot-toast';


const CreatePharmacy = () => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [discountType, setDiscountType] = useState('');
    const [sku, setSku] = useState('');
    const [quantity, setQuantity] = useState('');
    const [tags, setTags] = useState('Select Product Tags');
    const [image, setImage] = useState(null);  
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [availableTags] = useState(['Pharmacy', 'Health', 'Wellness', 'Supplements']);
    const [category, setCategory] = useState('');

    // Handler for selecting a tag
    const handleTagSelection = (selectedTag) => {
        setTags(selectedTag);
    };

    // Function to remove the selected image
    const handleImageRemove = () => {
        setImage(null);
    };

    // Function to reset the form
    const resetForm = () => {
        setProductName('');
        setDescription('');
        setBasePrice('');
        setDiscountPercentage('');
        setDiscountType('');
        setSku('');
        setQuantity('');
        setCategory('Medical');
        setTags('Pharmacy');
        setImage(null);  
    };

    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);  
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create the form data
        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('description', description);
        formData.append('basePrice', basePrice);
        formData.append('discountPercentage', discountPercentage);
        formData.append('discountType', discountType);
        formData.append('sku', sku);
        formData.append('quantity', quantity);
        formData.append('category', category);
        formData.append('tags', tags);
        if (image) {
            formData.append('image', image);  
        }

       
        try {
            await axios.post('http://localhost:8081/pharmacy/add', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            
            toast.success('Item added successfully!', {
                position: 'top-center',
                duration: 3000
            });
            resetForm();
        } catch (error) {
            toast.error('Failed to add the item.', {
                position: 'top-center',
                duration: 3000
            });
            console.error('Error adding product:', error);
        }
    };


    return (
        <div className="w-full h-auto">
<Toaster />
            {/* Main Form Section */}
            <form onSubmit={handleSubmit} className="space-y-3">
                {/* Header Section with Back Button and Action Buttons */}
                <div className="flex justify-between items-center mb-5">
                    <button
                        onClick={() => window.history.back()} 
                        className="px-3 py-2 bg-[#161D6F] text-white rounded text-sm md:text-base flex items-center"
                    >
                        <i className="fas fa-chevron-left text-white text-sm mr-1"></i>
                        Back
                    </button>

                    {/* Action Buttons: Discard Changes and Add Product */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={resetForm} 
                            className="p-3 bg-[#FBBCBC] text-[#FF0000] font-semibold rounded-lg border-2 border-[#FF0000] text-sm"
                        >
                            Discard Changes
                        </button>
                        <button
                            type="submit"
                            className="p-3 bg-[#003EFF] text-white border-2 border-[#322cda] font-semibold rounded-lg  text-sm"
                        >
                            Add Product
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3">
                    {/* Left Column: General Information, Pricing, and Inventory */}
                    <div>
                        {/* General Information Section */}
                        <div className="bg-white p-6 shadow-lg rounded-lg mb-4">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">General Information</h2>
                            <div className="mb-4">
                                <label className="block text-gray-600 mb-2">Product Name</label>
                                <input
                                    type="text"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    placeholder="Enter product name"
                                    className="w-full p-3 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-600 mb-2">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter product description"
                                    className="w-full p-3 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                        </div>

                        {/* Pricing Section */}
                        <div className="bg-white p-6 shadow-lg rounded-lg mb-4">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Pricing</h2>
                            <div className="mb-4">
                                <label className="block text-gray-600 mb-2">Base Price</label>
                                <input
                                    type="text"
                                    value={basePrice}
                                    onChange={(e) => setBasePrice(e.target.value)}
                                    placeholder="Enter base price"
                                    className="w-full p-3 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-600 mb-2">Discount Percentage(%)</label>
                                    <input
                                        type="text"
                                        value={discountPercentage}
                                        onChange={(e) => setDiscountPercentage(e.target.value)}
                                        placeholder="Enter Discount Percentage"
                                        className="w-full p-3 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-2">Discount Type</label>
                                    <select
                                        value={discountType}
                                        onChange={(e) => setDiscountType(e.target.value)}
                                        className="w-full p-3 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    >
                                        <option value="" disabled>
                                            Select Discount Type
                                        </option>
                                        <option value="Percentage">Percentage</option>
                                        <option value="Flat">Flat</option>
                                    </select>
                                </div>
                            </div>

                        </div>

                        {/* Inventory Section */}
                        <div className="bg-white p-6 shadow-lg rounded-lg mb-4">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Inventory</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-600 mb-2">SKU</label>
                                    <input
                                        type="text"
                                        value={sku}
                                        onChange={(e) => setSku(e.target.value)}
                                        placeholder="Enter SKU"
                                        className="w-full p-3 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-600 mb-2">Quantity</label>
                                    <input
                                        type="text"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        placeholder="Enter quantity"
                                        className="w-full p-3 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Media, Category, and Tags */}
                    <div>
                        {/* Product Media Section */}
                        <div className="bg-white p-6 shadow-lg rounded-lg mb-4">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Product Media</h2>
                            <label className="block text-gray-600 mb-2">Photo Product</label>
                            <div className="w-full h-48 bg-gray-200 border-2 border-dashed border-gray-400 rounded-lg flex flex-wrap items-center justify-center p-4 space-x-4 space-y-4">
                                {image && (
                                    <div className="w-24 h-24 border rounded-lg overflow-hidden relative">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt="Uploaded preview"
                                            name="image"
                                            className="object-cover w-full h-full"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleImageRemove}
                                            className="absolute top-0 right-0 text-white bg-gray-700 rounded-full text-xs p-1"
                                        >
                                            X
                                        </button>
                                    </div>
                                )}
                                {!image && (
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('imageUpload').click()}
                                        className="px-4 py-2 text-[#3746f0] bg-[#e5e6f7] border-2 border-[#3746f0] rounded-lg hover:bg-blue-600 text-sm"
                                    >
                                        Add Image
                                    </button>
                                )}
                            </div>
                            <input
                                type="file"
                                id="imageUpload"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>
                        {/* Category Section */}
                        <div className="bg-white p-6 shadow-lg rounded-lg mb-4">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Category</h2>
                            <label className="block text-gray-600 mb-2">Product Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full p-3 bg-gray-200 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >    
                                <option value="" disabled>Select Product Category</option>
                                <option value="Medical">Medical</option>
                                <option value="Toys">Toys</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Books & Stationaries">Books & Stationaries</option>
                                <option value="Art Supplies">Art Supplies</option>
                            </select>

                            <label className="block text-gray-600 mb-4 mt-4">Product Tags</label>
                            <button
                                type="button"
                                onClick={() => setIsTagModalOpen(true)}
                                className="w-full p-3 bg-gray-200 border rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-400"
                            >
                                {tags}
                            </button>
                        </div>

                        {/* Tag Modal */}
                        {isTagModalOpen && (
                            <div className="relative">
                                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg w-full p-4 z-50 border">
                                    <h3 className="text-lg font-semibold text-center mb-4">Product Tags</h3>
                                    <div className="space-y-2">
                                        {availableTags.map((tag) => (
                                            <div key={tag} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id={tag}
                                                    name="productTag"
                                                    value={tag}
                                                    checked={tags === tag}
                                                    onChange={() => handleTagSelection(tag)}
                                                    className="mr-2"
                                                />
                                                <label htmlFor={tag} className="text-gray-700">
                                                    {tag}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsTagModalOpen(false)}
                                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg mr-2 text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsTagModalOpen(false)}
                                            className="px-4 py-2 bg-[#3746f0] text-white rounded-lg text-sm"
                                        >
                                            Select Tags
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreatePharmacy;
