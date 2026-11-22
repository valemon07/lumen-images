import SettingsClient from "./SettingsClient";

export default function Page() {
  return (
    <div className="flex w-full flex-col gap-8 px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b-[1.5px] border-foreground pb-4">
        <h1 className="text-3xl font-black leading-none tracking-[-0.035em] sm:text-4xl">Profile Settings</h1>
      </header>
      <SettingsClient />
    </div>
  );
}
