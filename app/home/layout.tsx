import AccountMenu from "../ui/accounts-menu";

export default function Layout({ children }: { children: React.ReactNode }) {
  <body>
    <div>
      <AccountMenu />
    </div>
    <div>{children}</div>
  </body>;
}
