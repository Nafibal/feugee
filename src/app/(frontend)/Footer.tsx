// Mounted once in the frontend root layout, so every public page shares it.
// mt-auto pins it to the viewport bottom on pages shorter than 100vh — the
// body is a flex column and this is its last child.
export const Footer = () => (
  <footer className="mt-auto p-6 flex flex-col gap-y-6 items-stretch justify-start">
    <div></div>
    <div className="@container w-full">
      <h2 className="w-full whitespace-nowrap text-[12.8cqw] font-bold leading-none text-white">
        FEUGEE STUDIO
      </h2>
    </div>
    <div className="w-full h-px bg-neutral-700"></div>
    <div className="w-full flex justify-between items-center">
      <span className="text-sm text-neutral-500">
        &copy; {new Date().getFullYear()} Feugee. All Rights Reserved.
      </span>
      <div className="text-sm text-neutral-500 flex items-center justify-start gap-x-3">
        {/* Pin Icon */}
        <span>Malang, Indonesia</span>
      </div>
      <div className="flex justify-end items-center gap-x-3">
        {/* TODO: Add social media links */}
        <div className="border border-neutral-700 rounded">
          {/* Facebook Icon */}
        </div>
        <div className="border border-neutral-700 rounded">
          {/* Instagram Icon */}
        </div>
        <div className="border border-neutral-700 rounded">
          {/* X Icon */}
        </div>
      </div>
    </div>
  </footer>
);
