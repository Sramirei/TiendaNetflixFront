import { useEffect } from 'react';

const CustomLogin = () => {
  useEffect(() => {
    window.addEventListener('load', function() {
      let underlayPhoto = document.querySelector('.underlay-photo');
      let imageURLs = [
        process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Amazon2.jpg',
        process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Netflix3.jpg',
        process.env.REACT_APP_PUBLIC_URL + 'Img/Home/apple3.jpg',
        process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Crunchy2.jpg',
        process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Disney3.jpg',
        process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Paramount2.png',
        process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Start1.jpg',
        process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Start3.jpg',
        process.env.REACT_APP_PUBLIC_URL + 'Img/Home/Crunchy4.png',
      ];

      function changeBackgroundImage() {
        let randomIndex = Math.floor(Math.random() * imageURLs.length);
        let randomImageURL = imageURLs[randomIndex];
        if (underlayPhoto) {
          underlayPhoto.style.backgroundImage = "url('" + randomImageURL + "')";
        }
      }

      // Change background image on page load
      changeBackgroundImage();

      // Change background image on page reload
      window.addEventListener('beforeunload', function() {
        // Add a delay for the image change to be visible before the page reloads
        setTimeout(changeBackgroundImage, 100);
      });
    });
  }, []);

  return null;
};

export default CustomLogin;
