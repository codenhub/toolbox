class Header extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header
        class="flex py-8 px-4 items-center justify-center bg-background/80 backdrop-blur-sm border-b border-transparent z-99 transition-all duration-400 anim-down-in">
        <div class="sect-container xs:flex-row gap-6 justify-between">
          <a href="/">
            <img src="/logotipo.svg" alt="Logo" class="h-10 w-fit object-contain" />
          </a>

          <!-- SEARCH -->
          <div class="flex gap-4 items-center">
            <div class="relative">
              <input type="text" placeholder="Search" class="peer">
              <button class="absolute size-4 right-4 top-1/2 -translate-y-1/2 text-neutral-600 peer-focus:text-neutral-50 transition duration-400">
                <svg
                  version="1.2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="60"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="m331.5 331.3l154.4 154.6m-102.2-281c0 98.8-80 178.8-178.8 178.8-98.8 0-178.8-80-178.8-178.8 0-98.8 80-178.8 178.8-178.8 98.8 0 178.8 80 178.8 178.8z"/>
                </svg>
              </button>
            </div>
          </div>
          <!-- END SEARCH -->
        </div>
      </header>
    `;
  }
}

customElements.define("custom-header", Header);
