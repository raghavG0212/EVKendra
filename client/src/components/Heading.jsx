export default function Heading({ heading }) {
  return (
    <div className="font-semibold text-center mb-3 mt-6 uppercase m-2 p-4 rounded-lg flex items-center animated-border border-2 cursor-default">
      <div className="w-full h-1 bg-black dark:bg-white" />
      <h1 className="m-3 text-xl 450px:text-[28px] md:text-3xl font-bold font-serif text-nowrap">{heading}</h1>
      <div className="w-full h-1 bg-black dark:bg-white" />
    </div>
  );
}
