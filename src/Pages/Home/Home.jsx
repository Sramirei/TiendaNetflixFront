import React, { useEffect } from 'react'
import './home.css'
import { initializeCursors } from './functions'
import { NavLink } from 'react-router-dom'


const Home = () => {

  useEffect(() => {
    initializeCursors();
  }, []);

  return (
    <>
    <div className="container">
    
    {/* <!-- Page cursor
    ================================================== --> */}
    
    <div className='cursor' id="cursor"></div>
    <div className='cursor2' id="cursor2"></div>
    <div className='cursor3' id="cursor3"></div>
    <div className='cursor4' id="cursor4"></div>
    <div className='cursor5' id="cursor5"></div>
    <div className='cursor6' id="cursor6"></div>
    <div className='cursor7' id="cursor7"></div>
    <div className='cursor8' id="cursor8"></div>

<div className="section">
        <ul className="case-study-wrapper">
            <li className="case-study-name">                            	
                <a href="#" className="hover-target">Paramount</a>
            </li>
            <li className="case-study-name">                                         	
                <a href="#" className="hover-target">Start Plus</a>
            </li>
            <li className="case-study-name">                                         	
                <a href="#" className="hover-target">Crunchyroll</a>
            </li>
            <li className="case-study-name">                                         	
                <a href="#" className="hover-target">Netflix</a>
            </li>
             <li >                                        	
                <NavLink to={'/login'} className='btn-hover color-4'>Iniciar Sesion</NavLink>
            </li>
            <li className="case-study-name">                                         	
                <a href="#" className="hover-target">Disney +</a>
            </li>
            <li className="case-study-name">                                         	
                <a href="#" className="hover-target">Apple +</a>
            </li>
            <li className="case-study-name">                                        	
                <a href="#" className="hover-target">Amazon</a>
            </li>
        </ul>
        <ul className="case-study-images">
            {/* <!-- Paramount --> */}
            <li>
                <div className="img-hero-background">
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Paramount1.jpg'} alt="Imagen 1" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Paramount2.png'} alt="Imagen 2" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Paramount3.jpg'} alt="Imagen 3" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Paramount4.jpg'} alt="Imagen 4" />
                    </span> 
                </div>
                {/* <!-- To add more elements increase the number in " hero-number-fixed ", and add more " li " " --> */}

            </li>
            {/* <!-- Start Plus --> */}
            <li>
                <div className="img-hero-background">
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Star1.jpg'} alt="Imagen 1" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Star2.jpg'} alt="Imagen 2" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Star3.jpg'} alt="Imagen 3" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Star4.jpg'} alt="Imagen 4" />
                    </span> 
                </div> 
            </li>
            {/* <!-- Crunchyroll --> */}
            <li>
                <div className="img-hero-background">
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Crunchy1.png'} alt="Imagen 1" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Crunchy2.jpg'} alt="Imagen 2" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Crunchy3.jpg'} alt="Imagen 3" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Crunchy4.png'} alt="Imagen 4" />
                    </span> 
                </div> 
            </li>
            {/* Netflix */}
            <li>
                <div className="img-hero-background">
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Netflix1.jpg'} alt="Imagen 1" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Netflix2.png'} alt="Imagen 2" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Netflix3.jpg'} alt="Imagen 3" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Netflix4.jpeg'} alt="Imagen 4" />
                    </span> 
                </div> 
            </li>
            {/* Login + */}
            <li>
                <div className="img-hero-background">
                    <span>
                        <img src="" alt="Imagen 1" />
                    </span> 
                    <span>
                        <img src="" alt="Imagen 2" />
                    </span> 
                    <span>
                        <img src="" alt="Imagen 3" />
                    </span> 
                    <span>
                        <img src="" alt="Imagen 4" />
                    </span> 
                </div> 
            </li>
            {/* Disney */}
            <li>
            <div className="img-hero-background">
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Disney1.jpg'} alt="Imagen 1" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Disney2.jpg'} alt="Imagen 2" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Disney3.jpg'} alt="Imagen 3" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Disney4.jpeg'} alt="Imagen 4" />
                    </span> 
                </div> 
            </li>
            {/* Apple */}
            <li>
                <div className="img-hero-background">
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/apple1.jpg'} alt="" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/apple2.jpg'} alt="" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/apple3.jpg'} alt="" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/apple4.jpg'} alt="" />
                    </span> 
                </div> 
            </li>
            {/* Amazon */}
            <li>
                <div className="img-hero-background">
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Amazon1.jpg'} alt="Imagen 1" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Amazon2.jpg'} alt="Imagen 2" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Amazon3.jpg'} alt="Imagen 3" />
                    </span> 
                    <span>
                        <img src={process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Amazon4.jpg'} alt="Imagen 4" />
                    </span> 
                </div> 
            </li>
        </ul>	
    </div>


<NavLink to={'/login'} className="link-to-login hover-target">Login</NavLink>

</div>
    </>
  )
}

export default Home
