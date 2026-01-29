type AlertType = "success" | "error";

interface AlertOptions {
  message: string;
  type: AlertType;
  duration?: number;
}

function getOrCreateContainer(): HTMLDivElement {
  let container = document.getElementById(
    "global-alert-container",
  ) as HTMLDivElement;
  if (!container) {
    container = document.createElement("div");
    container.id = "global-alert-container";
    container.className =
      "fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none";
    document.body.appendChild(container);
  }
  return container;
}

function createAlertElement(options: AlertOptions): HTMLDivElement {
  const div = document.createElement("div");

  let classes =
    "px-4 py-2 rounded-lg shadow-lg text-neutral-50 text-base font-medium transition duration-400 pointer-events-auto min-w-40 ";

  if (options.type === "success") {
    classes += "bg-green-600";
  } else {
    classes += "bg-red-600";
  }

  div.className = classes;
  div.textContent = options.message;

  return div;
}

function removeAlert(alertElement: HTMLDivElement) {
  const container = getOrCreateContainer();
  if (container.contains(alertElement)) {
    container.removeChild(alertElement);
  }
}

export function showAlert(options: AlertOptions) {
  const container = getOrCreateContainer();
  const alertElement = createAlertElement(options);

  if (container.children.length >= 5) {
    if (container.firstElementChild) {
      removeAlert(container.firstElementChild as HTMLDivElement);
    }
  }

  container.appendChild(alertElement);

  setTimeout(() => {
    removeAlert(alertElement);
  }, options.duration || 4000);
}
