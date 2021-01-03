var menuButton = document.querySelector('.menu-button')
var navbar = document.querySelector('.navbar')
var navLeft = document.querySelector('.nav-list-left')
var navRight = document.querySelector('.nav-list-right')
var logo = document.getElementsByClassName('logo')[0]
var logoGithub = document.querySelector('.logo-github')

menuButton.addEventListener('click', ()=>{
    menuButton.classList.toggle('menu-button-rotation')
    navbar.classList.toggle('nav-resize-height')
    navbar.classList.toggle('navbar-align')
    navLeft.classList.toggle('nav-left-item-visibility')
    navRight.classList.toggle('nav-right-item-visibility')
    logo.classList.toggle('logo-align')
    logoGithub.classList.toggle('logo-github-align')

    if (logo.style.alignSelf == 'center')
    {
        logo.style.alignSelf = 'initial'
    }
    else
    {
        logo.style.alignSelf = 'center'
    }
})