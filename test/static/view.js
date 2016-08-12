
class View extends HTMLElement {

  createdCallback () {
    this._view = null;
    this._isRemote = (this.getAttribute('remote') !== null);
  }

  get route () {
    return this.getAttribute('route') || null;
  }

  _hideSpinner () {
    this.classList.remove('pending');
  }

  _showSpinner () {
    this.classList.add('pending');
  }

  _loadView (url) {
    this._showSpinner();
    this._view = new DocumentFragment();
    const xhr = new XMLHttpRequest();
    xhr.onload = evt => {
      const newDoc = evt.target.response;
      const newView = newDoc.querySelector('app-view.visibile');

      newView.childNodes.forEach(node => {
        this._view.appendChild(node);
      });

      this.appendChild(this._view);
      this._hideSpinner();
    };
    xhr.responseType = 'document';
    xhr.open('GET', url[0]);
    xhr.send();
  }

  inAnimation (data) {
    if (this._isRemote && !this._view) {
      this._loadView(data);
    }

    return new Promise(resolve => {
      const onTransitionEnd = () => {
        this.removeEventListener('transitionend', onTransitionEnd);
        resolve();
      };

      this.classList.add('visibile');
      this.addEventListener('transitionend', onTransitionEnd);
      data = data || null;
    });
  }

  out (data) {
    return new Promise(resolve => {
      const onTransitionEnd = () => {
        this.removeEventListener('transitionend', onTransitionEnd);
        resolve();
      };
      this.classList.remove('visibile');
      this.addEventListener('transitionend', onTransitionEnd);
      data = data || null;
    });
  }

  update (data) {
    return Promise.resolve(data);
  }

}

document.registerElement('app-view', View);
