class SoulPatch {

  constructor () {
    const links = Array.from(document.querySelectorAll('a[sp-href]'));
    this.container = document.querySelector('[sp-container]');
    this._classDone();

    links.forEach( link => {
      link.addEventListener('click', evt => {
        evt.preventDefault();
        this.go(evt.target.getAttribute('sp-href'));
      });
    });

    this._spStartEvt = new Event('spStart');
    this._spEndEvt = new Event('spEnt');
  }

  go (url) {
    // TODO: Controllo se ho premuto lo stesso URL
    window.history.pushState(null, null, url);
    this._onChanged();
  }

  _classDone () {
    this.container.classList.remove('loading');
    this.container.classList.add('done');
  }

  _classLoading () {
    this.container.classList.remove('done');
    this.container.classList.add('loading');
  }

  _onChanged () {
    const path = window.location.href;
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
      this._classLoading();
      this.container.addEventListener('transitionend', onTransitionEnd);
      this.container.dispatchEvent(this._spStartEvt);
    });
  }

  _inView (path) {
    this._loadView(path);

    return new Promise(resolve => {
      const onTransitionEnd = () => {
        this.container.removeEventListener('transitionend', onTransitionEnd);
        resolve();
      };

      this._classDone();
      this.container.addEventListener('transitionend', onTransitionEnd);
      this.container.dispatchEvent(this._spEndEvt);
    });
  }

  _loadView (url) {

    this._view = new DocumentFragment();
    const xhr = new XMLHttpRequest();

    xhr.onload = evt => {
      const newDoc = evt.target.response;
      const newView = newDoc.querySelector('[sp-container]');

      if (!newView) {
        console.error(`The View loaded or not exists or not
          contain sp-container attribute`);
        return;
      }

      newView.childNodes.forEach(node => {
        this._view.appendChild(node);
      });

      this.container.innerHTML = '';
      this.container.appendChild(this._view);
    };
    xhr.responseType = 'document';
    xhr.open('GET', url);
    xhr.send();
  }
}

new SoulPatch();
