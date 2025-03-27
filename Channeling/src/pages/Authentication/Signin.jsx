import React from 'react'

// This is the way we import components
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Signin from '../../components/Signin';

const Signin2 = () => {
    return (
        <div>
            <Header/>

                <Signin/>

            <Footer/>
        </div>
    )
}

export default Signin2