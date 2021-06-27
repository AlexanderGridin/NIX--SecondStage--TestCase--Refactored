document.addEventListener('DOMContentLoaded', main);

function main(){
  handleMobileMenuButton({
    menuButtonSelector: '.horizontal-nav__mobile-button', 
    menuListSelector: '.horizontal-nav__list',
  });
}

// Functions
function handleMobileMenuButton({menuButtonSelector, menuListSelector}){
  let menuButton = document.querySelector(menuButtonSelector);
  let menuList = document.querySelector(menuListSelector);

  let toggleClassName = 'visible';

  if(menuButton && menuList){
    menuButton.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();

      menuList.classList.toggle(toggleClassName);
    }, false);
  }
}