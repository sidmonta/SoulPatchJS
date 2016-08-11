export default class SoulPatch {

  constructor () {
    const links = Array.from(document.querySelectorAll('a[sp-href]'));
    this.container = document.querySelector('[sp-container]');

    links.forEach( link => {
      link.addEventListener('click', evt => {
        evt.preventDefault();
        this.go(evt.target.getAttribute('sp-href'));
      });
    });
  }

  go (url) {
    // TODO: Controllo se ho premuto lo stesso URL
    window.history.pushState(null, null, url);
    this._onChanged();
  }

  _onChanged () {
    const path = window.location.pathname;

    if (this._animating) { return; }

    this._animating = true;

    let outViewPromise = Promise.resolve();
    if (this.container) {
      outViewPromise = this._outView();
    }

    outViewPromise
      .then(() => { this._animating = false; })
      .then(() => this._inView(path) );
  }

  _outView () {
    return new Promise(resolve => {
      const onTransitionEnd = () => {
        this.container.removeEventListener('transitionend', onTransitionEnd);
        resolve();
      };
      this.container.classList.remove('visibile');
      this.container.addEventListener('transitionend', onTransitionEnd);
    });
  }

  _inView (path) {
    if (!this._view) {
      this._loadView(path);
    }

    return new Promise(resolve => {
      const onTransitionEnd = () => {
        this.removeEventListener('transitionend', onTransitionEnd);
        resolve();
      };

      this.classList.add('visibile');
      this.addEventListener('transitionend', onTransitionEnd);
    });
  }

  _loadView (url) {

    this._view = new DocumentFragment();
    const xhr = new XMLHttpRequest();

    xhr.onload = evt => {
      const newDoc = evt.target.response;
      const newView = newDoc.querySelector('[sp-container]');

      newView.childNodes.forEach(node => {
        this._view.appendChild(node);
      });

      this.container.appendChild(this._view);
    };
    xhr.responseType = 'document';
    xhr.open('GET', url[0]);
    xhr.send();
  }
}

new SoulPatch();
