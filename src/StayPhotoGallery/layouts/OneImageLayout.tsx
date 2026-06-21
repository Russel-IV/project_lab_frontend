interface LayoutProps {
  images: string[];
  onOpenModal: () => void;
}

export function OneImageLayout({ images, onOpenModal }: LayoutProps) {
  return (
    <div
      className="w-full h-full relative cursor-pointer overflow-hidden group"
      onClick={onOpenModal}
    >
      <img
        src={images[0]}
        alt="Main stay view"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />
      {/* Darkening Hover Overlay */}
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}
