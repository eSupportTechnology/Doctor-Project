import React from 'react'
import { useState, useRef, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { FaRegEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Modal, FileInput, Label } from "flowbite-react";
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { TiTick } from "react-icons/ti";

const CreateCategory = () => {

    // React Hooks
    const [formData, setFormData] = useState({
        eng_name: "",
        sin_name: "",
        image: null
    });
    const [uploader, setUploader] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [email, setEmail] = useState('');
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const fetchCategories = () => {
        axios
            .get('http://localhost:8081/category/categories')
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                setError(error);
            })
    }

    useEffect(() => {
        fetchCategories();
    }, []);

    const customStyles = {
        headCells: {
            style: {
                backgroundColor: '#202643',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '13px',
            },
        },
    };

    const handleChanges = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Get the selected file
        if (file) {
            setFormData({ ...formData, image: file }); // Update state with the file
        }

        setUploader(!uploader);
    };

    const handleChancel = () => {
        setFormData({
            eng_name: '',
            sin_name: '',
            image: null
        });

        setOpenModal(false);
        setEmail('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.eng_name || !formData.sin_name || !formData.image) {
            toast.error("All fields are required!");
            return;
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(formData.image.type)) {
            toast.error("Only JPG, JPEG, and PNG formats are allowed");
            return;
        }

        const payload = new FormData();
        payload.append('eng_name', formData.eng_name);
        payload.append('sin_name', formData.sin_name);
        payload.append('image', formData.image);

        try {
            const response = await axios.post('http://localhost:8081/category/create', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 201) {
                toast.success("Category created successfully");
                fetchCategories();
                setFormData({
                    eng_name: '',
                    sin_name: '',
                    image: null
                });

                setUploader(true);

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
            console.log("Category Created Successfully")
        } catch (error) {
            toast.error("Fail in category creation!");
            console.error("Error : ", error);
        }
    };

    const handleEdit = (row) => {
        console.log('Edit clicked for:', row);
    };

    const columns = [
        { name: 'Category', selector: row => row.id, sortable: true },
        { name: 'English Name', selector: row => row.eng_name, sortable: true },
        { name: 'Sinhala Name', selector: row => row.sin_name, sortable: true },
        {
            name: 'Category Image',
            cell: row => (
                <div className="flex space-x-3 justify-center items-center">
                    <button
                        onClick={() => handleEdit(row)}
                        className="flex items-center justify-center align-middle font-semibold  p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1  outline-slate-500 gap-1 bg-blue text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105"
                    >
                        Preview
                        <FaRegEye className='text-sm' />
                    </button>
                </div>
            ),
        },
        {
            name: 'Action',
            cell: row => (
                <div className="flex space-x-3 justify-center items-center">
                    <button onClick={() => handleEdit(row)} className="flex items-center justify-center align-middle font-semibold gap-1 p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1  outline-slate-500  bg-green text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105">
                        Edit
                        <FaEdit className='text-sm' />
                    </button>

                    <button onClick={() => handleEdit(row)} className="flex items-center justify-center align-middle font-semibold p-[6px] rounded-md shadow-md shadow-slate-400/50 outline-1  outline-slate-500  bg-red text-white hover:bg-green-500 transform transition-transform duration-300 hover:scale-105">
                        Delete
                        <MdDelete className='text-sm' />
                    </button>
                </div>
            ),
        },
    ];

    function onCloseModal() {
        setOpenModal(false);
        setEmail('');
    }

    return (
        <>
            <Toaster />
            <div className='h-[100%] w-[100%]'>
                <div>
                    <button onClick={() => setOpenModal(true)} className='text-[16px] text-white uppercase font-semibold text-left bg-[#97CE4F] p-2 rounded-lg transform transition-transform duration-300 hover:scale-105'>Create Category</button>
                </div>

                <h1 className='mt-5 text-[16px] uppercase font-semibold text-left'>Available Categories</h1>
                <div className='h-fit p-[1px] mt-2 bg-[#202643]'>
                    <DataTable
                        columns={columns}
                        data={data}
                        fixedHeader
                        fixedHeaderScrollHeight="80vh"
                        className="data-table"
                        customStyles={customStyles}
                    />
                </div>
            </div>

            <Modal show={openModal} size="md" onClose={onCloseModal} popup>
                <Modal.Header className='bg-white' />
                <Modal.Body className='bg-white'>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900">Create <span className='text-red'>New</span> Category</h3>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="">English name</label>
                                <input type="text" id='eng_name' name='eng_name' value={formData.eng_name} onChange={handleChanges} className='w-[100%] h-11 bg-[#d8dad8] rounded-md p-3 mt-2' required />
                            </div>

                            <div className='mt-5'>
                                <label htmlFor="">Sinhala name</label>
                                <input type="text" id='sin_name' name='sin_name' value={formData.sin_name} onChange={handleChanges} className='w-[100%] h-11 bg-[#d8dad8] rounded-md p-3 mt-2 mb-5' required />
                            </div>

                            <label htmlFor="">Upload Category image</label>
                            {uploader ? (
                                <div className="flex w-full items-center justify-center mt-2" id='fileUploadArea'>
                                    <Label
                                        htmlFor="dropzone-file"
                                        className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-[#d8dad8]"
                                    >
                                        <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                            <svg
                                                className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 20 16"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                />
                                            </svg>
                                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG (MAX. 800x400px)</p>
                                        </div>
                                        <input
                                            type="file"
                                            name="image"
                                            id="dropzone-file"
                                            onChange={handleFileChange}
                                            ref={fileInputRef} // Attach ref here
                                            className="hidden"
                                        />
                                    </Label>
                                </div>
                            ) : (
                                <div className="flex w-full items-center justify-center mt-2 h-32 bg-[#d8dad8] rounded-lg flex-row" id='fileUploaded'>
                                    <TiTick className='text-5xl text-[#97CE4F]' />
                                    <h1 className='text-sm text-gray-500 dark:text-gray-400 font-semibold'>File Updated</h1>
                                </div>
                            )}

                            <div className='flex justify-end items-center h-10 mt-5 gap-3'>
                                <button onClick={handleChancel} className='text-[16px] text-white uppercase font-semibold text-left bg-red p-2 rounded-lg transform transition-transform duration-300 hover:scale-105'>Cancel</button>
                                <button type='submit' className='text-[16px] text-white uppercase font-semibold text-left bg-[#97CE4F] p-2 rounded-lg transform transition-transform duration-300 hover:scale-105'>Create</button>
                            </div>
                        </form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default CreateCategory