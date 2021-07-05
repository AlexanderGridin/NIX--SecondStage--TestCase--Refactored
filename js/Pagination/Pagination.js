import DOMObject from './DOMObject.js';

/**
 * Костя, в этом и других классах я использовал много деструктуризации.
 * Основная идея - наглядное представление всех свойств класса и параметров конструктора.
 * Очень интересно было бы узнать, применяется ли такой подход на реальных проектах + узнать свои ошибки при применении данного подхода, т.к. подозреваю, что местами она избыточна, но на дополнительный рефакторинг времени у меня не осталось :(
 * ...Гридин.
 */

export default class Pagination{
  wrapper;
  DOMObject;
  currentPageButtonIndex = 0;
  selectItemsPerPage = false;
  summary = false;
  classNames = {
    wrapper: 'pagination',
    pager: 'pager',
    nextPageButton: 'pager__button-next',
    prevPageButton: 'pager__button-prev',
    pagesButtonsList: 'pager__list',
    pagesButtonsListItem: 'pager__list-item',
    button: 'pager__button',
    current: 'current',
  };
  pagesButtonsData = [];

  pager = {
    self: null,
    nextButton: null,
    prevButton: null,
    pagesButtonsList: null,
    pagesButtons: [],
  };

  constructor({
    wrapper,
    selectItemsPerPage,
    summary,
    classNames,
    pagesButtons,
  }){
    if(wrapper){
      this.wrapper = document.querySelector(wrapper);
    }

    if(!wrapper){
      this.DOMObject = new DOMObject({
        tagName: 'div',
        classNames: `${this.classNames.wrapper}`,
      });
      this.wrapper = this.DOMObject.element;
    }

    this.selectItemsPerPage = selectItemsPerPage ? selectItemsPerPage : this.selectItemsPerPage;
    this.summary = summary ? summary : this.summary;

    if(classNames){
      let {
        wrapper: wrapperClassName,
        nextPageButton: nextPageButtonClassName,
        prevPageButton: prevPageButtonClassName,
        pagesButtonsList: pagesButtonsListClassName,
        pagesButtonsListItem: pagesButtonsListItemClassName,
        button: buttonClassName,
        current: currentClassName,
      } = classNames;

      this.classNames.wrapper = wrapperClassName ? wrapperClassName : this.classNames.wrapper;
      this.classNames.nextPageButton = nextPageButtonClassName ? wrapperClanextPageButtonClassNamessName : this.classNames.nextPageButton;
      this.classNames.prevPageButton = prevPageButtonClassName ? prevPageButtonClassName : this.classNames.prevPageButton;
      this.classNames.pagesButtonsList = pagesButtonsListClassName ? pagesButtonsListClassName : this.classNames.pagesButtonsList;
      this.classNames.pagesButtonsListItem = pagesButtonsListItemClassName ? pagesButtonsListItemClassName : this.classNames.pagesButtonsListItem;
      this.classNames.button = buttonClassName ? buttonClassName : this.classNames.button;
      this.classNames.current = currentClassName ? currentClassName : this.classNames.current;
    }

    if(pagesButtons){
      for(let button of pagesButtons){
        let {
          href: pageButtonHref
        } = button;

        this.pagesButtonsData.push({
          href: pageButtonHref,
          element: null,
        });
      }
    }


    this._build();
  }

  _build(){
    if(this.selectItemsPerPage){
      this._buildSelectItemsPerPage();
    }

    if(this.summary){
      this._buildSummary();
    }

    this._buildPager()
      ._handleNextPageButton()
      ._handlePrevPageButton()
      ._handleSelectPageButtons();
  }

  _buildSelectItemsPerPage(){
    let form = new DOMObject({
      tagName: 'div',
      classNames: 'pagination__rows-per-page',
      content: `
        <form class="pagination__rows-per-page-form" action="#">
          <div class="form__item form__item-select">
            <label class="form__label" for="rows-per-page">Rows per page</label>
            <select class="form__select" name="rows-per-page" id="rows-per-page">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
          </div>
        </form>
      `,
    });

    this.wrapper.append(form.element);
    return this;
  }

  _buildSummary(){
    let summary = new DOMObject({
      tagName: 'div',
      classNames: `pagination__summary`,
      content: '1-10 of 20',
    });

    this.wrapper.append(summary.element);
    return this;
  }

  _buildPager(){
    let prevButton = new DOMObject({
      tagName: 'button',
      attributes: {
        type: 'button',
        disabled: 'disabled',
      },
      content: `
        <svg class="pager__button-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 12L10 8L6 4" stroke="white" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
        Previous page
      `,
      classNames: `${this.classNames.button} ${this.classNames.prevPageButton}`,
    });
    this.pager.prevButton = prevButton;

    let nextButton = new DOMObject({
      tagName: 'button',
      attributes: {
        type: 'button',
      },
      content: `
        <svg class="pager__button-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 12L10 8L6 4" stroke="white" stroke-linecap="round" stroke-linejoin="round"></path>
        </svg>
        Next page
      `,
      classNames: `${this.classNames.button} ${this.classNames.nextPageButton}`,
    });
    this.pager.nextButton = nextButton;

    let pagesButtonsList = new DOMObject({
      tagName: 'ul',
      classNames: `${this.classNames.pagesButtonsList}`,
    });
    this.pager.pagesButtonsList = pagesButtonsList;

    this.pagesButtonsData.forEach((buttonData, i) => {
      let pageButton = new DOMObject({
        tagName: 'button',
        attributes: {
          type: 'button',
          'data-url': buttonData.href,
          'data-id': i,
        },
        classNames: `${this.classNames.button}`,
        content: i + 1,
      });
      this.pager.pagesButtons.push(pageButton);

      let li = new DOMObject({
        tagName: 'li',
        classNames: `${this.classNames.pagesButtonsListItem}`,
        childrens: [pageButton],
      });

      pagesButtonsList.addChild(li);
    });

    let pager = new DOMObject({
      tagName: 'div',
      classNames: `${this.classNames.pager}`,
      childrens: [
        prevButton, 
        pagesButtonsList, 
        nextButton,
      ],
    });
    this.pager.self = pager;

    this.pager.pagesButtons[0].element.classList.add(this.classNames.current);
    this.DOMObject.addChild(pager);

    return this;
  }

  _handleNextPageButton(){
    let pagination = this;
    let nextButton = this.pager.nextButton.element;
    let prevButton = this.pager.prevButton.element;
    let pagesButtons = this.pager.pagesButtons;

    nextButton.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();

      let currentPageButtonIndex = ++pagination.currentPageButtonIndex;
      let currentPageButton = pagination.pager.pagesButtons[currentPageButtonIndex]; 

      // Disable button if currentPageButton is the last
      if(!pagination.pager.pagesButtons[currentPageButtonIndex + 1]){
        nextButton.setAttribute('disabled', 'disabled');
      }

      // Enable prevPageButton
      if(prevButton.hasAttribute('disabled')){
        prevButton.removeAttribute('disabled');
      }

      // Update currentPageButton CSS class
      for(let button of pagesButtons){
        if(button.element.classList.contains(pagination.classNames.current)){
          button.element.classList.remove(pagination.classNames.current);
        }
      }
      currentPageButton.element.classList.add(pagination.classNames.current);
    });

    return this;
  }

  _handlePrevPageButton(){
    let pagination = this;
    let nextButton = this.pager.nextButton.element;
    let prevButton = this.pager.prevButton.element;
    let pagesButtons = this.pager.pagesButtons;

    prevButton.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();

      let currentPageButtonIndex = --pagination.currentPageButtonIndex;
      let currentPageButton = pagination.pager.pagesButtons[currentPageButtonIndex]; 

      // Disable button if currentPageButton is the first
      if(!pagination.pager.pagesButtons[currentPageButtonIndex - 1]){
        prevButton.setAttribute('disabled', 'disabled');
      }

      // Endable nextPageButton
      if(nextButton.hasAttribute('disabled')){
        nextButton.removeAttribute('disabled');
      }

      // Update currentPageButton CSS class
      for(let button of pagesButtons){
        if(button.element.classList.contains(pagination.classNames.current)){
          button.element.classList.remove(pagination.classNames.current);
        }
      }
      currentPageButton.element.classList.add(pagination.classNames.current);
    });

    return this;
  }

  _handleSelectPageButtons(){
    let pagination = this;
    let nextButton = this.pager.nextButton.element;
    let prevButton = this.pager.prevButton.element;
    let pagesButtons = this.pager.pagesButtons;
    let pagesButtonsList = this.pager.pagesButtonsList;

    pagesButtonsList.element.addEventListener('click', function(e){
      e.preventDefault();
      e.stopPropagation();

      let button = e.target.closest('button');

      if(
        !button ||
        !button.classList.contains(pagination.classNames.button) ||
        button.hasAttribute('disabled') ||
        button.classList.contains(pagination.classNames.current)
      ){
        return;
      }

      let buttonIndex = +button.getAttribute('data-id');

      for(let button of pagesButtons){
        if(button.element.classList.contains(pagination.classNames.current)){
          button.element.classList.remove(pagination.classNames.current);
        }
      }

      button.classList.add(pagination.classNames.current);
      pagination.currentPageButtonIndex = buttonIndex;

      // Disable nextPageButton or prevPageButton
      if(!button.parentElement.nextElementSibling){
        nextButton.setAttribute('disabled', 'disabled');
      }

      if(!button.parentElement.previousElementSibling){
        prevButton.setAttribute('disabled', 'disabled');
      }

      // Enable nextPageButton or prevPageButton
      if(
        button.parentElement.previousElementSibling && 
        prevButton.hasAttribute('disabled')
      ){
        prevButton.removeAttribute('disabled');
      }

      if(
        button.parentElement.nextElementSibling && 
        nextButton.hasAttribute('disabled')
      ){
        nextButton.removeAttribute('disabled');
      }
    });

    return this;
  }

  nextPage(callback){
    let nextButton = this.pager.nextButton.element;
    
    if(callback && typeof callback === 'function'){
      nextButton.addEventListener('click', () => {
        let currentPageButton = this.pager.pagesButtons[this.currentPageButtonIndex].element;
        let dataUrl = currentPageButton.getAttribute('data-url');

        callback(dataUrl);
      });
    }

    return this;
  }

  prevPage(callback){
    let prevButton = this.pager.prevButton.element;

    if(callback && typeof callback === 'function'){
      prevButton.addEventListener('click', () => {
        let currentPageButton = this.pager.pagesButtons[this.currentPageButtonIndex].element;
        let dataUrl = currentPageButton.getAttribute('data-url');
        
        callback(dataUrl);
      });
    }

    return this;
  }

  selectPage(callback){
    let pageButtons = this.pager.pagesButtons;

    if(callback && typeof callback === 'function'){
      for(let button of pageButtons){
        button.element.addEventListener('click', (e) => {
          /**
           * Код ниже по сути является заплаткой.
           * Я не успел разобраться, почему здесь не работает код, аналогичный методам prevPage() и nextPage(). В связи с этим родилась данная заплатка....Гридин.
           */
          let selectedButton = e.target.closest('button');

          if(selectedButton.classList.contains(this.classNames.current)){
            return;
          }

          let dataUrl = selectedButton.getAttribute('data-url');
          callback(dataUrl);
        });
      }
    }

    return this;
  }
}