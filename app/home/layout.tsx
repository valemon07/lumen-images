import AccountMenu from "../ui/accounts-menu";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div>
        <AccountMenu />
      </div>
      <div>{children}</div>
    </div>
  );
}
