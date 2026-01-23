class Footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="sect">
        <div class="sect-container flex-col gap-8">
          <div class="flex w-full flex-wrap gap-4 items-center justify-between">
            <p>© ${new Date().getFullYear()} Toolbox. All rights reserved.</p>
            <div class="flex gap-2 items-center">
              <p>Made with ❤️ by</p>
              <a href="https://coden.agency/" class="hover:underline">
                <img
                  src="https://coden.agency/logo.svg"
                  alt="Coden logo"
                  class="h-6 brightness-0 invert object-contain"
                >
              </a>
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define("custom-footer", Footer);
